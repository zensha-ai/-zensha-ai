import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";
import { legalDocs } from "@/content/legal";
import { getArticles, getProducts, getServices, getStudentProjects, getWorkItems } from "@/lib/data/catalog";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const u = (p: string) => `${brand.siteUrl}${p}`;
  const [services, products, projects, articles, work] = await Promise.all([
    getServices(),
    getProducts(),
    getStudentProjects(),
    getArticles(),
    getWorkItems(),
  ]);
  const articlePath = { blog: "blog", guide: "guides", case_study: "case-studies" } as const;
  const staticPaths = [
    "/",
    "/services",
    "/pricing",
    "/products",
    "/student-projects",
    "/resources",
    "/resources/blog",
    "/resources/guides",
    "/resources/case-studies",
    "/resources/faqs",
    "/our-work",
    "/about",
    "/contact",
    "/support",
  ];
  return [
    ...staticPaths.map((p) => ({ url: u(p), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.8 })),
    ...services.map((s) => ({ url: u(`/services/${s.slug}`), priority: 0.8 })),
    ...products.filter((p) => !p.is_example).map((p) => ({ url: u(`/products/${p.slug}`), lastModified: p.updated_at })),
    ...projects.filter((p) => !p.is_example).map((p) => ({ url: u(`/student-projects/${p.slug}`), lastModified: p.updated_at })),
    ...articles.map((a) => ({ url: u(`/resources/${articlePath[a.kind]}/${a.slug}`), lastModified: a.published_at ?? undefined })),
    ...work.filter((w) => w.kind === "company" || brand.publish.founderPortfolio).map((w) => ({ url: u(`/our-work/${w.slug}`) })),
    ...legalDocs.map((d) => ({ url: u(`/legal/${d.slug}`), priority: 0.2 })),
  ];
}
