"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { cart, useCart } from "@/lib/cart";
import { formatINR } from "@/lib/format";
import { Button, ButtonLink, EmptyState } from "@/components/ui";
import { Notice, TextField } from "@/components/commerce/fields";
import { useRazorpay, type CheckoutSession } from "@/components/commerce/razorpay-checkout";
import { quoteCart, type CartQuote } from "../cart/actions";

export function CheckoutForm({ paymentsEnabled, defaults }: { paymentsEnabled: boolean; defaults: { name: string; email: string; phone: string } }) {
  const router = useRouter();
  const lines = useCart();
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loadingQuote, start] = useTransition();
  const { script, ready, pay } = useRazorpay(paymentsEnabled);
  const key = lines.map((l) => `${l.projectId}:${l.package}`).join("|");
  const needsShipping = lines.some((l) => l.package === "kit");

  useEffect(() => {
    if (!lines.length) return;
    start(async () => setQuote(await quoteCart(lines.map(({ projectId, package: pkg }) => ({ projectId, package: pkg })))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!lines.length) {
    return <EmptyState title="Nothing to check out" text="Your cart is empty." action={<ButtonLink href="/student-projects">Browse Projects</ButtonLink>} />;
  }

  if (!paymentsEnabled) {
    return (
      <Notice tone="info">
        Online payments are not enabled yet, so orders can&rsquo;t be completed on the website. Please{" "}
        <Link href="/contact" className="underline">contact us</Link> about the projects in your cart.
      </Notice>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim();
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map(({ projectId, package: pkg }) => ({ projectId, package: pkg })),
          billing: { name: s("name"), email: s("email"), phone: s("phone") },
          shipping: needsShipping
            ? { line1: s("line1"), line2: s("line2"), city: s("city"), state: s("state"), postal_code: s("postal_code"), country: "IN" }
            : undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as Partial<CheckoutSession> & { error?: string };
      if (!res.ok || !data.orderId) {
        setError(data.error ?? "We couldn't start checkout. Please try again.");
        setBusy(false);
        return;
      }
      pay(data as CheckoutSession, {
        onVerified: () => {
          cart.clear();
          router.push(`/checkout/success?order=${data.orderId}`);
        },
        onFailed: (msg) => {
          setBusy(false);
          setError(msg);
        },
        onDismiss: () => setBusy(false),
      });
    } catch {
      setError("We couldn't start checkout. Please check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      {script}
      <form onSubmit={onSubmit} className="grid gap-8 lg:col-span-7" noValidate={false}>
        {error && <Notice tone="error">{error}</Notice>}
        <fieldset className="grid gap-5">
          <legend className="eyebrow mb-4">Billing details</legend>
          <TextField label="Full name" name="name" required autoComplete="name" defaultValue={defaults.name} />
          <TextField label="Email" name="email" type="email" required autoComplete="email" defaultValue={defaults.email} />
          <TextField label="Phone (optional)" name="phone" type="tel" autoComplete="tel" defaultValue={defaults.phone} />
        </fieldset>
        {needsShipping && (
          <fieldset className="grid gap-5">
            <legend className="eyebrow mb-4">Shipping address (physical kits, India only)</legend>
            <TextField label="Address line 1" name="line1" required autoComplete="address-line1" />
            <TextField label="Address line 2" name="line2" autoComplete="address-line2" />
            <div className="grid gap-5 sm:grid-cols-3">
              <TextField label="City" name="city" required autoComplete="address-level2" />
              <TextField label="State" name="state" required autoComplete="address-level1" />
              <TextField label="PIN code" name="postal_code" required autoComplete="postal-code" />
            </div>
            <p className="text-sm text-muted">Shipping terms for each kit are stated on its project page.</p>
          </fieldset>
        )}
        <div>
          <Button type="submit" disabled={busy || !ready || !quote?.valid} aria-busy={busy}>
            {busy ? "Processing…" : !ready ? "Loading secure payment…" : `Pay ${quote?.valid ? formatINR(quote.totalPaise) : ""}`}
          </Button>
          <p className="mt-3 text-xs text-muted">
            Payment is processed by Razorpay. By paying you agree to the{" "}
            <Link href="/legal/terms" className="underline">Terms</Link>,{" "}
            <Link href="/legal/refunds" className="underline">Refund Policy</Link> and{" "}
            <Link href="/legal/licensing" className="underline">Project License</Link>.
          </p>
        </div>
      </form>
      <aside className="lg:col-span-5">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="eyebrow">What&rsquo;s included</h2>
          {quote?.error && <div className="mt-4"><Notice tone="error">{quote.error}</Notice></div>}
          <ul className="mt-4 divide-y divide-line" aria-busy={loadingQuote}>
            {(quote?.lines ?? []).map((l) => (
              <li key={`${l.projectId}:${l.package}`} className="flex justify-between gap-4 py-3 text-sm">
                <span>
                  {l.title}
                  {l.error && <span className="mt-1 block text-danger">{l.error}</span>}
                </span>
                <span className="shrink-0">{l.unitPricePaise != null ? formatINR(l.unitPricePaise) : "—"}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-line-strong pt-4">
            <span className="font-medium">Total</span>
            <span className="display-3">{quote?.valid ? formatINR(quote.totalPaise) : "—"}</span>
          </div>
          {quote && !quote.valid && (
            <p className="mt-3 text-sm text-danger">
              Some items can&rsquo;t be purchased. <Link href="/cart" className="underline">Review your cart</Link>.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
