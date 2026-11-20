"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { assertAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { services as codeServices } from "@/content/services";
import { generalFaqs } from "@/content/site";
import { nest, parseForm, type FormState } from "./fields";
import { getResource } from "./resources";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function adminDb() {
  const user = await assertAdmin();
  const db = createSupabaseAdminClient();
  if (!db) throw new Error("DATABASE_NOT_CONFIGURED");
  return { user, db };
}

const uuid = z.uuid();

function revalidateAll(paths: string[]) {
  for (const p of paths) revalidatePath(p);
}

function dbErrorMessage(error: { code?: string; message: string }): { field?: string; message: string } {
  if (error.code === "23505") return { field: "slug", message: "This value is already used by another record." };
  if (error.code === "23503") return { message: "This record is referenced elsewhere (for example by an order) and cannot be changed this way." };
  if (error.code === "23514") return { message: "The database rejected these values (a consistency rule failed). Check pricing, free/paid and shipping fields." };
  console.error("[admin] database error", error);
  return { message: "The database could not save this change. Please try again." };
}

const back = (path: string, params: Record<string, string>) => `${path}?${new URLSearchParams(params).toString()}`;

// ---------------------------------------------------------------------------
// Generic resource CRUD
// ---------------------------------------------------------------------------
export async function saveResource(resourceKey: string, id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  const resource = getResource(resourceKey);
  if (!resource) return { ok: false, message: "Unknown resource." };
  const { db } = await adminDb();

  const parsed = parseForm(resource.fields, formData, resource.refine);
  if (!parsed.ok) return { ok: false, message: "Please correct the highlighted fields.", errors: parsed.errors, values: parsed.values };

  let row: Record<string, unknown>;
  if (resource.jsonbColumn) {
    const top = resource.topLevel ?? [];
    const docFlat = Object.fromEntries(Object.entries(parsed.data).filter(([k]) => !top.includes(k)));
    const doc = nest(docFlat);
    row = { ...Object.fromEntries(top.map((k) => [k, parsed.data[k]])), [resource.jsonbColumn]: doc };
    if (resource.idColumn === "slug") row.slug = doc.slug;
  } else {
    row = nest(parsed.data);
  }
  if (resource.beforeSave) row = resource.beforeSave(row);

  let newId: string | null = null;
  if (id) {
    if (resource.idColumn === "id" && !uuid.safeParse(id).success) return { ok: false, message: "Invalid record id." };
    const { error } = await db.from(resource.table).update(row).eq(resource.idColumn, id);
    if (error) {
      const m = dbErrorMessage(error);
      return { ok: false, message: m.message, errors: m.field ? { [m.field]: m.message } : undefined, values: parsed.values };
    }
  } else {
    const { data, error } = await db.from(resource.table).insert(row).select(resource.idColumn).single();
    if (error) {
      const m = dbErrorMessage(error);
      return { ok: false, message: m.message, errors: m.field ? { [m.field]: m.message } : undefined, values: parsed.values };
    }
    newId = String((data as Record<string, unknown>)[resource.idColumn]);
  }

  const slugForPaths = (row.slug ?? (row[resource.jsonbColumn ?? ""] as Record<string, unknown> | undefined)?.slug) as string | undefined;
  revalidateAll(resource.revalidate({ ...row, slug: slugForPaths }));
  revalidatePath(`/admin/${resource.key}`);

  if (newId) redirect(`/admin/${resource.key}/${encodeURIComponent(newId)}?saved=1`);
  // A slug-keyed record whose slug changed now lives at a new URL.
  if (resource.idColumn === "slug" && slugForPaths && slugForPaths !== id) {
    redirect(`/admin/${resource.key}/${encodeURIComponent(slugForPaths)}?saved=1`);
  }
  return { ok: true, message: "Saved. Public pages have been refreshed." };
}

