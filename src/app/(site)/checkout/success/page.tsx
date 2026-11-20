import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatINR } from "@/lib/format";
import { ButtonLink } from "@/components/ui";
import { Notice } from "@/components/commerce/fields";

export const metadata = { title: "Order status", robots: { index: false, follow: false } };

const UUID = /^[0-9a-f-]{36}$/i;

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: orderId } = await searchParams;
  const user = await requireUser("/account/orders");
  const supabase = await createSupabaseServerClient();
  const { data: order } =
    orderId && UUID.test(orderId)
      ? await supabase!.from("orders").select("id, status, amount_paise").eq("id", orderId).eq("user_id", user.id).maybeSingle()
      : { data: null };

  const paid = order?.status === "paid";
  return (
    <div className="container-z max-w-3xl py-16 sm:py-24">
      <p className="eyebrow">Order {order ? `#${order.id.slice(0, 8).toUpperCase()}` : ""}</p>
      {paid ? (
        <>
          <h1 className="display-2 mt-4">Thank you for your order.</h1>
          <p className="lede mt-6">
            Your purchase details are available in your account. Eligible digital downloads can be accessed from My Downloads.
          </p>
          <p className="mt-4 text-muted">Amount paid: {formatINR(order!.amount_paise)}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/account/downloads">Go to My Downloads</ButtonLink>
            <ButtonLink href={`/account/orders/${order!.id}`} variant="secondary">
              View order
            </ButtonLink>
          </div>
        </>
      ) : (
        <>
          <h1 className="display-2 mt-4">We&rsquo;re confirming your payment.</h1>
          <div className="mt-6">
            <Notice tone="info">
              {order
                ? "Your payment is still being processed. This usually takes a moment — check your order history shortly. If you were charged and the order doesn't update, contact support with your order reference."
                : "We couldn't find that order. Check your order history for the latest status."}
            </Notice>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/account/orders">Check order history</ButtonLink>
            <ButtonLink href="/support" variant="secondary">
              Contact Support
            </ButtonLink>
          </div>
        </>
      )}
    </div>
  );
}
