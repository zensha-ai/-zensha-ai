import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { founderPortfolio, pageSeo } from "@/content/site";
import { getWorkItems } from "@/lib/data/catalog";
import { pageMetadata } from "@/lib/seo";
import {
  ButtonLink,
  PageHero,
  Section,
  SectionHeader,
  Tag,
} from "@/components/ui";
import {
  PortfolioGrid,
  type PortfolioEntry,
} from "@/components/portfolio-grid";
import { categoryFor } from "@/content/showcase";
import { ArrowUpRight } from "lucide-react";
import { WorkHeroScene } from "@/components/hero-scenes";

export const revalidate = 300;
export const metadata: Metadata = pageMetadata({
  ...pageSeo.ourWork,
  path: "/our-work",
});

export default async function OurWorkPage() {
  const [company, founderDb] = await Promise.all([
    getWorkItems("company"),
    getWorkItems("founder"),
  ]);
  const showFounder = brand.publish.founderPortfolio;
  const founderItems = founderDb.length
    ? founderDb.map((f) => ({
        slug: f.slug,
        title: f.title,
        period: f.year ?? "",
        summary: f.summary,
        technologies: f.technologies,
        href: `/our-work/${f.slug}`,
      }))
    : founderPortfolio.map((f) => ({ ...f, href: null as string | null }));

  const entries: PortfolioEntry[] = [
    ...company.map((w) => ({
      key: w.id,
      title: w.title,
      type: w.project_type,
      category: categoryFor(w.project_type),
      industry: w.industry,
      summary: w.summary,
      href: `/our-work/${w.slug}`,
      linkLabel: "View case study",
      liveUrl: w.demo_url,
      concept: false,
      visual: `work:${w.slug}`,
    })),
  ];

  return (
    <>
      <PageHero
        visual={<WorkHeroScene />}
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

      <section id="company-work" className="pf-cream py-20 sm:py-28">
        <div className="container-z">
          <div className="mb-12 grid gap-6 border-t border-line pt-6 md:grid-cols-12 md:gap-10">
            <p className="eyebrow md:col-span-3">— Portfolio</p>
            <div className="md:col-span-9">
              <h2 className="display-2 max-w-4xl text-balance">
                Selected <span className="text-accent">work</span> &amp; what we
                build.
              </h2>
              <p className="lede mt-5 max-w-2xl">
                Products and systems we have designed and built — web
                platforms, AI agents and data pipelines.
              </p>
            </div>
          </div>
          <PortfolioGrid entries={entries} />
        </div>
      </section>

      {showFounder && (
        <Section tone="alt" id="founder-portfolio">
          <SectionHeader
            eyebrow="Founder’s technical portfolio"
            title="Data engineering work by our founder."
            text={`Personal professional projects by ${brand.founder.name}. These are not ${brand.brandName} client engagements and do not imply endorsement by any past or present employer.`}
          />
          <ul className="grid gap-6 lg:grid-cols-3">
            {founderItems.map((p) => (
              <li
                key={p.slug}
                className="flex flex-col rounded-2xl border border-line bg-paper p-8"
              >
                <span className="eyebrow">{p.period}</span>
                <h2 className="display-3 mt-6">{p.title}</h2>
                <p className="mt-4 flex-1 text-ink-2">{p.summary}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.technologies.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                {p.href && (
                  <Link
                    href={p.href}
                    className="mt-6 text-sm font-medium underline underline-offset-4"
                  >
                    Technical write-up
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted">
            Case studies under{" "}
            <Link
              href="/resources/case-studies"
              className="underline underline-offset-4"
            >
              Resources
            </Link>{" "}
            tell longer business stories; Our Work is the visual portfolio.
          </p>
        </Section>
      )}

      <section className="pb-20 pt-4 sm:pb-28">
        <div className="container-z">
          <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border border-line-strong bg-surface px-7 py-9 sm:flex-row sm:items-center sm:px-12">
            <div aria-hidden className="aurora opacity-60" />
            <div className="relative">
              <p className="eyebrow">Your project next</p>
              <h2 className="display-3 mt-3 text-balance">
                Have something similar in mind?
              </h2>
            </div>
            <Link
              href="/contact"
              className="relative inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-on-accent transition-transform hover:-translate-y-0.5"
            >
              Start a Project Like This{" "}
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
