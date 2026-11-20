"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export type ClaimResult = { ok: true } | { ok: false; reason: "auth" | "unavailable" | "error" | "rate"; message: string };

/** Grants a free-project entitlement to the signed-in user. */
export async function claimFreeProject(projectId: string): Promise<ClaimResult> {
  if (!z.string().uuid().safeParse(projectId).success) return { ok: false, reason: "unavailable", message: "Project not found." };
  const user = await getCurrentUser();
  if (!user) return { ok: false, reason: "auth", message: "Please sign in to download free projects." };
  if (!(await rateLimit("claim", 20, 600, user.id))) return { ok: false, reason: "rate", message: "Too many requests. Please wait a few minutes." };

  const db = createSupabaseAdminClient();
  if (!db) return { ok: false, reason: "unavailable", message: "Downloads are not available yet." };

  const { data: project } = await db
    .from("student_projects")
    .select("id, published, is_free, is_example")
    .eq("id", projectId)
    .maybeSingle();
  if (!project || !project.published || !project.is_free || project.is_example) {
    return { ok: false, reason: "unavailable", message: "This project isn't available as a free download." };
  }

  // ignoreDuplicates: never downgrade/overwrite an existing (e.g. revoked) entitlement.
  const { error } = await db
    .from("entitlements")
    .upsert({ user_id: user.id, project_id: project.id, source: "free" }, { onConflict: "user_id,project_id", ignoreDuplicates: true });
  if (error) return { ok: false, reason: "error", message: "We couldn't add this project right now. Please try again." };

  revalidatePath("/account/downloads");
  return { ok: true };
}
