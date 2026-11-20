"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Search } from "lucide-react";
import type { StudentProject } from "@/content/types";
import { formatINR, labels } from "@/lib/format";
import { Badge, EmptyState, Tag } from "@/components/ui";
import { systemMessages } from "@/content/site";
import { FilterSelect } from "./product-browser";

export function ProjectBrowser({ projects }: { projects: StudentProject[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const get = (k: string) => sp.get(k) ?? "";
  const [q, category, difficulty, delivery, price, stack] = ["q", "category", "difficulty", "delivery", "price", "stack"].map(get);

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/student-projects${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  const stacks = useMemo(() => [...new Set(projects.flatMap((p) => p.stack))].sort().map((s) => [s, s] as [string, string]), [projects]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return projects.filter((p) => {
      if (category && p.category !== category) return false;
      if (difficulty && p.difficulty !== difficulty) return false;
      if (delivery === "digital" && p.delivery_type === "physical_kit") return false;
      if (delivery === "kit" && p.delivery_type === "digital") return false;
      if (price === "free" && !p.is_free) return false;
      if (price === "paid" && p.is_free) return false;
      if (stack && !p.stack.includes(stack)) return false;
      if (needle && ![p.title, p.demonstrates, p.summary, ...p.stack].join(" ").toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [projects, q, category, difficulty, delivery, price, stack]);

  return (
    <div>
      <div role="search" className="space-y-4 border-y border-line py-6">
        <label className="relative block">
          <span className="sr-only">Search projects</span>
          <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            defaultValue={q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Search by topic or technology"
            className="w-full rounded-full border border-line-strong bg-surface py-3 pl-11 pr-4 focus:border-ink focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap gap-4">
          <FilterSelect label="Category" value={category} onChange={(v) => set("category", v)} options={Object.entries(labels.studentCategory)} />
          <FilterSelect label="Stack" value={stack} onChange={(v) => set("stack", v)} options={stacks} />
          <FilterSelect label="Difficulty" value={difficulty} onChange={(v) => set("difficulty", v)} options={Object.entries(labels.difficulty)} />
          <FilterSelect label="Price" value={price} onChange={(v) => set("price", v)} options={[["free", "Free"], ["paid", "Paid"]]} />
          <FilterSelect label="Format" value={delivery} onChange={(v) => set("delivery", v)} options={[["digital", "Digital download"], ["kit", "Physical kit"]]} />
        </div>
      </div>
      <p className="mt-6 font-mono text-xs text-muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "project" : "projects"}
      </p>
      {filtered.length ? (
        <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.id}>
              <Link href={`/student-projects/${p.slug}`} className="spotlight group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
                {p.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover_image_url} alt="" className="aspect-[16/10] w-full object-cover" loading="lazy" />
                ) : (
                  <div aria-hidden className="grid-paper aspect-[16/10] w-full bg-paper-2" />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{labels.studentCategory[p.category]}</Badge>
                    <Badge>{labels.difficulty[p.difficulty]}</Badge>
                    {p.is_example && <Badge tone="warn">Example</Badge>}
                  </div>
                  <h2 className="mt-5 text-xl font-medium group-hover:text-accent">{p.title}</h2>
                  <p className="mt-2 flex-1 text-sm text-muted">{p.demonstrates}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {p.stack.slice(0, 4).map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </div>
                  <div className="mt-6 flex items-baseline justify-between border-t border-line pt-4">
                    <span className="text-lg font-medium">{p.is_free ? "Free" : formatINR(p.price_paise)}</span>
                    <span className="font-mono text-xs text-muted">{labels.delivery[p.delivery_type]}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <EmptyState
            title={projects.length ? "No matching projects" : "The first projects are being prepared"}
            text={projects.length ? systemMessages.emptySearch : "Each project will list its demo, technologies, components, exact package contents and licence before it is offered. Check back soon."}
          />
        </div>
      )}
    </div>
  );
}
