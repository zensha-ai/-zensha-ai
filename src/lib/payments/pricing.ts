/**
 * Pure pricing logic. Prices ALWAYS come from database rows, never the client.
 */
export type PricingProjectRow = {
  id: string;
  title: string;
  published: boolean;
  is_free: boolean;
  is_example: boolean;
  delivery_type: "digital" | "physical_kit" | "digital_and_kit";
  price_paise: number;
  kit_price_paise: number | null;
};

export type RequestedLine = { projectId: string; package: "digital" | "kit" };

export type PricedLine = {
  projectId: string;
  package: "digital" | "kit";
  title: string;
  unitPricePaise: number;
  quantity: 1;
};

export type PricingResult =
  | { ok: true; lines: PricedLine[]; totalPaise: number; requiresShipping: boolean }
  | { ok: false; error: string };

export const MAX_LINES = 20;

export function priceCart(requested: RequestedLine[], rows: PricingProjectRow[]): PricingResult {
  if (!requested.length) return { ok: false, error: "Your cart is empty." };
  if (requested.length > MAX_LINES) return { ok: false, error: "Too many items in one order." };

  const byId = new Map(rows.map((r) => [r.id, r]));
  const seen = new Set<string>();
  const lines: PricedLine[] = [];

  for (const req of requested) {
    const key = `${req.projectId}:${req.package}`;
    if (seen.has(key)) continue; // de-duplicate silently
    seen.add(key);

    const row = byId.get(req.projectId);
    if (!row || !row.published) return { ok: false, error: "One of the items is no longer available." };
    if (row.is_example) return { ok: false, error: `"${row.title}" is an example listing and is not for sale.` };
    if (row.is_free) return { ok: false, error: `"${row.title}" is free — claim it from its project page instead.` };

    if (req.package === "digital") {
      if (row.delivery_type === "physical_kit") return { ok: false, error: `"${row.title}" is only available as a physical kit.` };
      if (!Number.isInteger(row.price_paise) || row.price_paise <= 0)
        return { ok: false, error: `"${row.title}" does not have a valid price yet.` };
      lines.push({ projectId: row.id, package: "digital", title: row.title, unitPricePaise: row.price_paise, quantity: 1 });
    } else {
      if (row.delivery_type === "digital") return { ok: false, error: `"${row.title}" is not offered as a physical kit.` };
      const kit = row.delivery_type === "physical_kit" ? (row.kit_price_paise ?? row.price_paise) : row.kit_price_paise;
      if (kit == null || !Number.isInteger(kit) || kit <= 0)
        return { ok: false, error: `"${row.title}" kit pricing is not available yet.` };
      lines.push({ projectId: row.id, package: "kit", title: `${row.title} — physical kit`, unitPricePaise: kit, quantity: 1 });
    }
  }

  const totalPaise = lines.reduce((sum, l) => sum + l.unitPricePaise * l.quantity, 0);
  if (totalPaise <= 0) return { ok: false, error: "Order total must be greater than zero." };
  return { ok: true, lines, totalPaise, requiresShipping: lines.some((l) => l.package === "kit") };
}