export async function deleteResource(resourceKey: string, id: string): Promise<void> {
  const resource = getResource(resourceKey);
  if (!resource) redirect("/admin");
  const { db } = await adminDb();
  if (resource.idColumn === "id" && !uuid.safeParse(id).success) redirect(back(`/admin/${resource.key}`, { error: "Invalid id." }));

  const { data: existing } = await db.from(resource.table).select("*").eq(resource.idColumn, id).maybeSingle();
  if (!existing) redirect(back(`/admin/${resource.key}`, { error: "Record not found." }));

  // Remove protected files from storage before the project row (cascade only removes metadata).
  let storagePaths: string[] = [];
  if (resource.table === "student_projects") {
    const { count } = await db.from("order_items").select("id", { count: "exact", head: true }).eq("project_id", id);
    if ((count ?? 0) > 0) {
      redirect(back(`/admin/${resource.key}/${id}`, { error: "This project has orders and cannot be deleted. Unpublish it instead." }));
    }
    const { data: files } = await db.from("project_files").select("storage_path").eq("project_id", id);
    storagePaths = (files ?? []).map((f) => f.storage_path as string);
  }

  const { error } = await db.from(resource.table).delete().eq(resource.idColumn, id);
  if (error) redirect(back(`/admin/${resource.key}/${encodeURIComponent(id)}`, { error: dbErrorMessage(error).message }));
  if (storagePaths.length) await db.storage.from("project-files").remove(storagePaths);

  const slug = (existing as Record<string, unknown>).slug as string | undefined;
  revalidateAll(resource.revalidate({ ...(existing as Record<string, unknown>), slug }));
  redirect(back(`/admin/${resource.key}`, { deleted: "1" }));
}

// ---------------------------------------------------------------------------
// Seed from code (idempotent)
// ---------------------------------------------------------------------------
export async function seedFromCode(_prev: FormState, formData: FormData): Promise<FormState> {
  const { db } = await adminDb();
  const overwrite = formData.get("overwrite") === "on";

  const rows = codeServices.map((s, i) => ({ slug: s.slug, position: i, data: s, published: true }));
  const { error: svcError } = await db
    .from("services")
    .upsert(rows, { onConflict: "slug", ignoreDuplicates: !overwrite });
  if (svcError) return { ok: false, message: dbErrorMessage(svcError).message };

  const { data: existing, error: faqReadError } = await db.from("faqs").select("question").eq("scope", "general");
  if (faqReadError) return { ok: false, message: dbErrorMessage(faqReadError).message };
  const have = new Set((existing ?? []).map((r) => (r.question as string).trim().toLowerCase()));
  const missing = generalFaqs
    .map((f, i) => ({ scope: "general", question: f.q, answer: f.a, position: i, published: true }))
    .filter((f) => !have.has(f.question.trim().toLowerCase()));
  if (missing.length) {
    const { error } = await db.from("faqs").insert(missing);
    if (error) return { ok: false, message: dbErrorMessage(error).message };
  }

  revalidatePath("/", "layout");
  return {
    ok: true,
    message: `${overwrite ? "Upserted" : "Inserted any missing of"} ${rows.length} services; added ${missing.length} general FAQ${missing.length === 1 ? "" : "s"}.`,
  };
}

// ---------------------------------------------------------------------------
// Enquiries
// ---------------------------------------------------------------------------
const enquiryStatus = z.enum(["new", "in_progress", "closed", "spam"]);

export async function updateEnquiryStatus(formData: FormData): Promise<void> {
  const { db } = await adminDb();
  const id = uuid.parse(formData.get("id"));
  const status = enquiryStatus.parse(formData.get("status"));
  const { error } = await db.from("enquiries").update({ status }).eq("id", id);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  redirect(back(`/admin/enquiries/${id}`, error ? { error: "Could not update status." } : { saved: "1" }));
}

// ---------------------------------------------------------------------------
// Orders — admins can never mark an order as paid manually.
// ---------------------------------------------------------------------------
export async function updateOrderStatus(formData: FormData): Promise<void> {
  const { db } = await adminDb();
  const id = uuid.parse(formData.get("id"));
  const target = z.enum(["refunded", "cancelled"]).parse(formData.get("status"));
  const { data: order } = await db.from("orders").select("status").eq("id", id).maybeSingle();
  if (!order) redirect(back("/admin/orders", { error: "Order not found." }));

  const allowed = target === "refunded" ? order.status === "paid" : order.status === "pending" || order.status === "failed";
  if (!allowed) redirect(back(`/admin/orders/${id}`, { error: `An order that is ${order.status} cannot be marked ${target}.` }));

  const { error } = await db.from("orders").update({ status: target }).eq("id", id).eq("status", order.status);
  if (error) redirect(back(`/admin/orders/${id}`, { error: "Could not update the order." }));
  if (target === "refunded") {
    await db.from("entitlements").update({ revoked: true }).eq("order_id", id).eq("source", "purchase");
  }
  revalidatePath("/admin/orders");
  redirect(back(`/admin/orders/${id}`, { saved: "1" }));
}

