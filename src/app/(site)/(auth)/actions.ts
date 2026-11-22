"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { brand } from "@/config/brand";
import { safeNext } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string; fieldErrors?: Record<string, string> } | undefined;

const NOT_CONFIGURED = "Accounts are not available yet — the database isn't connected.";
const TOO_MANY = "Too many attempts. Please wait a few minutes and try again.";

const fieldErrors = (e: z.ZodError) =>
  Object.fromEntries(e.issues.map((i) => [String(i.path[0] ?? "form"), i.message])) as Record<string, string>;

const email = z.string().trim().toLowerCase().email("Enter a valid email address.").max(254);
const password = z.string().min(10, "Use at least 10 characters.").max(128);

export async function signIn(_: AuthState, form: FormData): Promise<AuthState> {
  const parsed = z
    .object({ email, password: z.string().min(1, "Enter your password.").max(128), next: z.string().optional() })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  if (!(await rateLimit("login", 10, 600))) return { error: TOO_MANY };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: NOT_CONFIGURED };
  const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (error?.code === "email_not_confirmed") {
    // The account exists but was never confirmed: send a fresh link and say so plainly.
    await supabase.auth.resend({
      type: "signup",
      email: parsed.data.email,
      options: { emailRedirectTo: `${brand.siteUrl}/auth/callback?next=${encodeURIComponent(safeNext(parsed.data.next))}` },
    });
    return { error: "Your email isn't confirmed yet. We've sent a new confirmation link — open it from your inbox, then sign in." };
  }
  if (error) return { error: "We couldn't sign you in with those details. Check your email and password and try again." };
  redirect(safeNext(parsed.data.next));
}

export async function signUp(_: AuthState, form: FormData): Promise<AuthState> {
  const parsed = z
    .object({
      full_name: z.string().trim().min(2, "Enter your name.").max(120),
      email,
      password,
      accept: z.literal("on", { message: "Please accept the Terms and Privacy Policy." }),
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  if (!(await rateLimit("register", 5, 3600))) return { error: TOO_MANY };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: NOT_CONFIGURED };
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
      emailRedirectTo: `${brand.siteUrl}/auth/callback?next=/account`,
    },
  });
  if (error && !/registered|exists/i.test(error.message)) {
    return { error: "We couldn't create your account right now. Please try again." };
  }
  // Same response whether or not the address already has an account.
  return {
    message: "Check your inbox. If this email can be used for a new account, we've sent a confirmation link to finish signing up.",
  };
}

export async function requestPasswordReset(_: AuthState, form: FormData): Promise<AuthState> {
  const parsed = z.object({ email }).safeParse(Object.fromEntries(form));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  if (!(await rateLimit("reset", 5, 3600))) return { error: TOO_MANY };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: NOT_CONFIGURED };
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${brand.siteUrl}/auth/callback?next=/reset-password`,
  });
  return { message: "If an account exists for that email, a password reset link is on its way." };
}

export async function updatePassword(_: AuthState, form: FormData): Promise<AuthState> {
  const parsed = z
    .object({ password, confirm: z.string() })
    .refine((v) => v.password === v.confirm, { message: "Passwords do not match.", path: ["confirm"] })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  if (!(await rateLimit("update-password", 10, 3600))) return { error: TOO_MANY };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: NOT_CONFIGURED };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Your reset link has expired. Please request a new one." };
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: "We couldn't update your password. Please request a new reset link and try again." };
  redirect("/account?updated=password");
}
