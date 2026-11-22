import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, ListChecks, MessagesSquare, PenTool, Target } from "lucide-react";
import { brand } from "@/config/brand";
import { home, pageSeo } from "@/content/site";
import { getArticles, getProducts, getServices, getWorkItems } from "@/lib/data/catalog";
import { labels } from "@/lib/format";
import { HeroMark, Reveal } from "@/components/motion";
import { NetworkField } from "@/components/effects";
import { WorkCard } from "@/components/work-card";
import { ServiceIcon } from "@/components/service-icon";
import { serviceTints } from "@/components/service-visual";
import { Badge, ButtonLink, CtaBand, Section, SectionHeader, SplitWords } from "@/components/ui";
import { PricingCards } from "@/components/pricing";
import { servicePricing } from "@/content/service-pricing";
import { PriceLabel, WasPrice } from "@/components/offer";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({ ...pageSeo.home, path: "/" });

const studentCategories = [
  { label: "Software", text: "Python, web, AI and data projects.", href: "/student-projects?category=software" },
  { label: "Hardware", text: "Arduino, ESP32 and Raspberry Pi builds.", href: "/student-projects?category=hardware" },
  { label: "IoT & Robotics", text: "Connected devices and smart robots.", href: "/student-projects?category=iot-robotics" },
  { label: "Free Starters", text: "Begin learning at no cost.", href: "/student-projects?price=free" },
];

const whyIcons = [
  { Icon: MessagesSquare, tint: "var(--accent)" },
  { Icon: Target, tint: "var(--accent-2)" },
  { Icon: PenTool, tint: "var(--accent)" },
  { Icon: ListChecks, tint: "var(--accent)" },
];