// ---------------------------------------------------------------------------
// Customers / roles
// ---------------------------------------------------------------------------
export async function setUserRole(formData: FormData): Promise<void> {
  const { user, db } = await adminDb();
  const id = uuid.parse(formData.get("id"));
  const role = z.enum(["customer", "admin"]).parse(formData.get("role"));
  if (id === user.id) redirect(back("/admin/customers", { error: "You cannot change your own role." }));
  const { error } = await db.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/admin/customers");
  redirect(back("/admin/customers", error ? { error: "Could not change the role." } : { saved: "1" }));
}

// ---------------------------------------------------------------------------
// Entitlements (download permissions)
// ---------------------------------------------------------------------------
async function findUserIdByEmail(db: NonNullable<ReturnType<typeof createSupabaseAdminClient>>, email: string) {
  const target = email.trim().toLowerCase();
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return null;
    const hit = data.users.find((u) => u.email?.toLowerCase() === target);
    if (hit) return hit.id;
    if (data.users.length < 1000) return null;
  }
  return null;
}

const grantSchema = z.object({
  email: z.email("Enter the customer’s account email."),
  project_id: z.uuid("Choose a project."),
  expires_at: z
    .string()
    .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Use a valid date.")
    .transform((v) => (v === "" ? null : new Date(`${v}T23:59:59Z`).toISOString())),
});

export async function grantEntitlement(_prev: FormState, formData: FormData): Promise<FormState> {
  const { db } = await adminDb();
  const values = {
    email: String(formData.get("email") ?? ""),
    project_id: String(formData.get("project_id") ?? ""),
    expires_at: String(formData.get("expires_at") ?? ""),
  };
  const parsed = grantSchema.safeParse(values);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.issues.forEach((i) => (errors[String(i.path[0])] ??= i.message));
    return { ok: false, message: "Please correct the highlighted fields.", errors, values };
  }
  const userId = await findUserIdByEmail(db, parsed.data.email);
  if (!userId) return { ok: false, errors: { email: "No account uses this email. The customer must register first." }, values };

  const { data: existing } = await db.from("entitlements").select("id").eq("user_id", userId).eq("project_id", parsed.data.project_id).maybeSingle();
  const { error } = existing
    ? await db.from("entitlements").update({ revoked: false, expires_at: parsed.data.expires_at }).eq("id", existing.id)
    : await db.from("entitlements").insert({
        user_id: userId,
        project_id: parsed.data.project_id,
        source: "admin_grant",
        expires_at: parsed.data.expires_at,
      });
  if (error) return { ok: false, message: dbErrorMessage(error).message, values };
  revalidatePath("/admin/entitlements");
  return { ok: true, message: existing ? "Existing access restored and updated." : "Access granted." };
}

export async function toggleEntitlement(formData: FormData): Promise<void> {
  const { db } = await adminDb();
  const id = uuid.parse(formData.get("id"));
  const revoked = formData.get("revoked") === "true";
  await db.from("entitlements").update({ revoked }).eq("id", id);
  revalidatePath("/admin/entitlements");
  redirect(back("/admin/entitlements", { saved: "1" }));
}

export async function setEntitlementExpiry(formData: FormData): Promise<void> {
  const { db } = await adminDb();
  const id = uuid.parse(formData.get("id"));
  const raw = String(formData.get("expires_at") ?? "");
  if (raw !== "" && !/^\d{4}-\d{2}-\d{2}$/.test(raw)) redirect(back("/admin/entitlements", { error: "Invalid expiry date." }));
  await db
    .from("entitlements")
    .update({ expires_at: raw ? new Date(`${raw}T23:59:59Z`).toISOString() : null })
    .eq("id", id);
  revalidatePath("/admin/entitlements");
  redirect(back("/admin/entitlements", { saved: "1" }));
}

// ---------------------------------------------------------------------------
// Uploads — the browser uploads directly to Storage with a one-time signed
// upload URL issued here (large ZIPs never pass through a server function).
// The server generates the object path and re-verifies type and size after upload.
// ---------------------------------------------------------------------------
const UPLOAD_RULES = {
  "project-file": { bucket: "project-files", maxBytes: 500 * 1024 * 1024, exts: [".zip", ".pdf", ".7z"] },
  media: {
    bucket: "media",
    maxBytes: 10 * 1024 * 1024,
    exts: [".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"],
    mimes: ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"],
  },
} as const;

type UploadKind = keyof typeof UPLOAD_RULES;

const safeName = (name: string) => {
  const lower = name.toLowerCase();
  const dot = lower.lastIndexOf(".");
  const base = (dot > 0 ? lower.slice(0, dot) : lower).replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "file";
  return { base, ext: dot > 0 ? lower.slice(dot) : "" };
};

