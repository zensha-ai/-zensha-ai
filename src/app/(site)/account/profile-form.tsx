"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { Notice, TextField } from "@/components/commerce/fields";
import { updateProfile } from "./actions";

export function ProfileForm({ fullName, phone, email }: { fullName: string; phone: string; email: string }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  return (
    <form action={action} className="grid gap-5 sm:max-w-lg" noValidate>
      {state?.ok && <Notice tone="success">Profile saved.</Notice>}
      {state?.error && <Notice tone="error">{state.error}</Notice>}
      <div>
        <p className="text-sm font-medium">Email</p>
        <p className="mt-2 text-ink-2">{email}</p>
      </div>
      <TextField label="Full name" name="full_name" required autoComplete="name" defaultValue={fullName} error={state?.fieldErrors?.full_name} />
      <TextField label="Phone / WhatsApp (optional)" name="phone" type="tel" autoComplete="tel" defaultValue={phone} error={state?.fieldErrors?.phone} />
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
