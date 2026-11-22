import Link from "next/link";
import type { CSSProperties } from "react";
import { Bot, Code2, LineChart, Workflow } from "lucide-react";
import { brand } from "@/config/brand";
import type { ServiceGroup } from "@/content/service-groups";

const icons = { build: Code2, ai: Bot, automate: Workflow, grow: LineChart };
/** Card corners on the large layout: build TL, ai BL, automate TR, grow BR. */
const place = { build: "hub-tl", ai: "hub-bl", automate: "hub-tr", grow: "hub-br" };

/**
 * "Connected as one system": the four capability areas wired to a glowing
 * core. Lines flow toward the centre; on small screens the cards stack under
 * the core. Pure CSS/SVG, decorative motion only.
 */
export function ServicesHub({ groups }: { groups: ServiceGroup[] }) {
  return (
    <section className="relative overflow-hidden border-y border-line bg-paper py-24 sm:py-32" aria-labelledby="hub-title">
      <div aria-hidden className="grid-paper pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_55%,#000,transparent)]" />
      <div className="container-z relative">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="eyebrow">What we build</p>
          <h2 id="hub-title" className="display-2 mt-4 text-balance">
            Build, AI, automation &amp; growth. <span className="text-accent">Connected as one system.</span>
          </h2>
          <p className="lede mx-auto mt-5 max-w-2xl">
            Most businesses hire separate vendors and hope it all fits together. We build each piece to work with the
            next, so your website, apps, automations and data tell one consistent story.
          </p>
        </div>

        <div className="hub mt-16">
          <svg aria-hidden className="hub-lines" viewBox="0 0 1000 560" preserveAspectRatio="none">
            {[
              [500, 280, 160, 140],
              [500, 280, 160, 420],
              [500, 280, 840, 140],
              [500, 280, 840, 420],
            ].map(([x1, y1, x2, y2], i) => (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--line-strong)" vectorEffect="non-scaling-stroke" />
                <line
                  className="hub-flow"
                  style={{ animationDelay: `${i * -0.4}s` } as CSSProperties}
                  x1={x2}
                  y1={y2}
                  x2={x1}
                  y2={y1}
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </svg>

          <div className="hub-core" aria-hidden>
            <span className="hub-ring hub-ring-1" />
            <span className="hub-ring hub-ring-2" />
            <span className="hub-ring hub-ring-3" />
            <div className="hub-orb">
              <svg viewBox="0 0 24 24" className="size-9">
                <path d="M19 6.2A9 9 0 1 0 20.8 11" fill="none" stroke="#fffbd4" strokeWidth="2.6" strokeLinecap="round" />
                <circle cx="20.6" cy="7.8" r="1.9" fill="#fffbd4" />
              </svg>
              <span className="mt-2 font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.16em]">{brand.brandName}</span>
              <span className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] opacity-70">Digital systems</span>
            </div>
          </div>

          {groups.map((g, i) => {
            const Icon = icons[g.key];
            return (
              <Link
                key={g.key}
                href={`/services/${g.services[0]}`}
                className={`hub-card reveal ${place[g.key]} group`}
                style={{ "--reveal-delay": `${i * 0.08}s` } as CSSProperties}
              >
                <span aria-hidden className="hub-node" />
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-on-accent shadow-[0_0_30px_-6px_var(--accent)]">
                  <Icon aria-hidden className="size-5" />
                </span>
                <span className="mt-4 block font-semibold">{g.label}</span>
                <span className="mt-1.5 block text-sm leading-relaxed text-ink-2">{g.text}</span>
                <span className="mt-4 flex flex-wrap gap-1.5">
                  {g.tags.map((t) => (
                    <span key={t} className="rounded-md border border-line-strong px-2 py-0.5 font-mono text-[0.65rem] text-muted">
                      {t}
                    </span>
                  ))}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
