"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import type { Product } from "@/content/types";
import { labels } from "@/lib/format";
import { Badge, EmptyState } from "@/components/ui";
import { systemMessages } from "@/content/site";

export function ProductBrowser({ products }: { products: Product[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const q = sp.get("q") ?? "";
  const category = sp.get("category") ?? "";
  const status = sp.get("status") ?? "";

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/products${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!status || p.status === status) &&
        (!needle || [p.name, p.tagline, ...p.use_cases].join(" ").toLowerCase().includes(needle)),
    );
  }, [products, q, category, status]);

  return (
    <div>
      <div role="search" className="grid gap-4 border-y border-line py-6 md:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            defaultValue={q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Search by name, use case or workflow"
            className="w-full rounded-full border border-line-strong bg-surface py-3 pl-11 pr-4 focus:border-ink focus:outline-none"
          />
        </label>
        <FilterSelect label="Category" value={category} onChange={(v) => set("category", v)} options={Object.entries(labels.productCategory)} />
        <FilterSelect label="Status" value={status} onChange={(v) => set("status", v)} options={Object.entries(labels.status)} />
      </div>
      <p className="mt-6 font-mono text-xs text-muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
      </p>
      {filtered.length ? (
        <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.id}>
              <Link href={`/products/${p.slug}`} className="spotlight group flex h-full flex-col rounded-2xl border border-line bg-surface p-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="eyebrow">{labels.productCategory[p.category]}</span>
                  <span className="flex gap-2">
                    {p.is_example && <Badge tone="warn">Example</Badge>}
                    <Badge tone={p.status === "available" ? "success" : "neutral"}>{labels.status[p.status]}</Badge>
                  </span>
                </div>
                <h2 className="display-3 mt-8 group-hover:text-accent">{p.name}</h2>
                <p className="mt-3 flex-1 text-ink-2">{p.tagline}</p>
                <span className="mt-8 inline-flex items-center gap-1 text-sm font-medium">
                  Explore Product <ArrowUpRight aria-hidden className="size-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <EmptyState title={products.length ? "No matches" : "Products are on the way"} text={products.length ? systemMessages.emptySearch : systemMessages.comingSoon} />
        </div>
      )}
    </div>
  );
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="eyebrow">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-full border border-line-strong bg-surface px-4 py-3 focus:border-ink focus:outline-none">
        <option value="">All</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
