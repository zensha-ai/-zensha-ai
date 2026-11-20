"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { cart, useCart } from "@/lib/cart";
import { formatINR } from "@/lib/format";
import { Button, ButtonLink, EmptyState } from "@/components/ui";
import { Notice } from "@/components/commerce/fields";
import { quoteCart, type CartQuote } from "./actions";

export function CartView() {
  const lines = useCart();
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [pending, start] = useTransition();
  const key = lines.map((l) => `${l.projectId}:${l.package}`).join("|");

  useEffect(() => {
    if (!lines.length) return;
    start(async () => setQuote(await quoteCart(lines.map(({ projectId, package: pkg }) => ({ projectId, package: pkg })))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!lines.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        text="Browse practical software, hardware, IoT and AI projects and add the packages you need."
        action={<ButtonLink href="/student-projects">Browse Projects</ButtonLink>}
      />
    );
  }

  const priced = (projectId: string, pkg: string) => quote?.lines.find((l) => l.projectId === projectId && l.package === pkg);

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-8">
        {quote?.error && <Notice tone="error">{quote.error}</Notice>}
        <ul className="divide-y divide-line border-y border-line" aria-busy={pending}>
          {lines.map((l) => {
            const p = priced(l.projectId, l.package);
            return (
              <li key={`${l.projectId}:${l.package}`} className="flex flex-col gap-3 py-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Link href={`/student-projects/${l.slug}`} className="text-lg font-medium hover:underline">
                    {p?.title ?? l.title}
                  </Link>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-muted">
                    {l.package === "kit" ? "Physical kit" : "Digital download"}
                  </p>
                  {p?.error && <p className="mt-2 text-sm text-danger">{p.error}</p>}
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-medium">{p?.unitPricePaise != null ? formatINR(p.unitPricePaise) : pending ? "…" : "—"}</span>
                  <button
                    type="button"
                    onClick={() => cart.remove(l.projectId, l.package)}
                    className="text-sm text-ink-2 underline underline-offset-4 hover:text-ink"
                    aria-label={`Remove ${l.title}`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <button type="button" onClick={() => cart.clear()} className="mt-4 text-sm text-muted underline underline-offset-4 hover:text-ink">
          Clear cart
        </button>
      </div>
      <aside className="lg:col-span-4">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="eyebrow">Summary</h2>
          <div className="mt-4 flex items-baseline justify-between">
            <span>Total</span>
            <span className="display-3">{quote?.valid ? formatINR(quote.totalPaise) : "—"}</span>
          </div>
          <p className="mt-2 text-xs text-muted">Prices are confirmed on our server at checkout. Taxes, if applicable, are shown before payment.</p>
          <div className="mt-6">
            {quote && !quote.paymentsEnabled ? (
              <Notice tone="info">
                Online payments are not enabled yet. <Link href="/contact" className="underline">Contact us</Link> to purchase.
              </Notice>
            ) : (
              <ButtonLink
                href="/checkout"
                className={!quote?.valid ? "pointer-events-none w-full opacity-50" : "w-full"}
                aria-disabled={!quote?.valid}
              >
                Continue to checkout
              </ButtonLink>
            )}
          </div>
          {quote && !quote.valid && !quote.error && (
            <p className="mt-3 text-sm text-danger">Remove unavailable items to continue.</p>
          )}
          <Button variant="ghost" className="mt-2 w-full" onClick={() => history.back()}>
            Keep browsing
          </Button>
        </div>
      </aside>
    </div>
  );
}
