import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { about, founder, pageSeo } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink, CtaBand, PageHero, Section, SectionHeader } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/motion";
import { AboutOrbitVisual } from "@/components/hero-visuals";

export const metadata: Metadata = pageMetadata({ ...pageSeo.about, path: "/about" });

export default function AboutPage() {
  return (
    <>
      <PageHero
        visual={<AboutOrbitVisual />}
        eyebrow={about.eyebrow}
        title={about.headline}
        text={about.intro}
        actions={
          <>
            <ButtonLink href="/contact" arrow>
              Work With Us
            </ButtonLink>
            <ButtonLink href="/services" variant="secondary">
              Explore Services
            </ButtonLink>
          </>
        }
      />

      <Section>
        <SectionHeader index="01" eyebrow="Our story" title={about.story} />
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          <div className="bg-paper p-8 sm:p-12">
            <p className="eyebrow">Our mission</p>
            <p className="display-3 mt-6">{about.mission}</p>
          </div>
          <div className="bg-surface p-8 sm:p-12">
            <p className="eyebrow">Our vision</p>
            <p className="display-3 mt-6">{about.vision}</p>
          </div>
        </div>
      </Section>

      <Section tone="alt">
        <SectionHeader index="02" eyebrow="What guides our work" title="Five principles, applied to every project." />
        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {about.values.map((v, i) => (
            <Reveal as="li" key={v.title} delay={i * 0.05} className="border-t border-ink pt-5">
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-xl font-medium">{v.title}</h3>
              <p className="mt-2 text-ink-2">{v.text}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section tone="ink" id="founder">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">03 · Meet the founder</p>
            <h2 className="display-2 mt-6">{founder.name}</h2>
            <p className="mt-3 text-lg text-ink-2">{founder.title}</p>
            <dl className="mt-10 space-y-5 text-sm">
              <div>
                <dt className="eyebrow">Based in</dt>
                <dd className="mt-1 text-ink-2">{founder.location}</dd>
              </div>
              <div>
                <dt className="eyebrow">Education</dt>
                <dd className="mt-1 text-ink-2">{founder.education}</dd>
              </div>
              {brand.publish.founderEmployment && (
                <div>
                  <dt className="eyebrow">Professional background</dt>
                  <dd className="mt-2">
                    <ul className="space-y-2 text-ink-2">
                      {founder.employment.map((e) => (
                        <li key={e.org}>
                          {e.role}, {e.org} <span className="text-muted">· {e.period}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-muted">
                      Individual career experience — not {brand.brandName} clients, partners or endorsements.
                    </p>
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <div className="lg:col-span-7">
            {founder.bio.map((p) => (
              <p key={p.slice(0, 20)} className="mb-6 text-lg leading-relaxed text-ink-2">
                {p}
              </p>
            ))}
            <p className="eyebrow mt-10">Core strengths</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {founder.strengths.map((s) => (
                <span key={s} className="rounded-md border border-line-strong px-2 py-1 font-mono text-xs text-ink-2">
                  {s}
                </span>
              ))}
            </div>
            <p className="display-3 mt-12 text-gradient">{founder.motto}</p>
            <a href={brand.founder.portfolioUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block text-sm text-ink-2 underline underline-offset-4 hover:text-ink">
              Personal technical portfolio ↗
            </a>
          </div>
        </div>
      </Section>

      <CtaBand title={about.closing} text="Tell us what you’re building — we’d like to help." primary={{ label: "Get in Touch", href: "/contact" }} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: founder.name,
          jobTitle: founder.title,
          worksFor: { "@type": "Organization", name: brand.brandName },
          homeLocation: founder.location,
          sameAs: [brand.founder.portfolioUrl],
        }}
      />
    </>
  );
}
