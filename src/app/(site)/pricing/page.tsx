import Link from "next/link";
import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { brand } from "@/config/brand";
import {
  addOns,
  beyondTags,
  comparison,
  priceFactors,
  pricingFaqs,
  pricingFinePrint,
  pricingPrinciple,
  pricingStats,
  projectTerms,
  websitePlans,
  whatYouReceive,
} from "@/content/pricing";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { ButtonLink, CtaBand, FaqList, PageHero, Section, SectionHeader } from "@/components/ui";
import { PricingCards } from "@/components/pricing";
import { AllServicePrices } from "@/components/service-price";
import { getServices } from "@/lib/data/catalog";
import { IconTile, tileTints } from "@/components/icon-tile";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/motion";
import { PricingRingVisual } from "@/components/hero-visuals";

export const metadata: Metadata = pageMetadata({
  title: `Website Packages & Pricing | ${brand.brandName}`,
  description: "Clear website packages from ₹9,999 — Starter, Business, Premium and Enterprise web applications, with a full feature comparison.",
  path: "/pricing",
});

export default async function PricingPage() {
  const services = await getServices();
  return (
    <>
      <PageHero
        visual={<PricingRingVisual price={websitePlans[0].price} plans={websitePlans} />}
        eyebrow="Clear starting prices · honest final proposals"
        title="Simple, honest pricing."
        text="Clear website packages — or a custom quote for apps, AI and automation."
        actions={
          <>
            <ButtonLink href="#compare" arrow>
              Compare Packages
            </ButtonLink>
            <ButtonLink href="/contact?service=website-design-development" variant="secondary">
              Request a Custom Quote
            </ButtonLink>
          </>
        }
        strip={
          <ul className="container-z grid grid-cols-2 gap-y-4 py-5 sm:grid-cols-4">
            {pricingStats.map((st, i) => (
              <li key={st.label} className="flex items-center justify-center gap-3 sm:border-l sm:border-line sm:first:border-l-0">
                <IconTile name={st.icon} tint={tileTints[i]} size="sm" />
                <span>
                  <span className="block text-base font-semibold">{st.value}</span>
                  <span className="block text-xs text-muted">{st.label}</span>
                </span>
              </li>
            ))}
          </ul>
        }
      />

      {/* Principle */}
      <Section tone="ink">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Our pricing principle</p>
            <h2 className="display-2 mt-6 text-balance">{pricingPrinciple.title}</h2>
          </div>
          <div className="space-y-5 lg:col-span-7 lg:pt-3">
            {pricingPrinciple.points.map((p) => (
              <p key={p} className="rounded-2xl border border-line-strong bg-surface/60 p-6 text-lg leading-relaxed text-ink-2">
                {p}
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* Packages */}
      <Section id="packages">
        <SectionHeader
          eyebrow="Website packages"
          title="Choose the package closest to what you need."
          text="Every project is reviewed before we confirm it. Your package is the starting point; the proposal lists the exact scope."
        />
        <PricingCards showCta={false} />
        <p className="mx-auto mt-10 max-w-3xl rounded-2xl border border-dashed border-line-strong p-5 text-center text-sm text-muted">{pricingFinePrint}</p>
      </Section>

      {/* All services */}
      <Section id="services-pricing">
        <SectionHeader eyebrow="All services" title="Starting prices for everything we do." text="Every price is a starting point — your final quote follows a short scope call." />
        <AllServicePrices services={services} />
      </Section>

      {/* Comparison */}
      <Section tone="alt" id="compare">
        <SectionHeader eyebrow="Package comparison" title="Compare every feature side by side." />
        <div className="overflow-x-auto rounded-3xl border border-line bg-surface">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">Features included in each website package</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="p-5 font-mono text-xs uppercase tracking-[0.12em] text-muted">
                  Feature
                </th>
                {websitePlans.map((p) => (
                  <th key={p.id} scope="col" className="p-5 align-bottom">
                    <span className="block font-medium" style={{ color: p.tint }}>
                      {p.name}
                    </span>
                    <span className="mt-1 block font-[family-name:var(--font-display)] text-lg font-semibold">{p.price}</span>
                    {p.popular && <span className="mt-1 inline-block font-mono text-[0.6rem] uppercase tracking-[0.12em] text-accent">Most popular</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-b border-line last:border-0 hover:bg-paper-2/60">
                  <th scope="row" className="p-4 pl-5 font-normal text-ink-2">
                    {row.feature}
                  </th>
                  {websitePlans.map((p, i) => (
                    <td key={p.id} className="p-4">
                      {i >= row.from ? (
                        <span className="grid size-6 place-items-center rounded-full" style={{ background: `color-mix(in oklab, ${p.tint} 20%, transparent)` }}>
                          <Check aria-label="Included" className="size-3.5" style={{ color: p.tint }} strokeWidth={3} />
                        </span>
                      ) : (
                        <Minus aria-label="Not included" className="size-4 text-line-strong" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted sm:hidden">Scroll sideways to see all four packages.</p>
      </Section>

      {/* What you receive */}
      <Section>
        <SectionHeader
          eyebrow="What you receive"
          title="The foundations behind every website we build."
          text="Depth varies by package, but every project is planned around your goals and built to go live properly."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whatYouReceive.map((r, i) => (
            <Reveal as="li" key={r.title} delay={(i % 4) * 0.05} className="spotlight rounded-2xl border border-line bg-surface p-6">
              <IconTile name={r.icon} tint={tileTints[i % tileTints.length]} />
              <h3 className="mt-5 font-medium">{r.title}</h3>
              <p className="mt-2 text-sm text-muted">{r.text}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Add-ons */}
      <Section tone="alt">
        <SectionHeader eyebrow="Optional add-ons" title="Add more when your business needs it." text="Add-ons are quoted separately when they aren’t already in your package." />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {addOns.map((a, i) => (
            <li key={a.title} className="spotlight flex gap-5 rounded-2xl border border-line bg-surface p-6">
              <IconTile name={a.icon} tint={tileTints[(i + 2) % tileTints.length]} />
              <div>
                <span className="inline-block rounded-full border border-line-strong px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted">{a.badge}</span>
                <h3 className="mt-3 font-medium">{a.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{a.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* What changes the price */}
      <Section>
        <SectionHeader
          eyebrow="Final pricing"
          title="What can change your final estimate?"
          text="Two websites with the same number of pages can need very different effort."
          action={
            <ButtonLink href="/contact?service=website-design-development" variant="secondary" arrow>
              Request an Accurate Quote
            </ButtonLink>
          }
        />
        <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {priceFactors.map((f, i) => (
            <li key={f.title} className="bg-paper p-7">
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-lg font-medium">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Project terms */}
      <Section tone="alt">
        <SectionHeader eyebrow="Project terms" title="Clear expectations before we start." text="Your proposal removes guesswork around scope, payments, delivery, revisions and support." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projectTerms.map((t, i) => (
            <li key={t.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-6">
              <IconTile name={t.icon} tint={tileTints[(i + 4) % tileTints.length]} size="sm" />
              <div>
                <h3 className="font-medium">{t.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{t.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Beyond packages */}
      <Section>
        <div className="relative overflow-hidden rounded-3xl border border-line-strong bg-surface p-8 sm:p-14">
          <div aria-hidden className="aurora opacity-80" />
          <div className="relative grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow">Beyond website packages</p>
              <h2 className="display-2 mt-5 text-balance">Need a web app, portal, dashboard or SaaS product?</h2>
              <p className="mt-5 text-lg text-ink-2">We also build mobile apps, AI systems, APIs, automation and custom software — priced to your exact scope.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/contact" arrow>
                  Discuss Custom Requirements
                </ButtonLink>
                <ButtonLink href="/services" variant="secondary">
                  Explore All Services
                </ButtonLink>
              </div>
            </div>
            <ul className="flex flex-wrap content-center gap-2 lg:col-span-5">
              {beyondTags.map((t) => (
                <li key={t} className="rounded-full border border-line-strong bg-paper/60 px-4 py-2 text-sm text-ink-2">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="alt">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Pricing FAQs</p>
            <h2 className="display-2 mt-6">Common questions about pricing.</h2>
            <Link href="/resources/faqs" className="mt-6 inline-block text-sm underline underline-offset-4 hover:text-accent">
              More general FAQs
            </Link>
          </div>
          <div className="lg:col-span-8">
            <FaqList faqs={pricingFaqs} />
          </div>
        </div>
      </Section>

      <CtaBand
        title="Tell us what you need. We’ll recommend the right package."
        text="Share your business type, pages, features, timeline and budget — we’ll suggest the best way to build it."
        primary={{ label: "Request a Quote", href: "/contact?service=website-design-development" }}
        secondary={{ label: "Website Development", href: "/services/website-design-development" }}
      />
      <JsonLd data={faqJsonLd(pricingFaqs)} />
    </>
  );
}
