import { requireUser } from "@/lib/auth";
import { isPaymentsConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";
import { CheckoutForm } from "./checkout-form";

export const metadata = pageMetadata({
  title: "Checkout",
  description: "Complete your order.",
  path: "/checkout",
  absoluteTitle: false,
  noIndex: true,
});

export default async function CheckoutPage() {
  const user = await requireUser("/checkout");
  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase!.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle();
  return (
    <div className="container-z py-12 sm:py-16">
      <p className="eyebrow">Checkout</p>
      <h1 className="display-2 mt-4">Checkout</h1>
      <p className="lede mt-4 max-w-2xl">
        Enter the required billing details, review what is included and complete payment through the available payment provider.
      </p>
      <div className="mt-12">
        <CheckoutForm
          paymentsEnabled={isPaymentsConfigured()}
          defaults={{ name: profile?.full_name ?? user.fullName, email: user.email, phone: profile?.phone ?? "" }}
        />
      </div>
    </div>
  );
}
