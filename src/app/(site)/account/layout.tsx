import Link from "next/link";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "My account", robots: { index: false, follow: false } };

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/downloads", label: "My downloads" },
  { href: "/support", label: "Help & support" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/account");
  return (
    <div className="container-z py-12 sm:py-16">
      <div className="flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">My account</p>
          <h1 className="display-2 mt-4">{user.fullName ? `Hello, ${user.fullName.split(" ")[0]}` : "Your account"}</h1>
          <p className="mt-3 text-muted">Manage your profile, orders and download access.</p>
        </div>
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-sm text-ink-2 underline underline-offset-4 hover:text-ink">
            Sign out
          </button>
        </form>
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <nav aria-label="Account" className="lg:col-span-3">
          <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block whitespace-nowrap rounded-full px-4 py-2 text-sm text-ink-2 hover:bg-paper-2 hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
            {user.role === "admin" && (
              <li>
                <Link href="/admin" className="block whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-accent hover:bg-paper-2">
                  Admin dashboard
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="min-w-0 lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
