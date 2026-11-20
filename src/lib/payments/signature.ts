import { createHmac, timingSafeEqual } from "node:crypto";

/** Constant-time HMAC-SHA256 hex comparison. */
export function hmacMatches(payload: string, secret: string, signature: string | null | undefined): boolean {
  if (!secret || !signature || typeof signature !== "string") return false;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Razorpay Checkout callback: HMAC(order_id|payment_id, key_secret). */
export function verifyPaymentSignature(
  args: { razorpayOrderId: string; razorpayPaymentId: string; signature: string },
  keySecret: string,
): boolean {
  return hmacMatches(`${args.razorpayOrderId}|${args.razorpayPaymentId}`, keySecret, args.signature);
}

/** Razorpay webhook: HMAC(raw body, webhook secret) in X-Razorpay-Signature. */
export function verifyWebhookSignature(rawBody: string, signature: string | null, webhookSecret: string): boolean {
  return hmacMatches(rawBody, webhookSecret, signature);
}
