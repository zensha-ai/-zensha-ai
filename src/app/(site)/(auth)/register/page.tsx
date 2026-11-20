import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { AuthShell } from "../auth-shell";
import { RegisterForm } from "../auth-forms";

export const metadata = pageMetadata({
  title: "Create account",
  description: "Create your account to manage eligible purchases and downloads.",
  path: "/register",
  absoluteTitle: false,
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Account"
      title="Create account"
      text="Create your account to manage eligible purchases and downloads."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
