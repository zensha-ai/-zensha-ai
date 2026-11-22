import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight, Briefcase, Building2, Check, Gem, Rocket, Sparkles } from "lucide-react";
import { pricingNote, websitePlans, type Plan } from "@/content/pricing";
import { ButtonLink, cx } from "@/components/ui";
import { OfferTag, WasPrice } from "@/components/offer";

const icons = { rocket: Rocket, briefcase: Briefcase, gem: Gem, building: Building2 } as const;

export function PricingCards({ showCta = true }: { showCta?: boolean }) {
  return (
    <div>
      <ul className="grid gap-x-5 gap-y-8 pt-4 md:grid-cols-2 xl:grid-cols-4">
        {websitePlans.map((p, i) => (
          <li key={p.id} id={`plan-${p.id}`} className="scroll-mt-28 pb-4">
            <PlanCard plan={p} bobDelay={i * -1.4} />
          </li>
        ))}
      </ul>
      {showCta && (
      <div className="mt-10 flex flex-col items-center gap-4 text-center">
        <ButtonLink href="/contact?service=website-design-development" arrow>
          Discuss Your Website
        </ButtonLink>
        <p className="text-sm text-muted">{pricingNote}</p>
      </div>
      )}
    </div>
  );
}

function PlanCard({ plan: p, bobDelay }: { plan: Plan; bobDelay: number }) {
  const Icon = icons[p.icon];
  return (
    <div className="svc-float h-full" style={{ "--tint": p.tint, "--bob-delay": `${bobDelay}s` } as CSSProperties}>
      <div aria-hidden className="svc-floor" />
      <article
        className={cx(
          "svc-card tilt spotlight group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-surface p-7",
          p.popular ? "border-[color:var(--tint)]" : "border-line",
        )}
      >
        <span aria-hidden className="svc-border" style={p.popular ? { opacity: 1 } : undefined} />
        <span aria-hidden className="svc-glare" />
        <div aria-hidden className="svc-glow pointer-events-none absolute inset-0" style={p.popular ? { opacity: 1 } : undefined} />

        <div className="relative flex items-start justify-between gap-3">
          <span
            className="grid size-12 place-items-center rounded-2xl border"
            style={{ color: p.tint, borderColor: `color-mix(in oklab, ${p.tint} 45%, transparent)`, background: `color-mix(in oklab, ${p.tint} 14%, transparent)` }}
          >
            <Icon aria-hidden className="size-5" strokeWidth={1.75} />
          </span>
          {p.popular && (
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-paper" style={{ background: p.tint }}>
              <Sparkles aria-hidden className="size-3" /> Most popular
            </span>
          )}
        </div>

        <h3 className="relative mt-6 text-xl font-medium">{p.name}</h3>
        <p className="relative mt-3 flex items-center gap-2">
          <WasPrice price={p.price} className="text-lg" />
          <OfferTag />
        </p>
        <p className="relative mt-1 flex items-baseline gap-2">
          <span data-countup className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight" style={{ color: p.tint }}>
            {p.price}
          </span>
        </p>
        <span className="relative mt-3 inline-flex w-fit rounded-full border border-line-strong px-3 py-1 font-mono text-xs text-ink-2">{p.pages}</span>
        <p className="relative mt-4 text-sm leading-relaxed text-muted">{p.description}</p>

        <ul className="relative mt-6 flex-1 space-y-2.5 text-sm">
          {p.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-ink-2">
              <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full" style={{ background: `color-mix(in oklab, ${p.tint} 22%, transparent)` }}>
                <Check aria-hidden className="size-2.5" style={{ color: p.tint }} strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </ul>

        <div className="relative mt-6 border-t border-line pt-4">
          <p className="eyebrow">Best for</p>
          <p className="mt-1.5 text-sm text-ink-2">{p.bestFor}</p>
        </div>

        <Link
          href={`/contact?service=website-design-development&plan=${p.id}`}
          className="relative z-[4] mt-6 inline-flex items-center gap-1.5 text-sm font-medium"
          style={{ color: p.tint }}
        >
          Choose {p.name.split(" ")[0]}
          <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </article>
    </div>
  );
}
