"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui";
import { Notice, TextField } from "@/components/commerce/fields";
import { requestPasswordReset, signIn, signUp, updatePassword, type AuthState } from "./actions";

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" disabled={pending} className="w-full" aria-busy={pending}>
      {pending ? "Please wait…" : children}
    </Button>
  );
}

function Feedback({ state }: { state: AuthState }) {
  if (state?.error) return <Notice tone="error">{state.error}</Notice>;
  if (state?.message) return <Notice tone="success">{state.message}</Notice>;
  return null;
}

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signIn, undefined);
  return (
    <form action={action} className="grid gap-5" noValidate>
      <Feedback state={state} />
      <input type="hidden" name="next" value={next} />
      <TextField label="Email" name="email" type="email" required autoComplete="email" error={state?.fieldErrors?.email} />
      <TextField label="Password" name="password" type="password" required autoComplete="current-password" error={state?.fieldErrors?.password} />
      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-sm text-ink-2 underline underline-offset-4 hover:text-ink">
          Forgot password?
        </Link>
      </div>
      <Submit pending={pending}>Sign in</Submit>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(signUp, undefined);
  if (state?.message) return <Notice tone="success">{state.message}</Notice>;
  return (
    <form action={action} className="grid gap-5" noValidate>
      <Feedback state={state} />
      <TextField label="Full name" name="full_name" required autoComplete="name" error={state?.fieldErrors?.full_name} />
      <TextField label="Email" name="email" type="email" required autoComplete="email" error={state?.fieldErrors?.email} />
      <TextField
        label="Password"
        name="password"
        type="password"
        required
        minLength={10}
        autoComplete="new-password"
        hint="At least 10 characters."
        error={state?.fieldErrors?.password}
      />
      <div>
        <label className="flex items-start gap-3 text-sm text-ink-2">
          <input type="checkbox" name="accept" required className="mt-1 size-4 accent-[var(--ink)]" />
          <span>
            I agree to the{" "}
            <Link href="/legal/terms" className="underline underline-offset-4">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {state?.fieldErrors?.accept && <p className="mt-1.5 text-xs text-danger">{state.fieldErrors.accept}</p>}
      </div>
      <Submit pending={pending}>Create account</Submit>
    </form>
  );
}

export function ForgotForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);
  if (state?.message) return <Notice tone="success">{state.message}</Notice>;
  return (
    <form action={action} className="grid gap-5" noValidate>
      <Feedback state={state} />
      <TextField label="Email" name="email" type="email" required autoComplete="email" error={state?.fieldErrors?.email} />
      <Submit pending={pending}>Send reset link</Submit>
    </form>
  );
}

export function ResetForm() {
  const [state, action, pending] = useActionState(updatePassword, undefined);
  return (
    <form action={action} className="grid gap-5" noValidate>
      <Feedback state={state} />
      <TextField label="New password" name="password" type="password" required minLength={10} autoComplete="new-password" hint="At least 10 characters." error={state?.fieldErrors?.password} />
      <TextField label="Confirm new password" name="confirm" type="password" required autoComplete="new-password" error={state?.fieldErrors?.confirm} />
      <Submit pending={pending}>Update password</Submit>
    </form>
  );
}