export default async function HomePage() {
  const [services, products, work, articles] = await Promise.all([getServices(), getProducts(), getWorkItems("company"), getArticles()]);
  const realProducts = products.filter((p) => !p.is_example).slice(0, 3);

  // Section numbers follow only the sections that actually render.
  let n = 0;
  const idx = () => String(++n).padStart(2, "0");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="aurora" />
        <div aria-hidden className="grid-paper pointer-events-none absolute inset-0 opacity-60" />
        <NetworkField className="absolute inset-0 h-full w-full opacity-60" />
        <div className="container-z relative grid items-center gap-12 pb-16 pt-12 sm:pt-20 lg:grid-cols-12 lg:pb-24">
          <div className="lg:col-span-7">
            <p className="eyebrow inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-surface/70 px-3 py-1.5 backdrop-blur">
              <span aria-hidden className="live-dot size-1.5 rounded-full bg-accent-2" />
              {home.eyebrow}
            </p>
            <h1 className="display-1 mt-7 text-balance">
              <SplitWords text={home.headline} accentLast />
            </h1>
            <p className="lede fade-up mt-8 max-w-xl" style={{ "--d": "0.45s" } as React.CSSProperties}>
              {home.intro}
            </p>
            <div className="fade-up mt-10 flex flex-wrap gap-3" style={{ "--d": "0.6s" } as React.CSSProperties}>
              <ButtonLink href="/contact" arrow>
                Start Your Project
              </ButtonLink>
              <ButtonLink href="/services" variant="secondary">
                Explore Our Services
              </ButtonLink>
            </div>
          </div>
          <div className="fade-up mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none" style={{ "--d": "0.2s" } as React.CSSProperties}>
            <HeroMark />
            <p className="mt-4 flex items-center justify-between font-mono text-xs text-muted">
              <span>{brand.brandName}</span>
              <span>{brand.descriptor}</span>
            </p>
          </div>
        </div>
        {/* Services strip */}
        <div className="marquee relative overflow-hidden border-t border-line py-5" aria-label="Our services">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <ul key={k} className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={k === 1 || undefined}>
                {services.map((s) => (
                  <li key={`${k}-${s.slug}`}>
                    <Link
                      href={`/services/${s.slug}`}
                      tabIndex={k === 1 ? -1 : undefined}
                      className="group flex items-center gap-3 whitespace-nowrap font-[family-name:var(--font-display)] text-xl text-muted transition-colors hover:text-ink sm:text-2xl"
                      style={{ "--tint": serviceTints[s.slug] } as React.CSSProperties}
                    >
                      <span className="grid size-9 place-items-center rounded-xl border border-line-strong text-[var(--tint)] transition-colors group-hover:border-[var(--tint)]">
                        <ServiceIcon name={s.icon} className="size-4" />
                      </span>
                      {s.title}
                      <span aria-hidden className="ml-7 text-accent">/</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <Section tone="alt">
        <SectionHeader
          index={idx()}
          eyebrow="Services"
          title="Eleven ways we help your business run better."
          action={
            <ButtonLink href="/services" variant="secondary" arrow>
              View All Services
            </ButtonLink>
          }
        />
        <ol className="border-t border-line">
          {services.map((s) => (
            <li key={s.slug} className="border-b border-line">
              <Link
                href={`/services/${s.slug}`}
                style={{ "--tint": serviceTints[s.slug] } as React.CSSProperties}
                className="svc-row group grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-5 sm:grid-cols-[5rem_1fr_1fr_9rem_auto] sm:py-6"
              >
                <span className="relative flex items-center gap-2 font-mono text-sm text-muted transition-colors group-hover:text-[var(--tint)]">
                  <span aria-hidden className="size-1.5 rounded-full bg-[var(--tint)] opacity-40 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100" />
                  {s.number}
                </span>
                <span className="relative flex items-center gap-3 text-lg font-medium transition-transform duration-500 group-hover:translate-x-2 sm:text-xl">
                  <ServiceIcon name={s.icon} className="size-4 shrink-0 text-[var(--tint)]" />
                  {s.title}
                </span>
                <span className="relative hidden text-sm text-muted transition-colors group-hover:text-ink-2 sm:block">{s.short}</span>
                <span className="relative hidden justify-self-end whitespace-nowrap rounded-full border border-line-strong px-3 py-1 text-xs text-ink-2 transition-colors group-hover:border-[var(--tint)] group-hover:text-[var(--tint)] sm:inline-block">
                  <WasPrice price={servicePricing[s.slug]?.from ?? ""} className="mr-1.5" />
                  <PriceLabel slug={s.slug} />
                </span>
                <ArrowUpRight aria-hidden className="relative size-4 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--tint)]" />
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      {/* Pricing */}
      <Section id="pricing">
        <SectionHeader index={idx()} eyebrow="Website packages" title="Clear prices. No surprises." text="Pick a starting point — every package is built to bring you enquiries." />
        <PricingCards />
      </Section>

      {/* Selected work */}
      {work.length > 0 && (
        <Section>
          <SectionHeader
            index={idx()}
            eyebrow="Featured work"
            title="See the thinking behind the work."
            action={
              <ButtonLink href="/our-work" variant="secondary" arrow>
                See Our Work
              </ButtonLink>
            }
          />
          <ul className="grid gap-x-6 gap-y-10 md:grid-cols-2">
            {work.slice(0, 3).map((w, i) => (
              <li key={w.id} className={i === 0 ? "md:col-span-2" : undefined}>
                <WorkCard item={w} featured={i === 0} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Products — only when real products exist */}
      {realProducts.length > 0 && (
        <Section>
          <SectionHeader
            index={idx()}
            eyebrow="Products"
            title={home.products.heading}
            action={
              <ButtonLink href="/products" variant="secondary" arrow>
                Explore Products
              </ButtonLink>
            }
          />
          <ul className="grid gap-6 md:grid-cols-3">
            {realProducts.map((p) => (
              <li key={p.id} className="spotlight rounded-2xl border border-line bg-surface p-8">
                <div className="flex items-center justify-between gap-3">
                  <span className="eyebrow">{labels.productCategory[p.category]}</span>
                  <Badge tone={p.status === "available" ? "success" : "neutral"}>{labels.status[p.status]}</Badge>
                </div>
                <h3 className="display-3 mt-8">{p.name}</h3>
                <p className="mt-3 text-ink-2">{p.tagline}</p>
                <Link href={`/products/${p.slug}`} className="mt-8 inline-flex items-center gap-1 text-sm font-medium hover:text-accent">
                  Explore Product <ArrowUpRight aria-hidden className="size-4" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Founder & data expertise */}
      <Section tone="ink">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">
              <span className="mr-3 text-accent">{idx()}</span>Founder & data expertise
            </p>
            <h2 className="display-2 mt-6 text-balance">{home.data.heading}</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">{home.data.text}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/services/data-engineering-analytics" arrow>
                Explore Data Engineering
              </ButtonLink>
              <ButtonLink href="/about#founder" variant="secondary">
                Meet the Founder
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-5">
            <DataFlow />
          </div>
        </div>
      </Section>

      {/* Student projects */}
      <Section>
        <SectionHeader
          index={idx()}
          eyebrow="Student Projects"
          title={home.students.heading}
          text={home.students.text}
          action={
            <ButtonLink href="/student-projects" variant="secondary" arrow>
              Browse Student Projects
            </ButtonLink>
          }
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {studentCategories.map((c, i) => (
            <Reveal as="li" key={c.label} delay={i * 0.05}>
              <Link href={c.href} className="group block h-full border-t border-ink pt-5">
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-4 block text-xl font-medium group-hover:text-accent">{c.label}</span>
                <span className="mt-2 block text-sm leading-relaxed text-muted">{c.text}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Why + process */}
      <Section tone="alt">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">
              <span className="mr-3 text-accent">{idx()}</span>Why work with us
            </p>
            <h2 className="display-2 mt-6">Clarity at every step.</h2>
            <ul className="mt-10 space-y-4">
              {home.why.map((w, i) => {
                const { Icon, tint } = whyIcons[i % whyIcons.length];
                return (
                  <li key={w} className="flex items-center gap-4 rounded-2xl border border-line bg-surface/60 p-4 text-lg">
                    <span
                      className="grid size-11 shrink-0 place-items-center rounded-xl border"
                      style={{ color: tint, borderColor: `color-mix(in oklab, ${tint} 40%, transparent)`, background: `color-mix(in oklab, ${tint} 12%, transparent)` }}
                    >
                      <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                    </span>
                    {w}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow">Our process</p>
            <ol className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {home.process.map((p) => (
                <li key={p.n} className="spotlight bg-paper-2 p-8">
                  <span className="font-mono text-sm text-accent">{p.n}</span>
                  <h3 className="display-3 mt-6">{p.title}</h3>
                  <p className="mt-3 text-ink-2">{p.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* Resources — only when articles are published */}
      {articles.length > 0 && (
        <Section>
          <SectionHeader
            index={idx()}
            eyebrow="Resources"
            title={home.resources.heading}
            text={home.resources.text}
            action={
              <ButtonLink href="/resources" variant="secondary" arrow>
                Visit Resources
              </ButtonLink>
            }
          />
          <ul className="grid gap-6 md:grid-cols-3">
            {articles.slice(0, 3).map((a) => (
              <li key={a.id}>
                <Link
                  href={`/resources/${a.kind === "blog" ? "blog" : a.kind === "guide" ? "guides" : "case-studies"}/${a.slug}`}
                  className="group block border-t border-ink pt-5"
                >
                  <span className="eyebrow">{a.category}</span>
                  <h3 className="mt-3 text-xl font-medium group-hover:text-accent">{a.title}</h3>
                  <p className="mt-2 text-sm text-muted">{a.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand
        title={home.finalCta.heading}
        text={home.finalCta.text}
        primary={{ label: "Let’s Talk", href: "/contact" }}
        secondary={{ label: "Explore Services", href: "/services" }}
      />
    </>
  );
}

/** Quiet diagram of a data pipeline: sources → pipeline → warehouse → insight. */
function DataFlow() {
  const stages = ["Sources", "Ingest", "Transform", "Warehouse", "Insight"];
  return (
    <figure aria-label="Data flows from sources through ingestion and transformation into a warehouse, then to insight" className="spotlight rounded-2xl border border-line-strong bg-surface/80 p-6 backdrop-blur sm:p-8">
      <div className="mb-6 flex items-center justify-between border-b border-line pb-4 font-mono text-xs text-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden className="live-dot size-1.5 rounded-full bg-accent-2" /> pipeline · healthy
        </span>
        <span>ETL / ELT</span>
      </div>
      <ol className="space-y-3">
        {stages.map((s, i) => (
          <li key={s} className="flex items-center gap-4">
            <span className="w-8 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="h-px flex-1 bg-gradient-to-r from-line-strong to-accent" style={{ maxWidth: `${30 + i * 15}%` }} aria-hidden />
            <span className={i === stages.length - 1 ? "text-accent-2" : "text-ink"}>{s}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
