import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { isPaymentsConfigured, serverEnv } from "@/lib/env";
import { fulfilOrder } from "@/lib/payments/fulfil";
import { verifyPaymentSignature } from "@/lib/payments/razorpay";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const noStore = { "Cache-Control": "no-store" };
const schema = z.object({
  orderId: z.string().uuid(),
  razorpay_order_id: z.string().min(1).max(64),
  razorpay_payment_id: z.string().min(1).max(64),
  razorpay_signature: z.string().min(1).max(256),
});

/** Called by the Checkout success handler. The webhook remains the backstop. */
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: noStore });

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  if (!isPaymentsConfigured()) return NextResponse.json({ error: "Payments not enabled" }, { status: 503, headers: noStore });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: noStore });
  const b = parsed.data;

  const valid = verifyPaymentSignature(
    { razorpayOrderId: b.razorpay_order_id, razorpayPaymentId: b.razorpay_payment_id, signature: b.razorpay_signature },
    serverEnv.razorpayKeySecret,
  );
  if (!valid) return NextResponse.json({ error: "Payment could not be verified" }, { status: 400, headers: noStore });

  const db = createSupabaseAdminClient();
  if (!db) return NextResponse.json({ error: "Payments not enabled" }, { status: 503, headers: noStore });

  const { data: order } = await db.from("orders").select("id, user_id").eq("id", b.orderId).maybeSingle();
  if (!order || order.user_id !== user.id) return NextResponse.json({ error: "Order not found" }, { status: 404, headers: noStore });

  const result = await fulfilOrder(db, {
    orderId: b.orderId,
    razorpayOrderId: b.razorpay_order_id,
    razorpayPaymentId: b.razorpay_payment_id,
  });
  if (!result.ok) return NextResponse.json({ error: "Payment could not be verified" }, { status: 409, headers: noStore });
  return NextResponse.json({ ok: true }, { headers: noStore });
}