export async function createUploadTarget(input: {
  kind: UploadKind;
  projectId?: string;
  fileName: string;
  size: number;
}): Promise<{ ok: true; bucket: string; path: string; token: string } | { ok: false; message: string }> {
  const { db } = await adminDb();
  const rules = UPLOAD_RULES[input.kind];
  if (!rules) return { ok: false, message: "Unknown upload type." };
  const { base, ext } = safeName(String(input.fileName ?? ""));
  if (!(rules.exts as readonly string[]).includes(ext)) return { ok: false, message: `Allowed file types: ${rules.exts.join(", ")}` };
  if (!Number.isFinite(input.size) || input.size <= 0 || input.size > rules.maxBytes)
    return { ok: false, message: `Files must be under ${Math.round(rules.maxBytes / 1024 / 1024)} MB.` };

  let path: string;
  if (input.kind === "project-file") {
    if (!uuid.safeParse(input.projectId).success) return { ok: false, message: "Choose a project first." };
    const { data: project } = await db.from("student_projects").select("id").eq("id", input.projectId!).maybeSingle();
    if (!project) return { ok: false, message: "Project not found." };
    path = `${input.projectId}/${randomUUID()}-${base}${ext}`;
  } else {
    path = `${new Date().getUTCFullYear()}/${randomUUID()}-${base}${ext}`;
  }
  const { data, error } = await db.storage.from(rules.bucket).createSignedUploadUrl(path);
  if (error || !data) return { ok: false, message: "Storage did not accept the upload request. Check that the bucket exists." };
  return { ok: true, bucket: rules.bucket, path: data.path, token: data.token };
}

const PROJECT_PATH_RE = /^[0-9a-f-]{36}\/[0-9a-f-]{36}-[a-z0-9._-]+\.(zip|pdf|7z)$/;
const MEDIA_PATH_RE = /^\d{4}\/[0-9a-f-]{36}-[a-z0-9._-]+\.(png|jpe?g|webp|avif|gif)$/;

export async function finalizeUpload(input: {
  kind: UploadKind;
  path: string;
  projectId?: string;
  label?: string;
  alt?: string;
  isFreePreview?: boolean;
}): Promise<{ ok: boolean; message: string }> {
  const { db } = await adminDb();
  const rules = UPLOAD_RULES[input.kind];
  if (!rules) return { ok: false, message: "Unknown upload type." };
  const path = String(input.path ?? "");
  const pathOk = input.kind === "project-file" ? PROJECT_PATH_RE.test(path) && path.startsWith(`${input.projectId}/`) : MEDIA_PATH_RE.test(path);
  if (!pathOk) return { ok: false, message: "Unexpected upload path." };

  const { data: info, error } = await db.storage.from(rules.bucket).info(path);
  if (error || !info) return { ok: false, message: "The uploaded file could not be found in storage." };
  const size = Number(info.size ?? 0);
  const mime = String(info.contentType ?? "");
  const badMime = "mimes" in rules && !(rules.mimes as readonly string[]).includes(mime);
  if (size <= 0 || size > rules.maxBytes || badMime) {
    await db.storage.from(rules.bucket).remove([path]);
    return { ok: false, message: badMime ? "That file type is not allowed." : "That file is too large." };
  }

  if (input.kind === "project-file") {
    const label = String(input.label ?? "").trim().slice(0, 200);
    if (!label) {
      await db.storage.from(rules.bucket).remove([path]);
      return { ok: false, message: "Give the file a label customers will see, e.g. “Source code (ZIP)”." };
    }
    const { error: insertError } = await db
      .from("project_files")
      .insert({ project_id: input.projectId, label, storage_path: path, size_bytes: size, is_free_preview: Boolean(input.isFreePreview) });
    if (insertError) {
      await db.storage.from(rules.bucket).remove([path]);
      return { ok: false, message: dbErrorMessage(insertError).message };
    }
    revalidatePath("/admin/files");
  } else {
    const alt = String(input.alt ?? "").trim().slice(0, 300);
    const { error: insertError } = await db.from("media").insert({ path, alt });
    if (insertError) {
      await db.storage.from(rules.bucket).remove([path]);
      return { ok: false, message: dbErrorMessage(insertError).message };
    }
    revalidatePath("/admin/media");
  }
  return { ok: true, message: "Uploaded." };
}

