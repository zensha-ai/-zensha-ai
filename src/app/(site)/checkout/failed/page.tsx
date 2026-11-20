import { ButtonLink } from "@/components/ui";

export const metadata = { title: "Payment unsuccessful", robots: { index: false, follow: false } };

export default function CheckoutFailedPage() {
  return (
    <div className="container-z max-w-3xl py-16 sm:py-24">
      <p className="eyebrow">Payment unsuccessful</p>
      <h1 className="display-2 mt-4">Your payment was not completed.</h1>
      <p className="lede mt-6">Please try again or contact support if you believe you were charged.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/cart">Return to cart</ButtonLink>
        <ButtonLink href="/support" variant="secondary">
          Contact Support
        </ButtonLink>
      </div>
    </div>
  );
}
