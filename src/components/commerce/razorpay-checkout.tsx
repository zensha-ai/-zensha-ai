"use client";

import Script from "next/script";
import { useCallback, useState } from "react";
import { brand } from "@/config/brand";

type RazorpaySuccess = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void; on: (event: string, cb: (resp: unknown) => void) => void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

export type CheckoutSession = {
  orderId: string;
  razorpayOrderId: string;
  keyId: string;
  amount: number;
  currency: string;
  prefill: { name?: string; email?: string; contact?: string };
};

/**
 * Loads Razorpay Checkout only when payments are enabled and exposes `pay()`.
 * Success is NEVER assumed client-side: the result is verified on the server.
 */
export function useRazorpay(enabled: boolean) {
  const [ready, setReady] = useState(false);
  const script = enabled ? (
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => setReady(true)} />
  ) : null;

  const pay = useCallback(
    (session: CheckoutSession, handlers: { onVerified: () => void; onFailed: (msg: string) => void; onDismiss: () => void }) => {
      if (!window.Razorpay) {
        handlers.onFailed("The payment window couldn't load. Check your connection and try again.");
        return;
      }
      const rz = new window.Razorpay({
        key: session.keyId,
        amount: session.amount,
        currency: session.currency,
        order_id: session.razorpayOrderId,
        name: brand.brandName,
        description: "Student project order",
        prefill: session.prefill,
        theme: { color: "#141413" },
        modal: { ondismiss: handlers.onDismiss },
        handler: async (resp: RazorpaySuccess) => {
          try {
            const res = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: session.orderId, ...resp }),
            });
            if (res.ok) handlers.onVerified();
            else handlers.onFailed("We couldn't verify your payment yet. If you were charged, it will appear in your order history shortly.");
          } catch {
            handlers.onFailed("We couldn't verify your payment yet. If you were charged, it will appear in your order history shortly.");
          }
        },
      });
      rz.on("payment.failed", () => handlers.onFailed("Your payment was not completed."));
      rz.open();
    },
    [],
  );

  return { script, ready, pay };
}
