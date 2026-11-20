import type { Metadata } from "next";
import { brand } from "@/config/brand";

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = true,
  noIndex = false,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  noIndex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const url = `${brand.siteUrl}${path}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: brand.brandName, locale: brand.locale, type },
    twitter: { card: "summary_large_image", title, description },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export function organizationJsonLd() {
  const c = brand.contact;
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${brand.siteUrl}/#organization`,
    name: brand.brandName,
    url: brand.siteUrl,
    logo: `${brand.siteUrl}/icon.svg`,
    image: `${brand.siteUrl}/opengraph-image`,
    slogan: brand.tagline,
    description: brand.footerDescription,
    founder: { "@type": "Person", name: brand.founder.name },
    areaServed: { "@type": "Country", name: "India" },
    priceRange: "₹₹",
    knowsAbout: ["Website development", "Web applications", "Mobile apps", "AI solutions", "Business automation", "Data engineering"],
    ...(c.email ? { email: c.email } : {}),
    ...(c.whatsapp ? { telephone: `+${c.whatsapp}` } : {}),
    ...(c.location
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: "Bengaluru",
            addressRegion: "Karnataka",
            postalCode: c.location.match(/\d{6}/)?.[0],
            addressCountry: "IN",
          },
        }
      : {}),
    ...(c.email || c.whatsapp
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            areaServed: "IN",
            availableLanguage: ["English"],
            ...(c.email ? { email: c.email } : {}),
            ...(c.whatsapp ? { telephone: `+${c.whatsapp}` } : {}),
          },
        }
      : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${brand.siteUrl}${it.path}`,
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