export async function deleteProjectFile(formData: FormData): Promise<void> {
  const { db } = await adminDb();
  const id = uuid.parse(formData.get("id"));
  const { data: file } = await db.from("project_files").select("storage_path, project_id").eq("id", id).maybeSingle();
  if (!file) redirect(back("/admin/files", { error: "File not found." }));
  const { error: storageError } = await db.storage.from("project-files").remove([file.storage_path]);
  if (storageError) redirect(back("/admin/files", { project: file.project_id, error: "Storage could not delete the object; the record was kept." }));
  await db.from("project_files").delete().eq("id", id);
  revalidatePath("/admin/files");
  redirect(back("/admin/files", { project: file.project_id, deleted: "1" }));
}

export async function toggleFilePreview(formData: FormData): Promise<void> {
  const { db } = await adminDb();
  const id = uuid.parse(formData.get("id"));
  const value = formData.get("value") === "true";
  const { data: file } = await db.from("project_files").update({ is_free_preview: value }).eq("id", id).select("project_id").maybeSingle();
  revalidatePath("/admin/files");
  redirect(back("/admin/files", { project: String(file?.project_id ?? ""), saved: "1" }));
}

/** Short-lived link so an admin can verify an uploaded protected file. */
export async function adminFileLink(formData: FormData): Promise<void> {
  const { db } = await adminDb();
  const id = uuid.parse(formData.get("id"));
  const { data: file } = await db.from("project_files").select("storage_path").eq("id", id).maybeSingle();
  if (!file) redirect(back("/admin/files", { error: "File not found." }));
  const { data } = await db.storage.from("project-files").createSignedUrl(file.storage_path, 60, { download: true });
  if (!data?.signedUrl) redirect(back("/admin/files", { error: "Could not create a download link." }));
  redirect(data.signedUrl);
}

export async function deleteMedia(formData: FormData): Promise<void> {
  const { db } = await adminDb();
  const id = uuid.parse(formData.get("id"));
  const { data: item } = await db.from("media").select("path").eq("id", id).maybeSingle();
  if (item) {
    await db.storage.from("media").remove([item.path]);
    await db.from("media").delete().eq("id", id);
  }
  revalidatePath("/admin/media");
  redirect(back("/admin/media", { deleted: "1" }));
}

// ---------------------------------------------------------------------------
// Site settings (homepage content, contact details, per-page SEO overrides)
// ---------------------------------------------------------------------------
const SETTING_KEY_RE = /^(?:[a-z][a-z0-9_-]{1,40}|seo:\/[a-z0-9\-/_]{0,120})$/;

const settingSchemas: Record<string, z.ZodType> = {
  contact: z
    .object({
      email: z.email().optional(),
      whatsapp: z.string().regex(/^\d{8,15}$/, "WhatsApp must be digits only, with country code.").optional(),
      location: z.string().max(200).optional(),
      hours: z.string().max(200).optional(),
    })
    .strict(),
};
const seoSettingSchema = z
  .object({ title: z.string().max(80).optional(), description: z.string().max(220).optional(), noindex: z.boolean().optional() })
  .strict();

export async function saveSetting(_prev: FormState, formData: FormData): Promise<FormState> {
  const { db } = await adminDb();
  const key = String(formData.get("key") ?? "").trim();
  const raw = String(formData.get("value") ?? "");
  const original = String(formData.get("original_key") ?? "");
  const values = { key, value: raw };

  if (!SETTING_KEY_RE.test(key))
    return { ok: false, errors: { key: "Use a lowercase key (e.g. home, contact) or seo:/path (e.g. seo:/about)." }, values };

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { ok: false, errors: { value: "This is not valid JSON." }, values };
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, errors: { value: "The value must be a JSON object { … }." }, values };

  const schema = key.startsWith("seo:") ? seoSettingSchema : settingSchemas[key];
  if (schema) {
    const r = schema.safeParse(value);
    if (!r.success) {
      const i = r.error.issues[0];
      return { ok: false, errors: { value: `${i.path.join(".") || "value"}: ${i.message}` }, values };
    }
  }

  const { error } = await db.from("site_settings").upsert({ key, value }, { onConflict: "key" });
  if (error) return { ok: false, message: dbErrorMessage(error).message, values };
  if (original && original !== key) await db.from("site_settings").delete().eq("key", original);

  revalidatePath("/", "layout");
  if (original !== key) redirect(back("/admin/settings/edit", { key, saved: "1" }));
  return { ok: true, message: "Setting saved. Public pages have been refreshed." };
}

export async function deleteSetting(formData: FormData): Promise<void> {
  const { db } = await adminDb();
  const key = String(formData.get("key") ?? "");
  if (!SETTING_KEY_RE.test(key)) redirect("/admin/settings");
  await db.from("site_settings").delete().eq("key", key);
  revalidatePath("/", "layout");
  redirect(back("/admin/settings", { deleted: "1" }));
}
