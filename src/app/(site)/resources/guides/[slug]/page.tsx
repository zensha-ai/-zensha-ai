import type { Metadata } from "next";
import { ArticleView, articleMetadata } from "@/components/resources";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/resources/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return articleMetadata("guide", slug);
}

export default async function Page({ params }: PageProps<"/resources/guides/[slug]">) {
  const { slug } = await params;
  return <ArticleView kind="guide" slug={slug} />;
}
