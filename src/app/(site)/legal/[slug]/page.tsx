import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brand } from "@/config/brand";
import { getLegalDoc, legalDocs } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs, DraftNotice } from "@/components/ui";
import { Markdown } from "@/components/markdown";

export const dynamicParams = false;

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getLegalDoc(slug);
  if (!d) return {};
  return pageMetadata({ title: `${d.title} (Draft) | ${brand.brandName}`, description: d.summary, path: `/legal/${d.slug}` });
}

export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const d = getLegalDoc(slug);
  if (!d) notFound();
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Legal" }, { label: d.title }]} />
      <div className="container-z grid gap-12 py-14 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav aria-label="Legal documents">
            <ul className="space-y-2 text-sm">
              {legalDocs.map((x) => (
                <li key={x.slug}>
                  <Link href={`/legal/${x.slug}`} aria-current={x.slug === d.slug ? "page" : undefined} className="text-ink-2 hover:text-ink aria-[current=page]:font-medium aria-[current=page]:text-ink">
                    {x.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <article className="lg:col-span-9">
          <h1 className="display-2">{d.title}</h1>
          <p className="lede mt-4">{d.summary}</p>
          <div className="mt-8">
            <DraftNotice>
              <strong>Draft — pending legal review.</strong> This page has not yet been reviewed against {brand.brandName}&rsquo;s actual business
              operations, payment terms and applicable law. Bracketed items are placeholders. It is not final and should not be relied on as such.
            </DraftNotice>
          </div>
          <div className="mt-10">
            <Markdown source={d.body} />
          </div>
        </article>
      </div>
    </>
  );
}
