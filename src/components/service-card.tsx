import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { groupOf } from "@/content/service-groups";
import type { Service } from "@/content/types";
import { ServiceVisual } from "@/components/service-visual";
import { cx } from "@/components/ui";
import { priceLabel } from "@/content/service-pricing";

/* ── Reference-style service cards (Services page + service pages) ─────── */

/** Two-column grid of dark cards on cream; the odd last card spans full width. */
export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {services.map((s, i) => (
        <li
          key={s.slug}
          className={cx("reveal", services.length % 2 === 1 && i === services.length - 1 && "md:col-span-2")}
          style={{ "--reveal-delay": `${(i % 2) * 0.08}s` } as CSSProperties}
        >
          <ServiceTile service={s} wide={services.length % 2 === 1 && i === services.length - 1} />
        </li>
      ))}
    </ul>
  );
}

export function ServiceTile({ service: s, wide = false }: { service: Service; wide?: boolean }) {
  const group = groupOf(s.slug);
  const shown = s.capabilities.slice(0, 3);
  const more = s.capabilities.length - shown.length;
  return (
    <Link
      href={`/services/${s.slug}`}
      className={cx("svc-card xtile tilt spotlight group relative flex h-full overflow-hidden rounded-2xl border border-line bg-surface", wide ? "flex-col lg:flex-row" : "flex-col")}
    >
      <div className={cx("xtile-media relative grid place-items-center overflow-hidden border-line", wide ? "h-64 border-b lg:order-2 lg:h-auto lg:w-1/2 lg:border-b-0 lg:border-l" : "h-64 border-b")}>
        <div aria-hidden className="grid-paper absolute inset-0 opacity-50" />
        <div aria-hidden className="xtile-orb" />
        <ServiceVisual slug={s.slug} className="xtile-visual relative max-w-[17rem]" />
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-line-strong bg-paper/80 px-3 py-1 font-mono text-[0.65rem] text-ink-2 backdrop-blur">
          <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          {s.technologies.slice(0, 2).join(" · ")}
        </span>
        {priceLabel(s.slug) && (
          <span data-countup className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 font-mono text-[0.65rem] text-on-accent">{priceLabel(s.slug)}</span>
        )}
        <span aria-hidden className="xtile-toast">
          <span className="live-dot size-1.5 rounded-full bg-accent" />
          {group.toast}
        </span>
      </div>
      <div className={cx("relative flex flex-1 flex-col p-7 sm:p-8", wide && "lg:w-1/2 lg:p-12")}>
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-accent">{s.number}</span>
          <span className="text-muted">{group.label}</span>
        </div>
        <h3 className="display-3 mt-3">{s.title}</h3>
        <p className="mt-3 flex-1 text-ink-2">{wide ? s.intro : s.short}</p>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {shown.map((c) => (
            <span key={c} className="rounded-full border border-line-strong px-2.5 py-1 text-[0.7rem] text-ink-2">
              {c}
            </span>
          ))}
          {more > 0 && <span className="rounded-full border border-accent/50 px-2.5 py-1 text-[0.7rem] text-accent">+{more}</span>}
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
          <span className="text-sm font-semibold">View details</span>
          <span className="grid size-10 place-items-center rounded-full border border-line-strong transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Small "explore in depth" link card. */
export function ServiceLinkCard({ service: s }: { service: Service }) {
  return (
    <Link href={`/services/${s.slug}`} className="xlink group flex h-full flex-col justify-between gap-6 rounded-xl border border-line bg-surface p-5">
      <span className="flex items-center justify-between font-mono text-xs text-muted">
        {groupOf(s.slug).label}
        <ArrowUpRight aria-hidden className="size-4 text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
      <span className="font-semibold leading-snug">{s.title}</span>
    </Link>
  );
}
