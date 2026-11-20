"use server";

import { priceCart, type RequestedLine } from "@/lib/payments/pricing";
import { loadPricingRows, requestedLinesSchema } from "@/lib/payments/load";
import { createSupabasePublicClient } from "@/lib/supabase/server";
import { isPaymentsConfigured } from "@/lib/env";

export type CartQuote = {
  lines: { projectId: string; package: "digital" | "kit"; title: string; unitPricePaise: number | null; error: string | null }[];
  totalPaise: number;
  valid: boolean;
  paymentsEnabled: boolean;
  error?: string;
};

/** Re-prices the cart from the database. Client-supplied prices are never used. */
export async function quoteCart(input: RequestedLine[]): Promise<CartQuote> {
  const paymentsEnabled = isPaymentsConfigured();
  const parsed = requestedLinesSchema.safeParse(input);
  if (!parsed.success) return { lines: [], totalPaise: 0, valid: false, paymentsEnabled, error: "Your cart could not be read." };
  const db = createSupabasePublicClient();
  if (!db) return { lines: [], totalPaise: 0, valid: false, paymentsEnabled, error: "The project catalogue isn't connected yet." };

  let rows;
  try {
    rows = await loadPricingRows(db, parsed.data);
  } catch {
    return { lines: [], totalPaise: 0, valid: false, paymentsEnabled, error: "We couldn't check current prices. Please try again." };
  }
  const lines = parsed.data.map((req) => {
    const single = priceCart([req], rows);
    const title = rows.find((r) => r.id === req.projectId)?.title ?? "Unavailable item";
    return single.ok
      ? { projectId: req.projectId, package: req.package, title: single.lines[0].title, unitPricePaise: single.lines[0].unitPricePaise, error: null }
      : { projectId: req.projectId, package: req.package, title, unitPricePaise: null, error: single.error };
  });
  const all = priceCart(parsed.data, rows);
  return { lines, totalPaise: all.ok ? all.totalPaise : 0, valid: all.ok, paymentsEnabled };
}
