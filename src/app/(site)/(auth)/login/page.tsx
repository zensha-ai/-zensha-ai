import Link from "next/link";
import { safeNext } from "@/lib/auth";
import { pageMetadata } from "@/lib/seo";
import { AuthShell } from "../auth-shell";
import { LoginForm } from "../auth-forms";

export const metadata = pageMetadata({
  title: "Sign in",
  description: "Sign in to view your orders and available files.",
  path: "/login",
  absoluteTitle: false,
  noIndex: true,
});

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <AuthShell
      eyebrow="Account"
      title="Sign in"
      text="Welcome back. Sign in to view your orders and available files."
      footer={
        <>
          New here?{" "}
          <Link href={`/register${next ? `?next=${encodeURIComponent(safeNext(next))}` : ""}`} className="underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm next={safeNext(next)} />
    </AuthShell>
  );
}
