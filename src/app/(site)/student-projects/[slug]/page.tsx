import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FileArchive, Package, Truck } from "lucide-react";
import { brand } from "@/config/brand";
import { responsibleLearningNote } from "@/content/site";
import { getProjectFileLabels, getStudentProject } from "@/lib/data/catalog";
import { formatINR, labels } from "@/lib/format";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { Badge, Breadcrumbs, DraftNotice, FaqList, Section, Tag } from "@/components/ui";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/student-projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getStudentProject(slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.title} — ${p.demonstrates} | ${brand.brandName}`,
    description: p.summary,
    path: `/student-projects/${p.slug}`,
    noIndex: p.is_example,
  });
}

const defaultFaqs = (p: { delivery_type: string }) => [
  { q: "Can beginners use it?", a: "Check the difficulty level and prerequisites listed above. Beginner projects include step-by-step setup notes." },
  {
    q: "Is hardware included?",
    a: p.delivery_type === "digital" ? "No. This is a digital package — components are listed so you can source them yourself." : "Hardware is included only in the physical kit option, as described in the package contents.",
  },
  { q: "What files will I receive?", a: "Exactly the items listed under “What is included”. Nothing else is implied." },
  { q: "What support is available?", a: "Support coverage is stated on this page. For help, use Student Project Support with your order reference." },
];

export default async function StudentProjectPage({ params }: PageProps<"/student-projects/[slug]">) {
  const { slug } = await params;
  const p = await getStudentProject(slug);
  if (!p) notFound();
  const files = await getProjectFileLabels(p.id);
  const faqs = p.faqs.length ? p.faqs : defaultFaqs(p);
  const hasKit = p.delivery_type !== "digital" && p.kit_price_paise != null;

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Student Projects", href: "/student-projects" }, { label: p.title }]} />

      <header className="container-z grid gap-12 border-b border-line pb-16 pt-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="flex flex-wrap gap-2">
            <Badge>{labels.studentCategory[p.category]}</Badge>
            <Badge>{labels.difficulty[p.difficulty]}</Badge>
            <Badge>{labels.delivery[p.delivery_type]}</Badge>
            {p.is_example && <Badge tone="warn">Example listing</Badge>}
          </div>
          <h1 className="display-2 mt-6 text-balance">{p.title}</h1>
          <p className="mt-3 text-xl text-ink-2">{p.demonstrates}</p>
          <p className="lede mt-6">{p.summary}</p>

          <figure className="mt-10 overflow-hidden rounded-2xl border border-line bg-surface">
            {p.demo_video_url ? (
              <video src={p.demo_video_url} controls preload="metadata" className="aspect-video w-full" poster={p.cover_image_url ?? undefined}>
                Your browser does not support embedded video.
              </video>
            ) : p.demo_gif_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.demo_gif_url} alt={p.demo_caption ?? `${p.title} running`} className="w-full" />
            ) : (
              <div className="grid-paper grid aspect-video place-items-center bg-paper-2 text-sm text-muted">Working demonstration coming soon</div>
            )}
            {p.demo_caption && <figcaption className="border-t border-line p-4 text-sm text-muted">{p.demo_caption}</figcaption>}
          </figure>
        </div>

        <aside className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-line bg-surface p-8">
            <p className="eyebrow">Purchase information</p>
            <p className="display-2 mt-4">{p.is_free ? "Free" : formatINR(p.price_paise)}</p>
            {hasKit && <p className="mt-2 text-sm text-muted">Physical kit option: {formatINR(p.kit_price_paise!)}</p>}
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3">
                <FileArchive aria-hidden className="size-4 shrink-0 text-muted" />
                {p.delivery_type === "physical_kit" ? "Physical kit only — no download" : "Digital download from My Downloads after purchase"}
              </li>
              {p.delivery_type !== "digital" && (
                <li className="flex gap-3">
                  <Truck aria-hidden className="size-4 shrink-0 text-muted" />
                  {p.shipping_terms ?? "Shipping terms stated at checkout"}
                </li>
              )}
              <li className="flex gap-3">
                <Package aria-hidden className="size-4 shrink-0 text-muted" />
                License: {p.license ?? "Student Project License"} (
                <Link href="/legal/licensing" className="underline underline-offset-4">
                  terms
                </Link>
                )
              </li>
            </ul>
            <div className="mt-8">
              <AddToCartButton projectId={p.id} slug={p.slug} title={p.title} isFree={p.is_free} isExample={p.is_example} deliveryType={p.delivery_type} hasKit={hasKit} />
            </div>
            <p className="mt-4 text-xs text-muted">
              Support: {p.support ?? "Setup questions via Student Project Support."} Refunds follow the{" "}
              <Link href="/legal/refunds" className="underline underline-offset-4">
                Refund Policy
              </Link>
              .
            </p>
            <Link href={`/support?project=${encodeURIComponent(p.title)}#project-support`} className="mt-4 inline-block text-sm underline underline-offset-4">
              Ask a Question
            </Link>
          </div>
        </aside>
      </header>

      {p.is_example && (
        <div className="container-z mt-8">
          <DraftNotice>This is clearly labelled example content that shows the page layout. It is not for sale.</DraftNotice>
        </div>
      )}

      <Section>
        <div className="grid gap-14 lg:grid-cols-2">
          {p.features.length > 0 && (
            <div>
              <h2 className="eyebrow">Key features</h2>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {p.features.map((f) => (
                  <li key={f.title} className="py-4">
                    <p className="font-medium">{f.title}</p>
                    <p className="mt-1 text-sm text-ink-2">{f.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {p.learning_objectives.length > 0 && (
            <div>
              <h2 className="eyebrow">Learning objectives</h2>
              <ol className="mt-6 space-y-3">
                {p.learning_objectives.map((o, i) => (
                  <li key={o} className="flex gap-4">
                    <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                    {o}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </Section>

      <Section tone="alt">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            {p.how_it_works && (
              <>
                <h2 className="eyebrow">How it works</h2>
                <p className="mt-5 whitespace-pre-line text-lg leading-relaxed">{p.how_it_works}</p>
              </>
            )}
            <h2 className="eyebrow mt-12">Technology stack</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </div>
          <div>
            {p.components.length > 0 && (
              <>
                <h2 className="eyebrow">Hardware requirements</h2>
                <ul className="mt-5 divide-y divide-line border-y border-line text-sm">
                  {p.components.map((c) => (
                    <li key={c} className="py-2.5">
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted">
                  {p.delivery_type === "digital" ? "Components are not included." : "Included only with the physical kit option."}
                </p>
              </>
            )}
            {p.circuit_diagram_url && (
              <figure className="mt-10 overflow-hidden rounded-xl border border-line bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.circuit_diagram_url} alt={`Circuit diagram for ${p.title}`} className="w-full" loading="lazy" />
                <figcaption className="border-t border-line p-3 text-xs text-muted">Circuit diagram</figcaption>
              </figure>
            )}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="eyebrow">What is included</h2>
            {p.package_contents.length ? (
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {p.package_contents.map((c) => (
                  <li key={c} className="py-3">
                    {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-muted">Package contents will be listed before this project is offered.</p>
            )}
            {files.length > 0 && (
              <p className="mt-4 text-sm text-muted">
                {files.length} downloadable file{files.length === 1 ? "" : "s"}
                {files.some((f) => f.is_free_preview) && " (including a free preview)"} — available from My Downloads.
              </p>
            )}
            {p.documentation_notes && <p className="mt-6 text-ink-2">{p.documentation_notes}</p>}
          </div>
          <div>
            <h2 className="eyebrow">Setup and learning path</h2>
            <ol className="mt-6 space-y-3">
              {(p.setup_guide.length ? p.setup_guide : ["Prerequisites", "Download and inspect", "Install or assemble", "Configure", "Run", "Test and modify"]).map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section tone="alt">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="display-2">Frequently asked questions</h2>
          </div>
          <div className="lg:col-span-8">
            <FaqList faqs={faqs} />
            <div className="mt-10">
              <DraftNotice>
                <strong>Responsible learning.</strong> {responsibleLearningNote}
              </DraftNotice>
            </div>
          </div>
        </div>
      </Section>

      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Student Projects", path: "/student-projects" }, { name: p.title, path: `/student-projects/${p.slug}` }])} />
      {!p.is_example && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.title,
            description: p.summary,
            brand: { "@type": "Brand", name: brand.brandName },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: (p.price_paise / 100).toFixed(2),
              availability: "https://schema.org/InStock",
              url: `${brand.siteUrl}/student-projects/${p.slug}`,
            },
          }}
        />
      )}
    </>
  );
}
