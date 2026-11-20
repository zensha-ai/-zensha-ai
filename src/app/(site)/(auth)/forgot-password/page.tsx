import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { AuthShell } from "../auth-shell";
import { ForgotForm } from "../auth-forms";

export const metadata = pageMetadata({
  title: "Forgot password",
  description: "Request a password reset link.",
  path: "/forgot-password",
  absoluteTitle: false,
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account"
      title="Forgot password"
      text="Enter your email address to request a password reset link."
      footer={
        <Link href="/login" className="underline underline-offset-4">
          Back to sign in
        </Link>
      }
    >
      <ForgotForm />
    </AuthShell>
  );
}
