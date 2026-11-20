import type { Metadata } from "next";
import { ArticleView, articleMetadata } from "@/components/resources";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/resources/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return articleMetadata("case_study", slug);
}

export default async function Page({ params }: PageProps<"/resources/case-studies/[slug]">) {
  const { slug } = await params;
  return <ArticleView kind="case_study" slug={slug} />;
}
