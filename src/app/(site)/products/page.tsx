import { Suspense } from "react";
import type { Metadata } from "next";
import { pageSeo } from "@/content/site";
import { getProducts } from "@/lib/data/catalog";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink, CtaBand, EmptyState, PageHero, Section } from "@/components/ui";
import { ProductBrowser } from "@/components/catalog/product-browser";
import { ProductsStackVisual } from "@/components/hero-visuals";

export const revalidate = 300;
export const metadata: Metadata = pageMetadata({ ...pageSeo.products, path: "/products" });

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <>
      <PageHero
        visual={<ProductsStackVisual />}
        eyebrow="Software and AI products"
        title="Tools that just work."
        text="Software and AI tools that make everyday work faster and simpler."
        actions={
          <>
            <ButtonLink href="#catalogue" arrow>
              Browse Products
            </ButtonLink>
            <ButtonLink href="/contact?service=ai-development-intelligent-solutions" variant="secondary">
              Request a Demo
            </ButtonLink>
          </>
        }
      />
      <Section>
        <div id="catalogue">
          {products.length ? (
            <Suspense>
              <ProductBrowser products={products} />
            </Suspense>
          ) : (
            <EmptyState title="Our first products are on the way." text="Each product will launch with a clear demo, features and pricing. Need something now? We can build it for you." />
          )}
        </div>
      </Section>
      <CtaBand title="Looking for something specific?" text="If it doesn’t exist yet, we can build it for you." primary={{ label: "Contact Sales", href: "/contact" }} secondary={{ label: "Explore Services", href: "/services" }} />
    </>
  );
}
