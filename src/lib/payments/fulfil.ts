import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Idempotently marks an order as paid and grants entitlements for its lines.
 * Safe to call from both the client verification route and the webhook.
 * `db` must be the service-role client.
 */
export async function fulfilOrder(
  db: SupabaseClient,
  args: { orderId: string; razorpayOrderId: string; razorpayPaymentId: string; amountPaise?: number },
): Promise<{ ok: true; alreadyPaid: boolean } | { ok: false; error: string }> {
  const { data: order, error } = await db
    .from("orders")
    .select("id, user_id, status, amount_paise, razorpay_order_id")
    .eq("id", args.orderId)
    .maybeSingle();
  if (error || !order) return { ok: false, error: "ORDER_NOT_FOUND" };
  if (order.razorpay_order_id !== args.razorpayOrderId) return { ok: false, error: "ORDER_MISMATCH" };
  if (typeof args.amountPaise === "number" && args.amountPaise !== order.amount_paise)
    return { ok: false, error: "AMOUNT_MISMATCH" };

  let alreadyPaid = order.status === "paid";
  if (!alreadyPaid) {
    if (order.status === "refunded" || order.status === "cancelled") return { ok: false, error: "ORDER_CLOSED" };
    // Conditional update so concurrent callers can't double-transition.
    const { data: updated, error: upErr } = await db
      .from("orders")
      .update({ status: "paid", razorpay_payment_id: args.razorpayPaymentId, paid_at: new Date().toISOString() })
      .eq("id", order.id)
      .in("status", ["pending", "failed"])
      .select("id");
    if (upErr) return { ok: false, error: "ORDER_UPDATE_FAILED" };
    if (!updated?.length) alreadyPaid = true;
  }

  // Entitlements for every line (digital files are what the entitlement unlocks; kits
  // include the downloadable documentation as well). Upsert keeps this idempotent.
  const { data: items } = await db.from("order_items").select("project_id").eq("order_id", order.id);
  const projectIds = [...new Set((items ?? []).map((i) => i.project_id as string))];
  if (projectIds.length) {
    const { error: entErr } = await db.from("entitlements").upsert(
      projectIds.map((project_id) => ({
        user_id: order.user_id,
        project_id,
        order_id: order.id,
        source: "purchase",
        revoked: false,
      })),
      { onConflict: "user_id,project_id" },
    );
    if (entErr) return { ok: false, error: "ENTITLEMENT_FAILED" };
  }
  return { ok: true, alreadyPaid };
}

export async function markOrderFailed(db: SupabaseClient, razorpayOrderId: string) {
  await db.from("orders").update({ status: "failed" }).eq("razorpay_order_id", razorpayOrderId).eq("status", "pending");
}
