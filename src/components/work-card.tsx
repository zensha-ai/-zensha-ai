import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { WorkItem } from "@/content/types";
import { TrafficVisual } from "@/components/work-visual";
import { cx } from "@/components/ui";

const visuals: Record<string, { tint: string; Visual: (p: { className?: string }) => React.ReactNode }> = {
  "trafenix-ai": { tint: "var(--accent)", Visual: TrafficVisual },
};

/**
 * Floating 3D project card. The whole card links to the case study (stretched
 * link); the live-app link sits above it so both stay keyboard-accessible.
 */
export function WorkCard({ item, featured = false }: { item: WorkItem; featured?: boolean }) {
  const v = visuals[item.slug];
  const tint = v?.tint ?? "var(--accent)";
  const href = `/our-work/${item.slug}`;
  return (
    <div className="svc-float h-full" style={{ "--tint": tint } as CSSProperties}>
      <div aria-hidden className="svc-floor" />
      <article
        className={cx(
          "svc-card tilt spotlight group relative flex h-full overflow-hidden rounded-3xl border border-line bg-surface",
          featured ? "flex-col lg:flex-row lg:items-stretch" : "flex-col",
        )}
      >
        <span aria-hidden className="svc-border" />
        <span aria-hidden className="svc-glare" />
        <div aria-hidden className="svc-glow pointer-events-none absolute inset-0" />

        {v && (
          <div className={cx("relative flex items-center justify-center p-6 sm:p-10", featured && "lg:order-2 lg:w-[52%]")}>
            <div className="w-full overflow-hidden rounded-2xl border border-line bg-paper/60">
              <v.Visual className="block w-full" />
            </div>
          </div>
        )}

        <div className={cx("relative flex flex-1 flex-col p-8 sm:p-10", featured && "lg:w-[48%] lg:p-12")}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.12em]" style={{ borderColor: tint, color: tint }}>
              {item.project_type}
            </span>
            {item.industry && <span className="font-mono text-xs text-muted">{item.industry}</span>}
            {item.year && <span className="font-mono text-xs text-muted">· {item.year}</span>}
          </div>
          <h2 className={cx("mt-6", featured ? "display-2" : "display-3")}>
            <Link href={href} className="outline-none after:absolute after:inset-0 after:z-[3] after:content-['']">
              {item.title}
            </Link>
          </h2>
          <p className={cx("mt-4 flex-1 text-ink-2", featured && "text-lg leading-relaxed")}>{item.summary}</p>
          {item.features.length > 0 && featured && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {item.features.slice(0, 6).map((f) => (
                <li key={f} className="rounded-md border border-line-strong px-2 py-1 text-xs text-ink-2">
                  {f}
                </li>
              ))}
            </ul>
          )}
          <div className="relative z-[4] mt-8 flex flex-wrap items-center gap-5">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: tint }}>
              Read the case study
              <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
            {item.demo_url && (
              <a
                href={item.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-ink-2 transition-colors hover:border-ink hover:text-ink"
              >
                Visit live app <ExternalLink aria-hidden className="size-3.5" />
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
