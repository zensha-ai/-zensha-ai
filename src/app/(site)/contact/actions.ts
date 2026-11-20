"use server";

import { headers } from "next/headers";
import { enquirySchema, isPlausibleTiming } from "@/lib/validation/enquiry";
import { clientIpHash, rateLimit } from "@/lib/rate-limit";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export type EnquiryState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string>; values?: Record<string, string> };

const GENERIC_ERROR = "We could not submit your enquiry right now. Please try again or use the contact details below.";

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => typeof v === "string").map(([k, v]) => [k, String(v)]),
  ) as Record<string, string>;
  const { company_website, started_at, ...fields } = raw;

  // Spam controls: honeypot + minimum fill time. Respond as success so bots learn nothing.
  if (company_website || !isPlausibleTiming(started_at)) return { status: "success" };

  if (!(await rateLimit("enquiry", 5, 60 * 10))) {
    return { status: "error", message: "Too many submissions from this connection. Please wait a few minutes and try again.", values: fields };
  }

  const parsed = enquirySchema.safeParse(fields);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors, values: fields };
  }

  const db = createSupabaseAdminClient();
  if (!db) {
    // No fake success: storage is not configured.
    console.error("[enquiry] Supabase service role is not configured — enquiry not stored.");
    return { status: "error", message: GENERIC_ERROR, values: fields };
  }

  const d = parsed.data;
  const ua = (await headers()).get("user-agent")?.slice(0, 300) ?? null;
  const { error } = await db.from("enquiries").insert({
    kind: d.kind,
    name: d.name,
    email: d.email,
    phone: d.kind === "business" ? (d.phone ?? null) : null,
    company: d.kind === "business" ? (d.company ?? null) : null,
    service: d.service,
    budget: d.kind === "business" ? (d.budget ?? null) : null,
    timeline: d.kind === "business" ? (d.timeline ?? null) : null,
    order_reference: d.kind === "student_support" ? (d.order_reference ?? null) : null,
    message: d.message,
    ip_hash: await clientIpHash(),
    user_agent: ua,
  });
  if (error) {
    console.error("[enquiry] insert failed", error.message);
    return { status: "error", message: GENERIC_ERROR, values: fields };
  }
  return { status: "success" };
}
