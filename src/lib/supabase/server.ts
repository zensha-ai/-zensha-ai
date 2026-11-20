import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient as createPlainClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { isServiceRoleConfigured, isSupabaseConfigured, publicEnv, serverEnv } from "@/lib/env";

/** Per-request client bound to the user's auth cookies (RLS applies). */
export async function createSupabaseServerClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();
  return createServerClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component — the proxy refreshes the session instead.
        }
      },
    },
  });
}

/** Cookie-less anonymous client for public, cacheable reads (RLS applies). */
export function createSupabasePublicClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createPlainClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Service-role client. BYPASSES RLS. Only call after the caller has been
 * authenticated and authorized in server code (webhooks, checkout, admin, downloads).
 */
export function createSupabaseAdminClient(): SupabaseClient | null {
  if (!isServiceRoleConfigured()) return null;
  return createPlainClient(publicEnv.supabaseUrl, serverEnv.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
