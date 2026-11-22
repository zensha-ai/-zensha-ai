import Link from "next/link";
import type { Metadata } from "next";
import { pageSeo } from "@/content/site";
import { websitePlans } from "@/content/pricing";
import { getServices } from "@/lib/data/catalog";
import { pageMetadata } from "@/lib/seo";
import { PageHero, Section } from "@/components/ui";
import { EnquiryForm } from "@/components/enquiry-form";
import { ContactDetails } from "@/components/contact-details";
import { ContactHeroScene } from "@/components/hero-scenes";

export const metadata: Metadata = pageMetadata({ ...pageSeo.contact, path: "/contact" });

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const services = await getServices();
  const requested = typeof sp.service === "string" ? sp.service : undefined;
  const defaultService = services.some((s) => s.slug === requested) ? requested : undefined;
  const plan = websitePlans.find((p) => p.id === sp.plan);
  const defaultMessage = plan ? `I'm interested in the ${plan.name} package (${plan.price}). ` : undefined;

  return (
    <>
      <PageHero
        visual={<ContactHeroScene />}
        eyebrow="Tell us what you have in mind"
        title="Let’s build something useful."
        text="Planning a website, application, AI solution or automation project? Share a little about your idea and we will help you identify the next step."
      />
      <Section>
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="display-3">Business enquiry</h2>
            <p className="mt-3 text-muted">Fields marked * are required.</p>
            <div className="mt-8">
              <EnquiryForm kind="business" serviceOptions={services.map((s) => ({ value: s.slug, label: s.title }))} defaultService={defaultService} defaultMessage={defaultMessage} />
            </div>
          </div>
          <aside className="space-y-12 lg:col-span-5">
            <div>
              <h2 className="eyebrow">Other ways to connect</h2>
              <div className="mt-5">
                <ContactDetails />
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-8">
              <h2 className="display-3">Student project support</h2>
              <p className="mt-3 text-ink-2">
                Questions about a student project, purchased files or setup? Use the dedicated Student Project Support form so we can help you more efficiently.
              </p>
              <Link href="/support#project-support" className="mt-6 inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-sm font-medium hover:border-ink">
                Get Project Support
              </Link>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
