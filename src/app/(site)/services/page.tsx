import type { Metadata } from "next";
import { pageSeo } from "@/content/site";
import { getServices } from "@/lib/data/catalog";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink, CtaBand, PageHero, Section, SectionHeader } from "@/components/ui";
import { ServiceBento } from "@/components/service-card";
import { ServicesOrbitVisual } from "@/components/hero-visuals";

export const revalidate = 300;
export const metadata: Metadata = pageMetadata({ ...pageSeo.services, path: "/services" });

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero
        visual={<ServicesOrbitVisual />}
        eyebrow="Technology services for growing businesses"
        title="Build, connect and grow."
        text="Design, development, AI, automation and data — under one roof."
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
      <Section id="all-services">
        <SectionHeader
          eyebrow="Services"
          title="Every business has different goals."
          text="Pick a service to see what we build, how we work and what to expect."
        />
        <ServiceBento services={services} />
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
