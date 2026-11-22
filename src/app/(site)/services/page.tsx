import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { pageSeo } from "@/content/site";
import { serviceGroups } from "@/content/service-groups";
import { getServices } from "@/lib/data/catalog";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink, CtaBand, PageHero, Section } from "@/components/ui";
import { ServiceGrid, ServiceLinkCard } from "@/components/service-card";
import { ServicesShowcase, type ShowcaseSlide } from "@/components/services-showcase";
import { ServicesHub } from "@/components/services-hub";
import { ServicesOrbitVisual } from "@/components/hero-visuals";

export const revalidate = 300;
export const metadata: Metadata = pageMetadata({ ...pageSeo.services, path: "/services" });

export default async function ServicesPage() {
  const services = await getServices();
  const bySlug = new Map(services.map((s) => [s.slug, s]));
  // Data Engineering is the founder's core strength — it closes the grid, full width.
  const featured = "data-engineering-analytics";
  const ordered = [...services.filter((s) => s.slug !== featured), ...services.filter((s) => s.slug === featured)];

  const slides: ShowcaseSlide[] = serviceGroups.map((g) => {
    const items = g.services.map((slug) => bySlug.get(slug)).filter((s) => !!s);
    return {
      key: g.key,
      label: g.label,
      title: g.title,
      text: g.text,
      visual: g.services[0],
      items: items.map((s) => ({ slug: s.slug, title: s.title })),
    };
  });

  return (
    <>
      <PageHero
        visual={<ServicesOrbitVisual />}
        eyebrow="Technology services for growing businesses"
        title="Build, connect and grow."
        text="Design, development, AI, automation and data — under one roof. Explore each service below, or open its page for details, process and FAQs."
        actions={
          <>
            <ButtonLink href="/contact" arrow>
              Discuss a Project
            </ButtonLink>
            <ButtonLink href="#all-services" variant="secondary">
              Explore Services
            </ButtonLink>
          </>
        }
      />

      <Section id="all-services" tone="alt">
        <div className="reveal mb-14 max-w-4xl">
          <p className="eyebrow">Services</p>
          <h2 className="display-2 mt-4 text-balance">
            Everything your business needs to <span className="text-accent">build, automate &amp; grow.</span>
          </h2>
          <p className="lede mt-5 max-w-2xl">
            One technology partner for the websites, apps, AI and automations your business runs on.
          </p>
        </div>
        <ServiceGrid services={ordered} />
      </Section>

      <ServicesShowcase slides={slides} />

      <ServicesHub groups={serviceGroups} />

      <Section>
        <div className="reveal">
          <p className="eyebrow">Service details</p>
          <h2 className="display-2 mt-4">Explore each service in depth.</h2>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {ordered.map((s, i) => (
            <li key={s.slug} className="reveal" style={{ "--reveal-delay": `${(i % 4) * 0.05}s` } as CSSProperties}>
              <ServiceLinkCard service={s} />
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title="Not sure which service fits?"
        text="Tell us what you want to improve or build. We will help you define a practical starting point."
        primary={{ label: "Talk to Our Team", href: "/contact" }}
        secondary={{ label: "Read the FAQs", href: "/resources/faqs" }}
      />
    </>
  );
}
