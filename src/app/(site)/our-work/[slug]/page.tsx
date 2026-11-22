import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brand } from "@/config/brand";
import { getWorkItem } from "@/lib/data/catalog";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs, ButtonLink, CtaBand, DraftNotice, PageHero, Section, Tag } from "@/components/ui";
import { getBuiltInWork } from "@/content/work";
import { TrafficVisual } from "@/components/work-visual";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/our-work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = await getWorkItem(slug);
  if (!w) return {};
  return pageMetadata({ title: `${w.title} | ${brand.brandName}`, description: w.summary, path: `/our-work/${w.slug}` });
}

export default async function WorkDetailPage({ params }: PageProps<"/our-work/[slug]">) {
  const { slug } = await params;
  const w = await getWorkItem(slug);
  if (!w || (w.kind === "founder" && !brand.publish.founderPortfolio)) notFound();
  const builtIn = getBuiltInWork(w.slug);

  const blocks = [
    { label: "The challenge", text: w.challenge },
    { label: "Our approach", text: w.approach },
    { label: "The solution", text: w.solution },
  ].filter((b) => b.text);

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Our Work", href: "/our-work" }, { label: w.title }]} />
      <PageHero
        eyebrow={[w.client, w.industry, w.project_type, w.year].filter(Boolean).join(" · ")}
        title={w.title}
        text={w.summary}
        actions={
          <>
            {w.demo_url && (
              <ButtonLink href={w.demo_url} target="_blank" rel="noopener noreferrer" arrow>
                Visit live app
              </ButtonLink>
            )}
            <ButtonLink href="/contact?service=web-application-development" variant="secondary">
              Build something similar
            </ButtonLink>
          </>
        }
      />
      {w.kind === "founder" && (
        <div className="container-z mt-8">
          <DraftNotice>
            Founder&rsquo;s personal technical work — not a {brand.brandName} client engagement and not an endorsement by any employer.
          </DraftNotice>
        </div>
      )}
      {(builtIn || w.slug === "trafenix-ai") && (
        <Section>
          <div className="grid gap-6 lg:grid-cols-5">
            {w.slug === "trafenix-ai" && (
              <figure className="overflow-hidden rounded-3xl border border-line bg-surface p-4 lg:col-span-3">
                <TrafficVisual className="block w-full" />
                <figcaption className="px-2 pt-3 font-mono text-xs text-muted">Illustration of the survey types the platform handles</figcaption>
              </figure>
            )}
            {builtIn?.screenshot && (
              <figure className="flex flex-col overflow-hidden rounded-3xl border border-line bg-surface p-4 lg:col-span-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={builtIn.screenshot} alt={builtIn.screenshotAlt ?? w.title} className="w-full flex-1 rounded-2xl border border-line object-cover" loading="lazy" />
                <figcaption className="px-2 pt-3 font-mono text-xs text-muted">{builtIn.screenshotAlt}</figcaption>
              </figure>
            )}
          </div>
          {builtIn?.highlights && (
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Survey modules">
              {builtIn.highlights.map((h) => (
                <li key={h} className="rounded-full border border-line-strong px-3 py-1 font-mono text-xs text-ink-2">
                  {h}
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      <Section>
        <div className="grid gap-12 lg:grid-cols-3">
          {blocks.map((b) => (
            <div key={b.label} className="border-t border-ink pt-5">
              <h2 className="eyebrow">{b.label}</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-2">{b.text}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section tone="alt">
        <div className="grid gap-12 lg:grid-cols-2">
          {w.features.length > 0 && (
            <div>
              <h2 className="eyebrow">Key features</h2>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {w.features.map((f) => (
                  <li key={f} className="py-3">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h2 className="eyebrow">Technology</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {w.technologies.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
            {w.outcome && (
              <>
                <h2 className="eyebrow mt-12">Outcome</h2>
                <p className="display-3 mt-4">{w.outcome}</p>
              </>
            )}
          </div>
        </div>
      </Section>
      <CtaBand title="Have a similar challenge?" text="Let’s discuss your project." primary={{ label: "Start a Project", href: "/contact" }} secondary={{ label: "All work", href: "/our-work" }} />
    </>
  );
}
