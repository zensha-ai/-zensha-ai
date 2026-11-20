import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/content/types";
import { ServiceIcon } from "@/components/service-icon";
import { ServiceVisual, serviceTints } from "@/components/service-visual";
import { cx } from "@/components/ui";
import { priceLabel } from "@/content/service-pricing";

/** Bento spans on a 6-column grid: 3+3 / 2+2+2 / 3+3 / 2+2+2 / 6 (featured). */
const lgSpan = (i: number, total: number) => {
  if (i === total - 1 && total % 5 === 1) return "lg:col-span-6";
  return [0, 1, 5, 6].includes(i % 10) ? "lg:col-span-3" : "lg:col-span-2";
};

export function ServiceBento({ services }: { services: Service[] }) {
  // Data Engineering is the founder's core strength — feature it last, full width.
  const featuredSlug = "data-engineering-analytics";
  const ordered = [...services.filter((s) => s.slug !== featuredSlug), ...services.filter((s) => s.slug === featuredSlug)];
  return (
    <ul className="grid gap-x-5 gap-y-6 md:grid-cols-2 lg:grid-cols-6">
      {ordered.map((s, i) => {
        const featured = s.slug === featuredSlug && i === ordered.length - 1;
        const wide = featured || lgSpan(i, ordered.length) === "lg:col-span-3";
        return (
          <li key={s.slug} className={cx(lgSpan(i, ordered.length), featured && "md:col-span-2", "pb-4")}>
            <ServiceCard service={s} wide={wide} featured={featured} bobDelay={(i % 5) * -1.2} />
          </li>
        );
      })}
    </ul>
  );
}

export function ServiceCard({
  service: s,
  wide = false,
  featured = false,
  bobDelay = 0,
}: {
  service: Service;
  wide?: boolean;
  featured?: boolean;
  bobDelay?: number;
}) {
  const tint = serviceTints[s.slug] ?? "var(--accent)";
  return (
    <div className="svc-float h-full" style={{ "--tint": tint, "--bob-delay": `${bobDelay}s` } as CSSProperties}>
      <div aria-hidden className="svc-floor" />
    <Link
      href={`/services/${s.slug}`}
      className={cx(
        "svc-card tilt spotlight group relative flex h-full overflow-hidden rounded-2xl border border-line bg-surface",
        featured ? "flex-col md:flex-row md:items-center" : "flex-col",
      )}
    >
      <span aria-hidden className="svc-border" />
      <span aria-hidden className="svc-glare" />
      <div aria-hidden className="svc-glow pointer-events-none absolute inset-0" />
      <div className={cx("relative flex items-center justify-center px-8 pt-8", featured ? "md:order-2 md:w-1/2 md:p-10" : wide ? "h-48" : "h-40")}>
        <ServiceVisual slug={s.slug} className={featured ? "max-w-md" : wide ? "max-w-[18rem]" : "max-w-[14rem]"} />
      </div>
      <div className={cx("relative flex flex-1 flex-col p-8", featured && "md:w-1/2 md:p-12")}>
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border border-line-strong" style={{ color: tint }}>
            <ServiceIcon name={s.icon} className="size-4" />
          </span>
          <span className="font-mono text-xs text-muted">{s.number}</span>
          {priceLabel(s.slug) && (
            <span className="ml-auto rounded-full border px-2.5 py-0.5 text-xs font-medium" style={{ borderColor: `color-mix(in oklab, ${tint} 45%, transparent)`, color: tint, background: `color-mix(in oklab, ${tint} 10%, transparent)` }}>
              {priceLabel(s.slug)}
            </span>
          )}
          {featured && (
            <span className="rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.12em]" style={{ borderColor: tint, color: tint }}>
              Founder&rsquo;s core expertise
            </span>
          )}
        </div>
        <h2 className={cx("mt-6", featured ? "display-2" : "display-3")}>{s.title}</h2>
        <p className={cx("mt-3 flex-1 text-ink-2", featured && "text-lg")}>{featured ? s.intro : s.short}</p>
        {featured && (
          <div className="mt-6 flex flex-wrap gap-2">
            {s.technologies.slice(0, 8).map((t) => (
              <span key={t} className="rounded-md border border-line-strong px-2 py-1 font-mono text-xs text-ink-2">
                {t}
              </span>
            ))}
          </div>
        )}
        <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: tint }}>
          Learn more
          <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
    </div>
  );
}
