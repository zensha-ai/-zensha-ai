import "server-only";
import { cache } from "react";
import { OFFER_KEY, parseOffer, type Offer } from "@/content/offer";
import { services as seedServices } from "@/content/services";
import { generalFaqs } from "@/content/site";
import { builtInWork, getBuiltInWork } from "@/content/work";
import type { Article, ArticleKind, Faq, Product, Service, StudentProject, WorkItem } from "@/content/types";
import { createSupabasePublicClient } from "@/lib/supabase/server";

/**
 * Content repository. Public reads use the anonymous client (RLS: published only).
 * When Supabase is not configured, typed seed content is returned for the
 * marketing pages and catalogues return empty lists (honest empty states).
 */

export async function getServices(): Promise<Service[]> {
  const db = createSupabasePublicClient();
  if (!db) return seedServices;
  const { data, error } = await db.from("services").select("data").eq("published", true).order("position");
  if (error || !data?.length) return seedServices;
  return data.map((r) => r.data as Service);
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  return (await getServices()).find((s) => s.slug === slug);
}

export async function getFaqs(scope = "general"): Promise<Faq[]> {
  const db = createSupabasePublicClient();
  if (!db) return scope === "general" ? generalFaqs : [];
  const { data, error } = await db
    .from("faqs")
    .select("question, answer")
    .eq("published", true)
    .eq("scope", scope)
    .order("position");
  if (error || !data?.length) return scope === "general" ? generalFaqs : [];
  return data.map((r) => ({ q: r.question, a: r.answer }));
}

export async function getSetting<T>(key: string): Promise<T | null> {
  const db = createSupabasePublicClient();
  if (!db) return null;
  const { data } = await db.from("site_settings").select("value").eq("key", key).maybeSingle();
  return (data?.value as T) ?? null;
}

/** Current site-wide offer from Admin → Offers & discounts (no offer when unset). */
export const getOffer = cache(async (): Promise<Offer> => parseOffer(await getSetting<unknown>(OFFER_KEY)));

export async function getProducts(): Promise<Product[]> {
  const db = createSupabasePublicClient();
  if (!db) return [];
  const { data, error } = await db.from("products").select("*").eq("published", true).order("name");
  if (error) return [];
  return data as Product[];
}

export async function getProduct(slug: string): Promise<Product | null> {
  const db = createSupabasePublicClient();
  if (!db) return null;
  const { data } = await db.from("products").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return (data as Product) ?? null;
}

export async function getStudentProjects(): Promise<StudentProject[]> {
  const db = createSupabasePublicClient();
  if (!db) return [];
  const { data, error } = await db.from("student_projects").select("*").eq("published", true).order("title");
  if (error) return [];
  return data as StudentProject[];
}

export async function getStudentProject(slug: string): Promise<StudentProject | null> {
  const db = createSupabasePublicClient();
  if (!db) return null;
  const { data } = await db.from("student_projects").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return (data as StudentProject) ?? null;
}

export async function getProjectFileLabels(projectId: string): Promise<{ id: string; label: string; is_free_preview: boolean }[]> {
  const db = createSupabasePublicClient();
  if (!db) return [];
  const { data } = await db.from("project_files").select("id, label, is_free_preview").eq("project_id", projectId);
  return data ?? [];
}

export async function getArticles(kind?: ArticleKind): Promise<Article[]> {
  const db = createSupabasePublicClient();
  if (!db) return [];
  let q = db.from("articles").select("*").eq("published", true).order("published_at", { ascending: false });
  if (kind) q = q.eq("kind", kind);
  const { data, error } = await q;
  if (error) return [];
  return data as Article[];
}

export async function getArticle(kind: ArticleKind, slug: string): Promise<Article | null> {
  const db = createSupabasePublicClient();
  if (!db) return null;
  const { data } = await db.from("articles").select("*").eq("kind", kind).eq("slug", slug).eq("published", true).maybeSingle();
  return (data as Article) ?? null;
}

export async function getWorkItems(kind?: WorkItem["kind"]): Promise<WorkItem[]> {
  const builtIn = builtInWork.filter((w) => !kind || w.kind === kind);
  const db = createSupabasePublicClient();
  if (!db) return builtIn;
  let q = db.from("work_items").select("*").eq("published", true).order("created_at", { ascending: false });
  if (kind) q = q.eq("kind", kind);
  const { data, error } = await q;
  const rows = error ? [] : (data as WorkItem[]);
  // Database rows win over a built-in entry with the same slug.
  return [...builtIn.filter((b) => !rows.some((r) => r.slug === b.slug)), ...rows];
}

export async function getWorkItem(slug: string): Promise<WorkItem | null> {
  const db = createSupabasePublicClient();
  if (db) {
    const { data } = await db.from("work_items").select("*").eq("slug", slug).eq("published", true).maybeSingle();
    if (data) return data as WorkItem;
  }
  return getBuiltInWork(slug) ?? null;
}
