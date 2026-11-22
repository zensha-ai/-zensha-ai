import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { groupOf } from "@/content/service-groups";
import { ServiceLinkCard } from "@/components/service-card";
import { services as seedServices } from "@/content/services";
import { getServiceBySlug, getServices } from "@/lib/data/catalog";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { brand } from "@/config/brand";
import { Breadcrumbs, ButtonLink, CtaBand, FaqList, PageHero, Section, Tag } from "@/components/ui";
import { ServiceIcon } from "@/components/service-icon";
import { JsonLd } from "@/components/json-ld";
import { PricingCards } from "@/components/pricing";
import { ServicePricePanel } from "@/components/service-price";
import { priceLabel } from "@/content/service-pricing";

export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return seedServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = await getServiceBySlug(slug);
  if (!s) return {};
  return pageMetadata({ ...s.seo, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const [service, all] = await Promise.all([getServiceBySlug(slug), getServices()]);
  if (!service) notFound();
  const related = service.related.map((r) => all.find((s) => s.slug === r)).filter((s) => !!s);
  const group = groupOf(service.slug);
  const enquiryHref = `/contact?service=${encodeURIComponent(service.slug)}`;

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.title }]} />
      <PageHero
        eyebrow={`${group.label} — ${service.title}`}
        title={service.headline}
        text={service.intro}
        actions={
          <>
            <ButtonLink href={enquiryHref} arrow>
              Request a Consultation
            </ButtonLink>
            <ButtonLink href="/our-work" variant="secondary">
              See Related Work
            </ButtonLink>
          </>
        }
        aside={
          <div className="xaside relative overflow-hidden rounded-2xl border border-line-strong bg-surface/80 p-6 backdrop-blur">
            <div aria-hidden className="xtile-orb" />
            <div className="relative flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-on-accent">
                <ServiceIcon name={service.icon} className="size-5" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
                {group.label} · Service {service.number}
              </span>
            </div>
            <p className="relative mt-6 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">What&rsquo;s included</p>
            <ul className="relative mt-3 space-y-2.5">
              {service.capabilities.slice(0, 4).map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                  {c}
                </li>
              ))}
            </ul>
            {priceLabel(service.slug) && (
              <a href="#pricing" className="relative mt-6 flex items-center justify-between border-t border-line pt-4 text-sm hover:text-accent">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">Starting price</span>
                <span className="inline-flex items-center gap-2 font-semibold">
                  <span aria-hidden className="live-dot size-1.5 rounded-full bg-accent" />
                  {priceLabel(service.slug)}
                </span>
              </a>
            )}
          </div>
        }
      />

      {/* 2 - What's included */}
      <Section tone="alt">
        <div className="reveal mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow">What&rsquo;s included</p>
            <h2 className="display-2 mt-4 text-balance">
              Everything you get with <span className="text-accent">{service.title}.</span>
            </h2>
          </div>
          <p className="lede lg:col-span-4">{service.solution}</p>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {service.capabilities.map((c, i) => (
            <li key={c} className="reveal" style={{ "--reveal-delay": `${(i % 3) * 0.06}s` } as CSSProperties}>
              <div className="svc-card xinc spotlight group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-7">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent text-on-accent shadow-[0_0_28px_-6px_var(--accent)]">
                    <Check aria-hidden className="size-5" strokeWidth={3} />
                  </span>
                  <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="mt-8 text-lg font-semibold leading-snug">{c}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* 3 - Who it's for */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="reveal lg:col-span-5">
            <p className="eyebrow">Who it&rsquo;s for</p>
            <h2 className="display-2 mt-4 text-balance">
              Built for results, <span className="text-accent">not decoration.</span>
            </h2>
            <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">The challenge</p>
              <p className="mt-3 text-lg text-ink">{service.challenge}</p>
            </div>
            {service.audience && <p className="mt-6 text-ink-2">{service.audience}</p>}
          </div>
          <ul className="lg:col-span-7 lg:pt-14">
            {service.useCases.map((u, i) => (
              <li key={u} className="reveal group flex items-start gap-6 border-t border-line py-6 last:border-b">
                <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-xl font-medium leading-snug transition-transform duration-500 group-hover:translate-x-2">{u}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 4 - Pricing */}
      {service.slug === "website-design-development" ? (
        <Section id="pricing" tone="ink">
          <p className="eyebrow">Website packages</p>
          <h2 className="display-2 mt-4">Clear prices. No surprises.</h2>
          <div className="mt-10">
            <PricingCards />
          </div>
        </Section>
      ) : (
        <Section id="pricing" tone="ink">
          <p className="eyebrow">Pricing</p>
          <h2 className="display-2 mt-4">Clear starting price.</h2>
          <div className="mt-10">
            <ServicePricePanel service={service} />
          </div>
        </Section>
      )}

      {/* 5 - How it works */}
      <Section>
        <div className="reveal">
          <p className="eyebrow">How it works</p>
          <h2 className="display-2 mt-4 text-balance">
            From brief to delivery in <span className="text-accent">{service.process.length} clear steps.</span>
          </h2>
        </div>
        <ol className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {service.process.map((p, i) => (
            <li key={p} className="reveal" style={{ "--reveal-delay": `${(i % 3) * 0.06}s` } as CSSProperties}>
              <div className="xstep group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-7">
                <span aria-hidden className="xstep-num">{String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden className="relative mb-10 block size-3 rounded-full bg-accent shadow-[0_0_0_6px_var(--accent-soft)]" />
                <span className="relative font-mono text-xs text-accent">Step {String(i + 1).padStart(2, "0")}</span>
                <p className="relative mt-2 text-lg font-semibold">{p}</p>
                <span aria-hidden className="xstep-bar" />
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-20 grid gap-10 border-t border-line pt-12 lg:grid-cols-12">
          <div className="reveal lg:col-span-6">
            <p className="eyebrow">Technology</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {service.technologies.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
            <p className="mt-5 text-sm text-muted">{service.technologyNote}</p>
          </div>
          <div className="reveal lg:col-span-6">
            <p className="eyebrow">The outcome</p>
            <p className="display-3 mt-6">{service.outcome}</p>
          </div>
        </div>
      </Section>

      {/* 6 - FAQs */}
      <Section tone="alt">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <p className="eyebrow">FAQ</p>
            <h2 className="display-2 mt-4 text-balance">Questions about {service.title}</h2>
          </div>
          <div className="lg:col-span-8">
            <FaqList faqs={service.faqs} />
          </div>
        </div>
      </Section>

      {/* 7 - More services */}
      {related.length > 0 && (
        <Section>
          <div className="reveal">
            <p className="eyebrow">More services</p>
            <h2 className="display-2 mt-4">One partner for every digital need.</h2>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <li key={r.slug} className="reveal" style={{ "--reveal-delay": `${i * 0.06}s` } as CSSProperties}>
                <ServiceLinkCard service={r} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand title={service.cta.heading} text={service.cta.text} primary={{ label: service.cta.label, href: enquiryHref }} secondary={{ label: "All services", href: "/services" }} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.seo.description,
          provider: { "@type": "Organization", name: brand.brandName, url: brand.siteUrl },
          areaServed: "IN",
          url: `${brand.siteUrl}/services/${service.slug}`,
        }}
      />
      <JsonLd data={faqJsonLd(service.faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ])}
      />
    </>
  );
}
