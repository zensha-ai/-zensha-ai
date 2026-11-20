import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { pageMetadata } from "@/lib/seo";
import { FaqList, PageHero, Section } from "@/components/ui";
import { EnquiryForm } from "@/components/enquiry-form";
import { ContactDetails } from "@/components/contact-details";

export const metadata: Metadata = pageMetadata({
  title: `Help Centre & Project Support | ${brand.brandName}`,
  description: "Help with accounts, payments, downloads, installation and student project questions.",
  path: "/support",
});

const topics = [
  { t: "Accounts", d: "Create an account, sign in or reset your password.", href: "/login" },
  { t: "Orders & payments", d: "Review your order history and payment status.", href: "/account/orders" },
  { t: "Downloads", d: "Find the digital files available with your purchases.", href: "/account/downloads" },
  { t: "Refunds", d: "Separate rules for services, digital downloads and physical items.", href: "/legal/refunds" },
];

const supportFaqs = [
  { q: "Where are my files after purchase?", a: "Eligible digital files appear in My Downloads once payment is confirmed. Download access follows the terms shown at checkout." },
  { q: "My payment failed but I was charged.", a: "Contact support with your order reference. Do not retry repeatedly — we will check the payment status with the payment provider." },
  { q: "Can I share the files I bought?", a: "No. Files are licensed to the purchaser for learning use; see the Student Project License for details." },
];

export default async function SupportPage({ searchParams }: PageProps<"/support">) {
  const sp = await searchParams;
  const project = typeof sp.project === "string" ? sp.project.slice(0, 160) : undefined;
  return (
    <>
      <PageHero
        eyebrow="Support centre"
        title="Help with accounts, payments, downloads and setup."
        text="For project-specific issues, include the project name, order reference and a description of the problem. Never submit passwords or payment card details."
      />
      <Section>
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((x) => (
            <li key={x.t} className="bg-paper">
              <Link href={x.href} className="block h-full p-8 hover:bg-surface">
                <h2 className="text-lg font-medium">{x.t}</h2>
                <p className="mt-2 text-sm text-muted">{x.d}</p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-16 max-w-4xl">
          <FaqList faqs={supportFaqs} />
        </div>
      </Section>
      <Section tone="alt" id="project-support">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="display-2">Student Project Support</h2>
            <p className="mt-4 text-ink-2">Questions about a student project, purchased files or setup? Tell us what&rsquo;s happening.</p>
            <div className="mt-8">
              <EnquiryForm kind="student_support" defaultService={project} />
            </div>
          </div>
          <aside className="lg:col-span-5">
            <h2 className="eyebrow">Other ways to connect</h2>
            <div className="mt-5">
              <ContactDetails />
            </div>
            <p className="mt-6 text-sm text-muted">
              Business enquiries go through the{" "}
              <Link href="/contact" className="underline underline-offset-4">
                contact page
              </Link>
              .
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}
