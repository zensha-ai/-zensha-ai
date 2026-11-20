import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
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
  const enquiryHref = `/contact?service=${encodeURIComponent(service.slug)}`;

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.title }]} />
      <PageHero
        eyebrow={`Service ${service.number} — ${service.title}`}
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
          <div className="space-y-5">
            <div className="flex items-center gap-4 text-muted">
              <span className="grid size-14 place-items-center rounded-full border border-line-strong">
                <ServiceIcon name={service.icon} className="size-6 text-ink" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.12em]">{brand.brandName} Services</span>
            </div>
            {priceLabel(service.slug) && (
              <a href="#pricing" className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/70 px-4 py-2 text-sm backdrop-blur hover:border-ink">
                <span aria-hidden className="live-dot size-1.5 rounded-full bg-accent-2" />
                {priceLabel(service.slug)}
              </a>
            )}
          </div>
        }
      />

      {/* Problem / solution */}
      <Section>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          <div className="bg-paper p-8 sm:p-12">
            <p className="eyebrow">The challenge</p>
            <p className="display-3 mt-6">{service.challenge}</p>
          </div>
          <div className="bg-surface p-8 sm:p-12">
            <p className="eyebrow text-accent">How we help</p>
            <p className="display-3 mt-6">{service.solution}</p>
          </div>
        </div>
      </Section>

      {/* Capabilities + use cases */}
      <Section tone="alt">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow">What we can build</p>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {service.capabilities.map((c) => (
                <li key={c} className="flex items-start gap-4 py-4 text-lg">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <p className="eyebrow">Relevant use cases</p>
            <ul className="mt-8 space-y-4">
              {service.useCases.map((u, i) => (
                <li key={u} className="rounded-xl border border-line bg-paper p-5">
                  <span className="font-mono text-xs text-muted">Use case {String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2">{u}</p>
                </li>
              ))}
            </ul>
            {service.audience && (
              <>
                <p className="eyebrow mt-12">Who it is for</p>
                <p className="mt-4 text-lg text-ink-2">{service.audience}</p>
              </>
            )}
          </div>
        </div>
      </Section>

      {service.slug === "website-design-development" ? (
        <Section id="pricing">
          <p className="eyebrow">Website packages</p>
          <h2 className="display-2 mt-4">Clear prices. No surprises.</h2>
          <div className="mt-10">
            <PricingCards />
          </div>
        </Section>
      ) : (
        <Section id="pricing">
          <p className="eyebrow">Pricing</p>
          <h2 className="display-2 mt-4">Clear starting price.</h2>
          <div className="mt-10">
            <ServicePricePanel service={service} />
          </div>
        </Section>
      )}

      {/* Process */}
      <Section>
        <p className="eyebrow">Our approach</p>
        <ol className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3">
          {service.process.map((p, i) => (
            <li key={p} className="flex items-center gap-3">
              <span className="rounded-full border border-line-strong bg-surface px-4 py-2 text-sm">
                <span className="mr-2 font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                {p}
              </span>
              {i < service.process.length - 1 && <span aria-hidden className="text-muted">→</span>}
            </li>
          ))}
        </ol>
        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow">Technology</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {service.technologies.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
            <p className="mt-5 text-sm text-muted">{service.technologyNote}</p>
          </div>
          <div className="lg:col-span-6">
            <p className="eyebrow">The outcome</p>
            <p className="display-3 mt-6">{service.outcome}</p>
          </div>
        </div>
      </Section>

      {/* FAQs */}
      <Section tone="alt">
        <div className="grid gap-10 lg:grid-cols-12">
          <h2 className="display-2 lg:col-span-4">Common questions</h2>
          <div className="lg:col-span-8">
            <FaqList faqs={service.faqs} />
          </div>
        </div>
      </Section>

      {/* Related */}
      {related.length > 0 && (
        <Section>
          <p className="eyebrow">Related services</p>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/services/${r.slug}`} className="group block h-full border-t border-ink pt-5">
                  <span className="font-mono text-xs text-muted">{r.number}</span>
                  <span className="mt-3 flex items-start justify-between gap-3 text-xl font-medium group-hover:text-accent">
                    {r.title}
                    <ArrowUpRight aria-hidden className="mt-1 size-4 shrink-0" />
                  </span>
                  <span className="mt-2 block text-sm text-muted">{r.short}</span>
                </Link>
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
