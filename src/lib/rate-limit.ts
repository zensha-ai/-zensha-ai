import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { serverEnv } from "@/lib/env";

/**
 * Fixed-window rate limiting. Uses the Postgres `rate_limit_hit` function when
 * the service role is configured (shared across serverless instances); falls
 * back to a per-instance in-memory window otherwise.
 */
const memory = new Map<string, { start: number; count: number }>();

export async function clientIpHash(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${serverEnv.ipHashSalt}:${ip}`).digest("hex").slice(0, 32);
}

export async function rateLimit(bucket: string, limit: number, windowSeconds: number, id?: string): Promise<boolean> {
  const key = `${bucket}:${id ?? (await clientIpHash())}`;
  const db = createSupabaseAdminClient();
  if (db) {
    const { data, error } = await db.rpc("rate_limit_hit", { p_key: key, p_limit: limit, p_window_seconds: windowSeconds });
    if (!error && typeof data === "boolean") return data;
  }
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || now - entry.start > windowSeconds * 1000) {
    memory.set(key, { start: now, count: 1 });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}
