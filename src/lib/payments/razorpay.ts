import "server-only";
import Razorpay from "razorpay";
import { isPaymentsConfigured, publicEnv, serverEnv } from "@/lib/env";

export { verifyPaymentSignature, verifyWebhookSignature } from "./signature";

let client: Razorpay | null = null;

function getClient(): Razorpay {
  if (!isPaymentsConfigured()) throw new Error("PAYMENTS_NOT_CONFIGURED");
  if (!client) client = new Razorpay({ key_id: publicEnv.razorpayKeyId, key_secret: serverEnv.razorpayKeySecret });
  return client;
}

export async function createRazorpayOrder(args: { amountPaise: number; receipt: string; notes?: Record<string, string> }) {
  const order = await getClient().orders.create({
    amount: args.amountPaise,
    currency: "INR",
    receipt: args.receipt.slice(0, 40),
    notes: args.notes,
  });
  return { id: order.id, amount: Number(order.amount), currency: order.currency };
}
