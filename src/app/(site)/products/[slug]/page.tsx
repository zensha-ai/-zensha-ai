import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brand } from "@/config/brand";
import { getProduct } from "@/lib/data/catalog";
import { labels } from "@/lib/format";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { Badge, Breadcrumbs, ButtonLink, CtaBand, DraftNotice, FaqList, PageHero, Section, Tag } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  return pageMetadata({
    title: p.seo_title || `${p.name} | ${brand.brandName}`,
    description: p.seo_description || p.tagline,
    path: `/products/${p.slug}`,
    noIndex: p.is_example,
  });
}

const defaultSteps = ["Start or connect", "Add your information", "Run the workflow", "Review results", "Export, share or continue"];

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();
  const steps = p.how_it_works.length ? p.how_it_works : defaultSteps;
  const contactHref = `/contact?service=ai-development-intelligent-solutions`;

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: p.name }]} />
      <PageHero
        eyebrow={labels.productCategory[p.category]}
        title={p.name}
        text={p.tagline}
        actions={
          <>
            {p.demo_url && p.status !== "coming_soon" ? (
              <ButtonLink href={p.demo_url} target="_blank" rel="noopener noreferrer" arrow>
                Try Demo
              </ButtonLink>
            ) : (
              <ButtonLink href={contactHref} arrow>
                {p.status === "coming_soon" ? "Get notified" : "Request a Demo"}
              </ButtonLink>
            )}
            <ButtonLink href="#pricing" variant="secondary">
              View Pricing
            </ButtonLink>
          </>
        }
        aside={
          <div className="flex flex-wrap gap-2">
            <Badge tone={p.status === "available" ? "success" : "neutral"}>{labels.status[p.status]}</Badge>
            {p.is_example && <Badge tone="warn">Example content</Badge>}
          </div>
        }
      />
      {p.is_example && (
        <div className="container-z mt-8">
          <DraftNotice>This is clearly labelled example content that demonstrates the page layout. It is not a real, available product.</DraftNotice>
        </div>
      )}

      {(p.story || p.problem || p.solution) && (
        <Section>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {[
              ["Product story", p.story],
              ["The problem", p.problem],
              ["The solution", p.solution],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="bg-paper p-8 sm:p-10">
                  <h2 className="eyebrow">{k}</h2>
                  <p className="mt-5 text-lg leading-relaxed">{v}</p>
                </div>
              ))}
          </div>
        </Section>
      )}

      {(p.demo_video_url || p.hero_image_url) && (
        <Section tone="alt">
          <h2 className="eyebrow">Demo</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
            {p.demo_video_url ? (
              <video src={p.demo_video_url} controls preload="metadata" className="aspect-video w-full" poster={p.hero_image_url ?? undefined}>
                Your browser does not support embedded video.
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.hero_image_url!} alt={`${p.name} interface`} className="w-full" loading="lazy" />
            )}
          </div>
        </Section>
      )}

      {p.features.length > 0 && (
        <Section>
          <h2 className="display-2">Key features</h2>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {p.features.map((f) => (
              <li key={f.title} className="bg-paper p-8">
                <h3 className="text-lg font-medium">{f.title}</h3>
                <p className="mt-2 text-ink-2">{f.description}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section tone="alt">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="eyebrow">How it works</h2>
            <ol className="mt-6 divide-y divide-line border-y border-line">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-5 py-4">
                  <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-10">
            {p.use_cases.length > 0 && (
              <div>
                <h2 className="eyebrow">Who it is for</h2>
                <ul className="mt-5 space-y-2">
                  {p.use_cases.map((u) => (
                    <li key={u}>— {u}</li>
                  ))}
                </ul>
              </div>
            )}
            {p.integrations.length > 0 && (
              <div>
                <h2 className="eyebrow">Integrations</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.integrations.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {(p.architecture || p.security) && (
        <Section>
          <div className="grid gap-12 lg:grid-cols-2">
            {p.architecture && (
              <div>
                <h2 className="eyebrow">Architecture overview</h2>
                <p className="mt-5 text-lg leading-relaxed text-ink-2">{p.architecture}</p>
              </div>
            )}
            {p.security && (
              <div>
                <h2 className="eyebrow">Technology and trust</h2>
                <p className="mt-5 text-lg leading-relaxed text-ink-2">{p.security}</p>
              </div>
            )}
          </div>
        </Section>
      )}

      <Section tone="alt" id="pricing">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="display-2">Plans and access</h2>
          </div>
          <div className="lg:col-span-7">
            {p.pricing ? (
              <p className="whitespace-pre-line text-lg leading-relaxed">{p.pricing}</p>
            ) : (
              <p className="text-lg text-ink-2">Pricing has not been published yet. Request pricing and we will share current plans, limits and terms.</p>
            )}
            <div className="mt-8">
              <ButtonLink href={contactHref} variant="secondary">
                Request Pricing
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {p.faqs.length > 0 && (
        <Section>
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 className="display-2 lg:col-span-4">FAQs</h2>
            <div className="lg:col-span-8">
              <FaqList faqs={p.faqs} />
            </div>
          </div>
          <JsonLd data={faqJsonLd(p.faqs)} />
        </Section>
      )}

      <CtaBand
        title={p.status === "available" ? "See it in action." : "Interested in this product?"}
        text="Tell us about your workflow and we will show you whether this product is the right fit."
        primary={{ label: p.status === "available" ? "Get Started" : "Contact Sales", href: contactHref }}
        secondary={{ label: "All products", href: "/products" }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Products", path: "/products" }, { name: p.name, path: `/products/${p.slug}` }])} />
      {!p.is_example && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: p.name,
            description: p.tagline,
            applicationCategory: "BusinessApplication",
            publisher: { "@type": "Organization", name: brand.brandName },
          }}
        />
      )}
    </>
  );
}
