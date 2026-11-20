import { pageMetadata } from "@/lib/seo";
import { AuthShell } from "../auth-shell";
import { ResetForm } from "../auth-forms";

export const metadata = pageMetadata({
  title: "Set a new password",
  description: "Choose a new password for your account.",
  path: "/reset-password",
  absoluteTitle: false,
  noIndex: true,
});

export default function ResetPasswordPage() {
  return (
    <AuthShell eyebrow="Account" title="Set a new password" text="Choose a new password for your account. You'll stay signed in afterwards.">
      <ResetForm />
    </AuthShell>
  );
}
