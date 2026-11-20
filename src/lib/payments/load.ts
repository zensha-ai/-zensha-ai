import "server-only";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PricingProjectRow, RequestedLine } from "./pricing";

export const requestedLinesSchema = z
  .array(z.object({ projectId: z.string().uuid(), package: z.enum(["digital", "kit"]) }))
  .min(1)
  .max(20);

export async function loadPricingRows(db: SupabaseClient, lines: RequestedLine[]): Promise<PricingProjectRow[]> {
  const ids = [...new Set(lines.map((l) => l.projectId))];
  const { data, error } = await db
    .from("student_projects")
    .select("id, title, published, is_free, is_example, delivery_type, price_paise, kit_price_paise")
    .in("id", ids);
  if (error) throw new Error("PRICING_LOOKUP_FAILED");
  return (data ?? []) as PricingProjectRow[];
}
