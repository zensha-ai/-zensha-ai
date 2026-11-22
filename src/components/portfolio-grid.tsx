"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { TrafficVisual } from "@/components/work-visual";
import { ServiceVisual } from "@/components/service-visual";
import { cx } from "@/components/ui";
import {
  portfolioCategories,
  type PortfolioCategory,
} from "@/content/showcase";

export type PortfolioEntry = {
  key: string;
  title: string;
  type: string;
  category: PortfolioCategory;
  industry: string | null;
  summary: string;
  href: string;
  linkLabel: string;
  liveUrl: string | null;
  concept: boolean;
  /** "work:<slug>" for a project illustration, "service:<slug>" for a service one. */
  visual: string | null;
};

const workVisuals: Record<
  string,
  { Visual: (p: { className?: string }) => React.ReactNode }
> = {
  "trafenix-ai": { Visual: TrafficVisual },
  "reel-research-ai": { Visual: (p) => <ServiceVisual slug="ai-development-intelligent-solutions" className={`${p.className ?? ""} max-w-md`} /> },
  "youtube-analytics-pipeline": { Visual: (p) => <ServiceVisual slug="data-engineering-analytics" className={`${p.className ?? ""} max-w-md`} /> },
};

function Visual({ entry }: { entry: PortfolioEntry }) {
  if (!entry.visual) return null;
  const [kind, slug] = entry.visual.split(":");
  if (kind === "work") {
    const W = workVisuals[slug]?.Visual;
    return W ? <W className="block w-full" /> : null;
  }
  return <ServiceVisual slug={slug} className="block w-full max-w-md" />;
}

/** Column span on large screens: rows alternate wide+narrow, narrow+wide. */
function span(i: number, total: number) {
  if (total % 2 === 1 && i === total - 1) return "lg:col-span-12";
  const row = Math.floor(i / 2);
  const wideFirst = row % 2 === 0;
  return (i % 2 === 0) === wideFirst ? "lg:col-span-7" : "lg:col-span-5";
}

export function PortfolioGrid({ entries }: { entries: PortfolioEntry[] }) {
  const [filter, setFilter] = useState<"All" | PortfolioCategory>("All");

  const counts = Object.fromEntries(
    portfolioCategories.map((c) => [
      c,
      entries.filter((e) => e.category === c).length,
    ]),
  );
  const tabs = [
    { label: "All" as const, count: entries.length },
    ...portfolioCategories
      .filter((c) => counts[c] > 0)
      .map((c) => ({ label: c, count: counts[c] })),
  ];
  const shown =
    filter === "All" ? entries : entries.filter((e) => e.category === filter);


  return (
    <div>
      <div
        role="group"
        aria-label="Filter projects"
        className="flex flex-wrap gap-2"
      >
        {tabs.map((t) => (
          <button
            key={t.label}
            type="button"
            aria-pressed={filter === t.label}
            onClick={() => setFilter(t.label)}
            className={cx(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
              filter === t.label
                ? "border-accent bg-accent text-on-accent"
                : "border-line-strong text-ink-2 hover:border-ink hover:text-ink",
            )}
          >
            {t.label}
            <span
              className={cx(
                "font-mono text-[0.7rem]",
                filter === t.label ? "opacity-70" : "text-muted",
              )}
            >
              {String(t.count).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      <ul
       
        className="pf-grid mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-12"
      >
        {shown.map((e, i) => (
          <li
            key={e.key}
            className={cx(
              "reveal pb-4",
              span(i, shown.length),
              shown.length % 2 === 1 &&
                i === shown.length - 1 &&
                "md:col-span-2",
            )}
          >
            <div
              data-card
              className="svc-float h-full"
              style={{ "--bob-delay": `${(i % 3) * -1.6}s` } as CSSProperties}
            >
              <div aria-hidden className="svc-floor" />
              <article className="pf-card svc-card tilt spotlight group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface">
                <span aria-hidden className="svc-border" />
                <span aria-hidden className="svc-glare" />
                <div
                  aria-hidden
                  className="svc-glow pointer-events-none absolute inset-0"
                />

                <div className="relative flex min-h-[15rem] items-center justify-center overflow-hidden border-b border-line bg-paper/70 p-6 sm:p-10">
                  <div
                    aria-hidden
                    className="grid-paper absolute inset-0 opacity-40"
                  />
                  <div aria-hidden className="pf-glow absolute inset-0" />
                  <div className="reveal-zoom relative flex w-full justify-center">
                    <Visual entry={e} />
                  </div>
                </div>

                <div className="relative flex flex-1 flex-col p-7 sm:p-8">
                  <div className="mb-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-line-strong px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-2">
                      {e.type}
                    </span>
                    {e.concept ? (
                      <span className="rounded-full border border-line-strong px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
                        Concept
                      </span>
                    ) : !e.liveUrl ? (
                      <span className="rounded-full border border-line-strong px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-2">
                        Built
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/60 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-accent">
                        <span
                          aria-hidden
                          className="live-dot size-1.5 rounded-full bg-accent"
                        />{" "}
                        Live
                      </span>
                    )}
                  </div>
                  {e.industry && (
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                      {e.industry}
                    </p>
                  )}
                  <h3 className="display-3 mt-3">
                    <Link
                      href={e.href}
                      className="outline-none after:absolute after:inset-0 after:z-[3] after:content-['']"
                    >
                      {e.title}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-ink-2">{e.summary}</p>
                  <div className="relative z-[4] mt-6 flex flex-wrap items-center gap-5">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                      {e.linkLabel}
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                    {e.liveUrl && (
                      <a
                        href={e.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-ink-2 transition-colors hover:border-accent hover:text-ink"
                      >
                        Visit live app{" "}
                        <ExternalLink aria-hidden className="size-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
