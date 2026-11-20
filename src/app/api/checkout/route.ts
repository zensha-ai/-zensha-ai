import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { isPaymentsConfigured, publicEnv } from "@/lib/env";
import { priceCart } from "@/lib/payments/pricing";
import { loadPricingRows, requestedLinesSchema } from "@/lib/payments/load";
import { createRazorpayOrder } from "@/lib/payments/razorpay";
import { rateLimit } from "@/lib/rate-limit";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const noStore = { "Cache-Control": "no-store" };
const fail = (status: number, error: string) => NextResponse.json({ error }, { status, headers: noStore });

const addressSchema = z.object({
  line1: z.string().trim().min(3).max(200),
  line2: z.string().trim().max(200).optional().default(""),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  postal_code: z.string().trim().regex(/^[0-9]{6}$/, "Enter a 6-digit PIN code."),
  country: z.literal("IN").default("IN"),
});

const bodySchema = z.object({
  lines: requestedLinesSchema,
  billing: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().toLowerCase().email().max(254),
    phone: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/).optional().or(z.literal("")),
  }),
  shipping: addressSchema.optional(),
});

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return fail(403, "Forbidden");

  const user = await getCurrentUser();
  if (!user) return fail(401, "Please sign in to continue.");
  if (!isPaymentsConfigured()) return fail(503, "Online payments are not enabled yet");
  if (!(await rateLimit("checkout", 10, 600, user.id))) return fail(429, "Too many attempts. Please wait a few minutes.");

  let body: z.infer<typeof bodySchema>;
  try {
    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) return fail(400, "Please check your billing details and try again.");
    body = parsed.data;
  } catch {
    return fail(400, "Invalid request.");
  }

  const db = createSupabaseAdminClient();
  if (!db) return fail(503, "Online payments are not enabled yet");

  const rows = await loadPricingRows(db, body.lines).catch(() => null);
  if (!rows) return fail(502, "We couldn't confirm current prices. Please try again.");
  const priced = priceCart(body.lines, rows);
  if (!priced.ok) return fail(409, priced.error);
  if (priced.requiresShipping && !body.shipping) return fail(400, "A shipping address is required for physical kits.");

  // 1. Pending order (server-computed amount)
  const { data: order, error: orderErr } = await db
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      currency: "INR",
      amount_paise: priced.totalPaise,
      billing_name: body.billing.name,
      billing_email: body.billing.email,
      billing_phone: body.billing.phone || null,
      shipping_address: priced.requiresShipping ? body.shipping : null,
    })
    .select("id")
    .single();
  if (orderErr || !order) return fail(500, "We couldn't start your order. Please try again.");

  const { error: itemsErr } = await db.from("order_items").insert(
    priced.lines.map((l) => ({
      order_id: order.id,
      project_id: l.projectId,
      package: l.package,
      title_snapshot: l.title,
      unit_price_paise: l.unitPricePaise,
      quantity: l.quantity,
    })),
  );
  if (itemsErr) {
    await db.from("orders").update({ status: "cancelled" }).eq("id", order.id);
    return fail(500, "We couldn't start your order. Please try again.");
  }

  // 2. Razorpay order
  try {
    const rz = await createRazorpayOrder({
      amountPaise: priced.totalPaise,
      receipt: order.id.replace(/-/g, "").slice(0, 32),
      notes: { order_id: order.id },
    });
    if (rz.amount !== priced.totalPaise) throw new Error("AMOUNT_MISMATCH");
    await db.from("orders").update({ razorpay_order_id: rz.id }).eq("id", order.id);
    return NextResponse.json(
      {
        orderId: order.id,
        razorpayOrderId: rz.id,
        keyId: publicEnv.razorpayKeyId,
        amount: priced.totalPaise,
        currency: "INR",
        prefill: { name: body.billing.name, email: body.billing.email, contact: body.billing.phone || undefined },
      },
      { headers: noStore },
    );
  } catch {
    await db.from("orders").update({ status: "failed" }).eq("id", order.id);
    return fail(502, "The payment provider is unavailable right now. You have not been charged.");
  }
}
