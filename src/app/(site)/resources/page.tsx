import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { pageSeo, plannedArticles } from "@/content/site";
import { getArticles } from "@/lib/data/catalog";
import { pageMetadata } from "@/lib/seo";
import { ArticleCard, kindMeta } from "@/components/resources";
import { Badge, ButtonLink, CtaBand, PageHero, Section, SectionHeader } from "@/components/ui";
import { ArticlesVisual } from "@/components/hero-visuals";

export const revalidate = 300;
export const metadata: Metadata = pageMetadata({ ...pageSeo.resources, path: "/resources" });

const areas = [
  { ...kindMeta.blog, text: "Understand trends, opportunities and practical ways businesses can use technology." },
  { ...kindMeta.case_study, text: "Explore real challenges, project decisions and verified outcomes." },
  { ...kindMeta.guide, text: "Learn how to plan a website, compare software options, prepare for AI adoption and scope a digital project." },
  { label: "Frequently Asked Questions", path: "/resources/faqs", text: "Get straightforward answers about pricing, delivery, ownership, maintenance and support." },
];

export default async function ResourcesPage() {
  const latest = (await getArticles()).slice(0, 3);
  return (
    <>
      <PageHero
        visual={<ArticlesVisual />}
        eyebrow="Ideas, guides and answers for businesses"
        title="Clear answers, better decisions."
        text="Guides, insights and honest answers for business owners."
        actions={
          <>
            <ButtonLink href="/resources/blog" arrow>
              Explore Articles
            </ButtonLink>
            <ButtonLink href="/resources/guides" variant="secondary">
              Browse Guides
            </ButtonLink>
          </>
        }
      />
      <Section>
        <SectionHeader eyebrow="Four resource areas" title="Find the right depth for your question." />
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {areas.map((a, i) => (
            <li key={a.path} className="bg-paper">
              <Link href={a.path} className="spotlight group flex h-full flex-col gap-8 p-8 hover:bg-surface sm:p-10">
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <span>
                  <span className="display-3 block group-hover:text-accent">{a.label}</span>
                  <span className="mt-3 block text-ink-2">{a.text}</span>
                </span>
                <ArrowUpRight aria-hidden className="size-5 text-muted group-hover:text-accent" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="alt">
        <p className="eyebrow">{latest.length ? "Latest" : "Coming soon"}</p>
        {latest.length ? (
          <ul className="mt-6 grid gap-8 md:grid-cols-3">
            {latest.map((a) => (
              <li key={a.id}>
                <ArticleCard a={a} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-6 grid gap-x-10 md:grid-cols-2">
            {[...plannedArticles.blog, ...plannedArticles.guide].map((t) => (
              <li key={t} className="flex items-baseline justify-between gap-4 border-t border-line py-4 text-lg">
                {t}
                <Badge>Soon</Badge>
              </li>
            ))}
          </ul>
        )}
      </Section>
      <CtaBand title="Prefer to talk it through?" text="Share your goals and we’ll suggest a practical next step." primary={{ label: "Let’s Talk", href: "/contact" }} />
    </>
  );
}
