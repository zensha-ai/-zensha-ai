import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { connection } from "next/server";
import { requireAdmin, type SessionUser } from "@/lib/auth";
import { isServiceRoleConfigured, isSupabaseConfigured } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export type AdminContext = { user: SessionUser; db: SupabaseClient };

/**
 * Admin page guard. Returns null when the database is not connected (the page
 * then renders the "Database not connected" panel — no data can be exposed).
 * Otherwise it enforces the admin role (redirects) and returns a service-role client.
 */
export async function getAdminContext(): Promise<AdminContext | null> {
  await connection();
  if (!isSupabaseConfigured()) return null;
  const user = await requireAdmin();
  if (!isServiceRoleConfigured()) return null;
  const db = createSupabaseAdminClient();
  if (!db) return null;
  return { user, db };
}
