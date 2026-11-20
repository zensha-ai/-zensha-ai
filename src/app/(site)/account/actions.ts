"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ProfileState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> } | undefined;

export async function updateProfile(_: ProfileState, form: FormData): Promise<ProfileState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in again." };
  const parsed = z
    .object({
      full_name: z.string().trim().min(2, "Enter your name.").max(120),
      phone: z
        .string()
        .trim()
        .max(20)
        .regex(/^$|^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number.")
        .optional(),
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return { fieldErrors: Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])) };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Accounts are not available yet." };
  // RLS restricts this update to the user's own row; a trigger blocks role changes.
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.full_name, phone: parsed.data.phone || null })
    .eq("id", user.id);
  if (error) return { error: "We couldn't save your profile. Please try again." };
  revalidatePath("/account", "layout");
  return { ok: true };
}
