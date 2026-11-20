import type { Metadata } from "next";
import { ArticleView, articleMetadata } from "@/components/resources";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/resources/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return articleMetadata("blog", slug);
}

export default async function Page({ params }: PageProps<"/resources/blog/[slug]">) {
  const { slug } = await params;
  return <ArticleView kind="blog" slug={slug} />;
}
