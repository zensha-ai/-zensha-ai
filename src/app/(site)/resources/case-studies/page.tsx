import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { ArticleIndex, kindMeta } from "@/components/resources";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;
export const metadata: Metadata = pageMetadata({
  title: `${kindMeta.case_study.label} | ${brand.brandName}`,
  description: kindMeta.case_study.text,
  path: kindMeta.case_study.path,
});

export default function Page() {
  return <ArticleIndex kind="case_study" />;
}
