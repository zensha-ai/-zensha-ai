"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cx } from "@/components/ui";

const groups = [
  { heading: "Overview", links: [{ href: "/admin", label: "Dashboard" }] },
  { heading: "Inbox", links: [{ href: "/admin/enquiries", label: "Enquiries" }] },
  {
    heading: "Content",
    links: [
      { href: "/admin/services", label: "Services" },
      { href: "/admin/articles", label: "Articles & guides" },
      { href: "/admin/work_items", label: "Our Work" },
      { href: "/admin/faqs", label: "FAQs" },
      { href: "/admin/settings", label: "Homepage, contact & SEO" },
      { href: "/admin/offer", label: "Offers & discounts" },
      { href: "/admin/media", label: "Media library" },
    ],
  },
  {
    heading: "Catalogue",
    links: [
      { href: "/admin/products", label: "Products" },
      { href: "/admin/student_projects", label: "Student projects" },
      { href: "/admin/files", label: "Protected files" },
      { href: "/admin/categories", label: "Categories" },
    ],
  },
  {
    heading: "Commerce",
    links: [
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/entitlements", label: "Download permissions" },
      { href: "/admin/customers", label: "Customers" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-sm lg:hidden"
        aria-expanded={open}
        aria-controls="admin-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
        Menu
      </button>
      <nav id="admin-nav" aria-label="Admin" className={cx("lg:block", open ? "block" : "hidden")}>
        {groups.map((g) => (
          <div key={g.heading} className="mt-6 first:mt-0">
            <h2 className="eyebrow px-3">{g.heading}</h2>
            <ul className="mt-2 space-y-0.5">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={cx(
                      "block rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive(l.href) ? "bg-ink text-paper" : "text-ink-2 hover:bg-paper-2 hover:text-ink",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}
