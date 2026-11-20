import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brand } from "@/config/brand";
import { Logo } from "@/components/layout/logo";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { AdminSidebar } from "./_components/sidebar";

export const metadata: Metadata = {
  title: { absolute: `Admin | ${brand.brandName}` },
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Without Supabase nobody can sign in. In development the pages render a
  // "not connected" panel; in production the admin area simply doesn't exist.
  if (!isSupabaseConfigured() && process.env.NODE_ENV === "production") notFound();
  const user = isSupabaseConfigured() ? await requireAdmin() : null;

  return (
    <div className="min-h-dvh bg-paper">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <div className="mx-auto grid max-w-[96rem] lg:grid-cols-[16rem_1fr]">
        <aside className="border-b border-line px-4 py-5 lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
          <div className="flex items-center justify-between gap-3 lg:block">
            <div>
              <Logo />
              <p className="eyebrow mt-2">{brand.brandName} Admin</p>
            </div>
            <div className="lg:mt-8">
              <AdminSidebar />
            </div>
          </div>
          <div className="mt-8 hidden border-t border-line pt-4 text-xs text-muted lg:block">
            {user && <p className="truncate">Signed in as {user.email}</p>}
            <Link href="/" className="mt-2 inline-block underline-offset-4 hover:text-ink hover:underline">
              View public site →
            </Link>
          </div>
        </aside>
        <main id="admin-main" tabIndex={-1} className="min-w-0 px-4 py-8 outline-none sm:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
