import { NextResponse, type NextRequest } from "next/server";
import { serverEnv } from "@/lib/env";
import { fulfilOrder, markOrderFailed } from "@/lib/payments/fulfil";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

type PaymentEntity = { id: string; order_id: string; amount: number; status: string };
type WebhookBody = {
  event: string;
  payload?: { payment?: { entity?: PaymentEntity }; order?: { entity?: { id: string; amount: number } } };
};

/**
 * Razorpay webhook. Configure in the Razorpay dashboard with events:
 * payment.captured, order.paid, payment.failed — and RAZORPAY_WEBHOOK_SECRET.
 */
export async function POST(request: NextRequest) {
  const secret = serverEnv.razorpayWebhookSecret;
  const db = createSupabaseAdminClient();
  if (!secret || !db) return new NextResponse("Not configured", { status: 503 });

  const raw = await request.text();
  if (!verifyWebhookSignature(raw, request.headers.get("x-razorpay-signature"), secret)) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  let body: WebhookBody;
  try {
    body = JSON.parse(raw) as WebhookBody;
  } catch {
    return new NextResponse("Bad payload", { status: 400 });
  }

  // Idempotency: Razorpay sends a unique event id header; retries reuse it.
  const eventId = request.headers.get("x-razorpay-event-id") || `${body.event}:${body.payload?.payment?.entity?.id ?? ""}`;
  const { error: dupErr } = await db.from("payment_events").insert({ id: eventId, event: body.event, payload: body });
  if (dupErr) {
    if (dupErr.code === "23505") return NextResponse.json({ ok: true, duplicate: true });
    return new NextResponse("Storage error", { status: 500 });
  }

  const payment = body.payload?.payment?.entity;
  if ((body.event === "payment.captured" || body.event === "order.paid") && payment?.order_id) {
    const { data: order } = await db.from("orders").select("id").eq("razorpay_order_id", payment.order_id).maybeSingle();
    if (order) {
      const result = await fulfilOrder(db, {
        orderId: order.id,
        razorpayOrderId: payment.order_id,
        razorpayPaymentId: payment.id,
        amountPaise: payment.amount,
      });
      if (!result.ok && result.error !== "ORDER_CLOSED" && result.error !== "AMOUNT_MISMATCH") {
        // Let Razorpay retry transient failures.
        await db.from("payment_events").delete().eq("id", eventId);
        return new NextResponse("Retry", { status: 500 });
      }
    }
  } else if (body.event === "payment.failed" && payment?.order_id) {
    await markOrderFailed(db, payment.order_id);
  }

  return NextResponse.json({ ok: true });
}
