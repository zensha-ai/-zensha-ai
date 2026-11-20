import { pageMetadata } from "@/lib/seo";
import { CartView } from "./cart-view";

export const metadata = pageMetadata({
  title: "Cart",
  description: "Review your selected projects, package types and total before checkout.",
  path: "/cart",
  absoluteTitle: false,
  noIndex: true,
});

export default function CartPage() {
  return (
    <div className="container-z py-12 sm:py-16">
      <p className="eyebrow">Cart</p>
      <h1 className="display-2 mt-4">Your cart</h1>
      <p className="lede mt-4 max-w-2xl">Review your selected projects, package types and total before checkout.</p>
      <div className="mt-12">
        <CartView />
      </div>
    </div>
  );
}
