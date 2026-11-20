import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { getFaqs } from "@/lib/data/catalog";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { Breadcrumbs, CtaBand, FaqList, PageHero, Section } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 300;
export const metadata: Metadata = pageMetadata({
  title: `Frequently Asked Questions | ${brand.brandName}`,
  description: "Clear answers about enquiries, planning, estimates, development, revisions, ownership, handover and ongoing support.",
  path: "/resources/faqs",
});

export default async function FaqsPage() {
  const faqs = await getFaqs("general");
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "FAQs" }]} />
      <PageHero
        eyebrow="Frequently asked questions"
        title="Clear answers before you begin."
        text="Learn how enquiries, planning, estimates, development, revisions, handover and ongoing support typically work."
      />
      <Section>
        <div className="mx-auto max-w-4xl">
          <FaqList faqs={faqs} />
        </div>
      </Section>
      <CtaBand title="Still have a question?" text="Share your goals, key requirements and any relevant references. We can then discuss scope and next steps." primary={{ label: "Contact Us", href: "/contact" }} />
      <JsonLd data={faqJsonLd(faqs)} />
    </>
  );
}
