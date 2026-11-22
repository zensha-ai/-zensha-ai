import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import type { Service } from "@/content/types";
import { servicePricing } from "@/content/service-pricing";
import { serviceTints } from "@/components/service-visual";
import { ServiceIcon } from "@/components/service-icon";

/** Large "starting from" price panel for a single service page. */
export function ServicePricePanel({ service }: { service: Service }) {
  const p = servicePricing[service.slug];
  if (!p) return null;
  const tint = serviceTints[service.slug] ?? "var(--accent)";
  return (
    <div
      className="relative overflow-hidden rounded-3xl border bg-surface p-8 sm:p-10"
      style={{ borderColor: `color-mix(in oklab, ${tint} 45%, var(--line-strong))`, boxShadow: `0 30px 70px -40px ${tint}` } as CSSProperties}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(60% 80% at 90% 0%, color-mix(in oklab, ${tint} 18%, transparent), transparent 70%)` }} />
      <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <p className="eyebrow">Starting from</p>
          <p className="mt-3 flex items-baseline gap-1">
            <span data-countup className="font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight sm:text-6xl" style={{ color: tint }}>
              {p.from}
            </span>
            {p.unit && <span className="text-lg text-muted">{p.unit}</span>}
          </p>
          <p className="mt-3 text-lg font-medium text-ink">{p.represents}</p>
          <p className="mt-4 text-sm text-muted">Final price confirmed after a short call about your scope.{p.note ? ` ${p.note}` : ""}</p>
        </div>
        <div className="lg:col-span-7">
          <p className="eyebrow">Included at this price</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {p.includes.map((i) => (
              <li key={i} className="flex items-start gap-3 rounded-2xl border border-line bg-paper/50 p-4 text-sm text-ink-2">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full" style={{ background: `color-mix(in oklab, ${tint} 22%, transparent)` }}>
                  <Check aria-hidden className="size-3" style={{ color: tint }} strokeWidth={3} />
                </span>
                {i}
              </li>
            ))}
          </ul>
          <Link
            href={`/contact?service=${service.slug}`}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
            style={{ background: tint }}
          >
            Get a Quote <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Grid of every service with its starting price (used on the Pricing page). */
export function AllServicePrices({ services }: { services: Service[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => {
        const p = servicePricing[s.slug];
        if (!p) return null;
        const tint = serviceTints[s.slug] ?? "var(--accent)";
        return (
          <li key={s.slug}>
            <Link
              href={`/services/${s.slug}#pricing`}
              className="spotlight group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-[color:var(--t)]"
              style={{ "--t": tint } as CSSProperties}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="grid size-10 place-items-center rounded-xl border"
                  style={{ color: tint, borderColor: `color-mix(in oklab, ${tint} 40%, transparent)`, background: `color-mix(in oklab, ${tint} 12%, transparent)` }}
                >
                  <ServiceIcon name={s.icon} className="size-[1.1rem]" />
                </span>
                <span className="text-right">
                  <span className="block font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">From</span>
                  <span className="font-[family-name:var(--font-display)] text-xl font-semibold" style={{ color: tint }}>
                    {p.from}
                    {p.unit && <span className="text-sm font-normal text-muted">{p.unit}</span>}
                  </span>
                </span>
              </div>
              <h3 className="mt-5 font-medium">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{p.represents}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: tint }}>
                View details <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
