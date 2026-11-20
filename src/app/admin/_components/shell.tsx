import Link from "next/link";
import type { ReactNode } from "react";
import { Badge, cx } from "@/components/ui";

/** Server-side presentational helpers shared by admin pages. */

export function AdminHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="display-3 mt-2">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Notice({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const error = typeof searchParams.error === "string" ? searchParams.error : null;
  const saved = searchParams.saved === "1";
  const deleted = searchParams.deleted === "1";
  if (!error && !saved && !deleted) return null;
  return (
    <p
      role={error ? "alert" : "status"}
      className={cx("mb-6 rounded-lg border p-3 text-sm", error ? "border-danger text-danger" : "border-success text-success")}
    >
      {error ? error.slice(0, 300) : saved ? "Saved." : "Deleted."}
    </p>
  );
}

export function PublishedBadge({ value }: { value: unknown }) {
  return value ? <Badge tone="success">Published</Badge> : <Badge>Draft</Badge>;
}

export function OrderStatusBadge({ status }: { status: string }) {
  return <Badge tone={status === "paid" ? "success" : status === "pending" ? "warn" : "neutral"}>{status}</Badge>;
}

export function ExampleBadge() {
  return <Badge tone="warn">Example</Badge>;
}

export function Table({ caption, head, children }: { caption: string; head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b border-line bg-paper-2">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-mono text-[0.68rem] font-medium uppercase tracking-[0.1em] text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

export function FilterTabs({ base, param, current, options }: { base: string; param: string; current: string; options: { value: string; label: string }[] }) {
  return (
    <nav aria-label="Filter" className="mb-6 flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.value === current;
        const href = o.value ? `${base}?${param}=${encodeURIComponent(o.value)}` : base;
        return (
          <Link
            key={o.value || "all"}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cx(
              "rounded-full border px-3 py-1.5 text-xs",
              active ? "border-ink bg-ink text-paper" : "border-line-strong text-ink-2 hover:border-ink",
            )}
          >
            {o.label}
          </Link>
        );
      })}
    </nav>
  );
}

export const fmtDateTime = (iso: string | null | undefined) =>
  iso
    ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso))
    : "—";
