import Link from "next/link";
import { notFound } from "next/navigation";
import { brand } from "@/config/brand";
import type { Article, ArticleKind } from "@/content/types";
import { getArticle, getArticles } from "@/lib/data/catalog";
import { formatDate } from "@/lib/format";
import { breadcrumbJsonLd } from "@/lib/seo";
import { Badge, Breadcrumbs, CtaBand, EmptyState, PageHero, Section } from "@/components/ui";
import { Markdown } from "@/components/markdown";
import { JsonLd } from "@/components/json-ld";

export const kindMeta: Record<ArticleKind, { label: string; path: string; eyebrow: string; title: string; text: string; cta: string }> = {
  blog: {
    label: "Blog & Insights",
    path: "/resources/blog",
    eyebrow: "Blog & Insights",
    title: "Ideas worth understanding.",
    text: "Practical articles on websites, software, AI and automation — decisions, not buzzwords.",
    cta: "Read the Latest Articles",
  },
  guide: {
    label: "Business & Technology Guides",
    path: "/resources/guides",
    eyebrow: "Business & Technology Guides",
    title: "Plan with confidence.",
    text: "Step-by-step guides for planning your next technology project.",
    cta: "Explore Business Guides",
  },
  case_study: {
    label: "Case Studies",
    path: "/resources/case-studies",
    eyebrow: "Case Studies",
    title: "The story behind the solution.",
    text: "Real projects: the challenge, the work and verified results.",
    cta: "View Case Studies",
  },
};

export function ArticleCard({ a }: { a: Article }) {
  return (
    <Link href={`${kindMeta[a.kind].path}/${a.slug}`} className="group flex h-full flex-col border-t border-ink pt-5">
      <span className="eyebrow">
        {a.category} · {a.read_minutes} min read
      </span>
      <span className="mt-4 text-xl font-medium group-hover:text-accent">{a.title}</span>
      <span className="mt-3 flex-1 text-sm leading-relaxed text-muted">{a.excerpt}</span>
      {a.published_at && <span className="mt-5 font-mono text-xs text-muted">{formatDate(a.published_at)}</span>}
    </Link>
  );
}

export async function ArticleIndex({ kind }: { kind: ArticleKind }) {
  const meta = kindMeta[kind];
  const articles = await getArticles(kind);
  const categories = [...new Set(articles.map((a) => a.category))];
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: meta.label }]} />
      <PageHero eyebrow={meta.eyebrow} title={meta.title} text={meta.text} />
      <Section>
        {categories.length > 1 && (
          <p className="mb-10 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Badge key={c}>{c}</Badge>
            ))}
          </p>
        )}
        {articles.length ? (
          <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <li key={a.id}>
                <ArticleCard a={a} />
              </li>
            ))}
          </ul>
        ) : kind === "case_study" ? (
          <EmptyState
            title="Case studies are published only when they are real."
            text={`We will share ${brand.brandName} case studies once projects are delivered, outcomes are verified and clients have approved publication.`}
          />
        ) : (
          <EmptyState
            title="First articles coming soon."
            text="See what we're writing on the Resources page."
            action={
              <Link href="/resources" className="text-sm underline underline-offset-4">
                View upcoming topics
              </Link>
            }
          />
        )}
      </Section>
      <CtaBand title="Have a question we haven’t answered?" text="Tell us about your project and we will help you think through the next step." primary={{ label: "Let’s Talk", href: "/contact" }} secondary={{ label: "Read the FAQs", href: "/resources/faqs" }} />
    </>
  );
}

export async function ArticleView({ kind, slug }: { kind: ArticleKind; slug: string }) {
  const meta = kindMeta[kind];
  const a = await getArticle(kind, slug);
  if (!a) notFound();
  const related = (await getArticles()).filter((x) => x.id !== a.id && (x.category === a.category || x.kind === a.kind)).slice(0, 3);
  const url = `${brand.siteUrl}${meta.path}/${a.slug}`;
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: meta.label, href: meta.path }, { label: a.title }]} />
      <article>
        <header className="container-z pb-10 pt-14 sm:pt-20">
          <p className="eyebrow">
            {a.category} · {formatDate(a.published_at)} · {a.read_minutes} min read
          </p>
          <h1 className="display-2 mt-6 max-w-4xl text-balance">{a.title}</h1>
          {a.excerpt && <p className="lede mt-6 max-w-2xl">{a.excerpt}</p>}
        </header>
        <div className="container-z border-t border-line pb-20 pt-12">
          <Markdown source={a.body} />
        </div>
      </article>
      {related.length > 0 && (
        <Section tone="alt">
          <h2 className="eyebrow">Related reading</h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.id}>
                <ArticleCard a={r} />
              </li>
            ))}
          </ul>
        </Section>
      )}
      <CtaBand title="Ready to discuss your project?" text="Tell us what you want to improve or build. We will help you define a practical starting point." primary={{ label: "Talk to Our Team", href: "/contact" }} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.excerpt,
          datePublished: a.published_at,
          author: { "@type": "Organization", name: brand.brandName },
          publisher: { "@type": "Organization", name: brand.brandName },
          mainEntityOfPage: url,
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Resources", path: "/resources" },
          { name: meta.label, path: meta.path },
          { name: a.title, path: `${meta.path}/${a.slug}` },
        ])}
      />
    </>
  );
}

export async function articleMetadata(kind: ArticleKind, slug: string) {
  const a = await getArticle(kind, slug);
  if (!a) return {};
  const { pageMetadata } = await import("@/lib/seo");
  return pageMetadata({
    title: a.seo_title || `${a.title} | ${brand.brandName}`,
    description: a.seo_description || a.excerpt,
    path: `${kindMeta[kind].path}/${a.slug}`,
    type: "article",
  });
}
