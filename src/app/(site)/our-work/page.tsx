import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { founderPortfolio, pageSeo } from "@/content/site";
import { getWorkItems } from "@/lib/data/catalog";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink, CtaBand, EmptyState, PageHero, Section, SectionHeader, Tag } from "@/components/ui";
import { WorkCard } from "@/components/work-card";
import { DashboardVisual } from "@/components/hero-visuals";

export const revalidate = 300;
export const metadata: Metadata = pageMetadata({ ...pageSeo.ourWork, path: "/our-work" });

export default async function OurWorkPage() {
  const [company, founderDb] = await Promise.all([getWorkItems("company"), getWorkItems("founder")]);
  const showFounder = brand.publish.founderPortfolio;
  const founderItems = founderDb.length
    ? founderDb.map((f) => ({ slug: f.slug, title: f.title, period: f.year ?? "", summary: f.summary, technologies: f.technologies, href: `/our-work/${f.slug}` }))
    : founderPortfolio.map((f) => ({ ...f, href: null as string | null }));

  return (
    <>
      <PageHero
        visual={<DashboardVisual />}
        eyebrow="Selected projects and practical outcomes"
        title="Real products, built and running."
        text="The problem, the approach and what we actually delivered."
        actions={
          <>
            <ButtonLink href="#company-work" arrow>
              Explore Projects
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Discuss Your Idea
            </ButtonLink>
          </>
        }
      />

      <Section id="company-work">
        <SectionHeader
          eyebrow={`${brand.brandName} projects`}
          title="Every project begins with a different need."
        />
        {company.length ? (
          <ul className="grid gap-x-6 gap-y-10 md:grid-cols-2">
            {company.map((w, i) => (
              <li key={w.id} className={i === 0 ? "md:col-span-2" : undefined}>
                <WorkCard item={w} featured={i === 0} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Client work, published with permission."
            text={`Verified ${brand.brandName} client projects will appear here once they are delivered and approved for publication. We do not publish invented clients, results or testimonials.`}
            action={
              <ButtonLink href="/contact" variant="secondary">
                Be one of our first projects
              </ButtonLink>
            }
          />
        )}
      </Section>

      {showFounder && (
        <Section tone="alt" id="founder-portfolio">
          <SectionHeader
            eyebrow="Founder’s technical portfolio"
            title="Data engineering work by our founder."
            text={`Personal professional projects by ${brand.founder.name}. These are not ${brand.brandName} client engagements and do not imply endorsement by any past or present employer.`}
          />
          <ul className="grid gap-6 lg:grid-cols-3">
            {founderItems.map((p) => (
              <li key={p.slug} className="flex flex-col rounded-2xl border border-line bg-paper p-8">
                <span className="eyebrow">{p.period}</span>
                <h2 className="display-3 mt-6">{p.title}</h2>
                <p className="mt-4 flex-1 text-ink-2">{p.summary}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.technologies.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                {p.href && (
                  <Link href={p.href} className="mt-6 text-sm font-medium underline underline-offset-4">
                    Technical write-up
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted">
            Case studies under{" "}
            <Link href="/resources/case-studies" className="underline underline-offset-4">
              Resources
            </Link>{" "}
            tell longer business stories; Our Work is the visual portfolio.
          </p>
        </Section>
      )}

      <CtaBand title="Have a similar challenge?" text="Let’s discuss your project." primary={{ label: "Start a Project", href: "/contact" }} />
    </>
  );
}
