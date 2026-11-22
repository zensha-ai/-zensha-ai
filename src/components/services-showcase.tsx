"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { ServiceVisual } from "@/components/service-visual";

export type ShowcaseSlide = {
  key: string;
  label: string;
  title: string;
  text: string;
  visual: string;
  items: { slug: string; title: string }[];
};

/**
 * "Four capabilities" band. On large screens with motion allowed the section
 * pins and the slides move sideways as you scroll (counter + progress bar).
 * Everywhere else the slides simply stack — all content is always in the DOM.
 */
export function ServicesShowcase({ slides }: { slides: ShowcaseSlide[] }) {
  const outer = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const n = slides.length;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const o = outer.current, t = track.current, v = viewport.current;
      if (!o || !t || !v) return;
      if (!mq.matches) {
        t.style.transform = "";
        return;
      }
      const r = o.getBoundingClientRect();
      const total = o.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      const pos = p * (n - 1);
      t.style.transform = `translate3d(${-p * (t.scrollWidth - v.clientWidth)}px,0,0)`;
      t.style.setProperty("--pos", pos.toFixed(3));
      if (counter.current) counter.current.textContent = String(Math.round(pos) + 1).padStart(2, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${(pos + 1) / n})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mq.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", onScroll);
    };
  }, [n]);

  return (
    <section ref={outer} className="hs-outer relative bg-paper" style={{ "--n": n } as CSSProperties} aria-labelledby="hs-title">
      <div className="hs-sticky">
        <div aria-hidden className="hs-glow" />
        <div className="container-z relative pt-20 lg:pt-28">
          <p className="eyebrow">Our services in detail</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h2 id="hs-title" className="display-2 max-w-3xl text-balance">
              Four capabilities. <span className="text-accent">One growth system.</span>
            </h2>
            <div className="hs-meta hidden items-center gap-4 font-mono text-xs text-muted lg:flex" aria-hidden>
              <span className="relative block h-px w-28 overflow-hidden bg-line-strong">
                <span ref={bar} className="hs-bar" style={{ transform: `scaleX(${1 / n})` }} />
              </span>
              <span>
                <span ref={counter} className="text-ink">01</span> / {String(n).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
        <div ref={viewport} className="hs-viewport">
          <div ref={track} className="hs-track">
            {slides.map((s, i) => (
              <article key={s.key} className="hs-slide" style={{ "--i": i } as CSSProperties}>
                <div className="container-z relative grid h-full items-center gap-12 py-14 lg:grid-cols-12 lg:py-0">
                  <span aria-hidden className="hs-num">{String(i + 1).padStart(2, "0")}</span>
                  <div className="relative lg:col-span-6">
                    <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent">
                      <span aria-hidden className="size-1.5 rounded-full bg-accent" />
                      {s.label}
                    </p>
                    <h3 className="display-2 mt-4 text-balance">{s.title}</h3>
                    <p className="lede mt-5 max-w-xl">{s.text}</p>
                    <ul className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                      {s.items.map((it) => (
                        <li key={it.slug}>
                          <Link href={`/services/${it.slug}`} className="group inline-flex items-center gap-2.5 text-sm font-medium hover:text-accent">
                            <span aria-hidden className="grid size-4 place-items-center rounded-full bg-accent text-on-accent">
                              <Check className="size-2.5" strokeWidth={3.5} />
                            </span>
                            {it.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-9 flex flex-wrap items-center gap-6">
                      <Link
                        href={`/contact?service=${encodeURIComponent(s.items[0]?.slug ?? "")}`}
                        className="magnetic inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-on-accent shadow-[0_8px_30px_-8px_var(--glow)]"
                      >
                        Start this project <ArrowRight aria-hidden className="size-4" />
                      </Link>
                      <Link href={`/services/${s.items[0]?.slug ?? ""}`} className="group inline-flex items-center gap-1.5 text-sm font-medium">
                        Full details
                        <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                  <div className="hs-visual relative lg:col-span-6" aria-hidden>
                    <div className="hs-screen">
                      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
                        <span className="size-2 rounded-full bg-accent" />
                        <span className="size-2 rounded-full bg-line-strong" />
                        <span className="size-2 rounded-full bg-line-strong" />
                        <span className="ml-auto font-mono text-[0.65rem] text-muted">zensha / {s.key}</span>
                      </div>
                      <div className="relative grid place-items-center px-10 py-12">
                        <div className="hs-orb" />
                        <ServiceVisual slug={s.visual} className="relative max-w-sm" />
                      </div>
                    </div>
                    <span className="hs-chip">
                      <span className="live-dot size-1.5 rounded-full bg-accent" />
                      {s.items.length} {s.items.length === 1 ? "service" : "services"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
