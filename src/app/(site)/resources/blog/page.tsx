import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { ArticleIndex, kindMeta } from "@/components/resources";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;
export const metadata: Metadata = pageMetadata({
  title: `${kindMeta.blog.label} | ${brand.brandName}`,
  description: kindMeta.blog.text,
  path: kindMeta.blog.path,
});

export default function Page() {
  return <ArticleIndex kind="blog" />;
}
