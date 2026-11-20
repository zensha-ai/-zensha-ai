import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { priceCart, type PricingProjectRow } from "./pricing";
import { hmacMatches, verifyPaymentSignature, verifyWebhookSignature } from "./signature";

const row = (o: Partial<PricingProjectRow> = {}): PricingProjectRow => ({
  id: "p1",
  title: "Line Follower",
  published: true,
  is_free: false,
  is_example: false,
  delivery_type: "digital",
  price_paise: 49900,
  kit_price_paise: null,
  ...o,
});

describe("priceCart", () => {
  it("prices digital lines from DB rows", () => {
    const r = priceCart([{ projectId: "p1", package: "digital" }], [row()]);
    expect(r).toEqual({
      ok: true,
      lines: [{ projectId: "p1", package: "digital", title: "Line Follower", unitPricePaise: 49900, quantity: 1 }],
      totalPaise: 49900,
      requiresShipping: false,
    });
  });

  it("de-duplicates repeated lines", () => {
    const r = priceCart(
      [
        { projectId: "p1", package: "digital" },
        { projectId: "p1", package: "digital" },
      ],
      [row()],
    );
    expect(r.ok && r.totalPaise).toBe(49900);
  });

  it("adds kit lines and flags shipping", () => {
    const r = priceCart(
      [
        { projectId: "p1", package: "digital" },
        { projectId: "p1", package: "kit" },
      ],
      [row({ delivery_type: "digital_and_kit", kit_price_paise: 150000 })],
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.totalPaise).toBe(199900);
      expect(r.requiresShipping).toBe(true);
    }
  });

  it("rejects unknown, unpublished, example and free items", () => {
    expect(priceCart([{ projectId: "x", package: "digital" }], [row()]).ok).toBe(false);
    expect(priceCart([{ projectId: "p1", package: "digital" }], [row({ published: false })]).ok).toBe(false);
    expect(priceCart([{ projectId: "p1", package: "digital" }], [row({ is_example: true })]).ok).toBe(false);
    expect(priceCart([{ projectId: "p1", package: "digital" }], [row({ is_free: true, price_paise: 0 })]).ok).toBe(false);
  });

  it("rejects kit for digital-only and digital for kit-only", () => {
    expect(priceCart([{ projectId: "p1", package: "kit" }], [row()]).ok).toBe(false);
    expect(priceCart([{ projectId: "p1", package: "digital" }], [row({ delivery_type: "physical_kit" })]).ok).toBe(false);
  });

  it("rejects zero or missing prices and empty carts", () => {
    expect(priceCart([], [row()]).ok).toBe(false);
    expect(priceCart([{ projectId: "p1", package: "digital" }], [row({ price_paise: 0 })]).ok).toBe(false);
    expect(priceCart([{ projectId: "p1", package: "kit" }], [row({ delivery_type: "digital_and_kit" })]).ok).toBe(false);
  });
});

describe("signatures", () => {
  const secret = "test_secret";
  it("verifies a valid checkout signature", () => {
    const sig = createHmac("sha256", secret).update("order_1|pay_1").digest("hex");
    expect(verifyPaymentSignature({ razorpayOrderId: "order_1", razorpayPaymentId: "pay_1", signature: sig }, secret)).toBe(true);
  });
  it("rejects tampered ids, wrong secret and malformed signatures", () => {
    const sig = createHmac("sha256", secret).update("order_1|pay_1").digest("hex");
    expect(verifyPaymentSignature({ razorpayOrderId: "order_2", razorpayPaymentId: "pay_1", signature: sig }, secret)).toBe(false);
    expect(verifyPaymentSignature({ razorpayOrderId: "order_1", razorpayPaymentId: "pay_1", signature: sig }, "other")).toBe(false);
    expect(verifyPaymentSignature({ razorpayOrderId: "order_1", razorpayPaymentId: "pay_1", signature: "abc" }, secret)).toBe(false);
    expect(hmacMatches("x", "", "anything")).toBe(false);
    expect(hmacMatches("x", secret, null)).toBe(false);
  });
  it("verifies webhook bodies byte-for-byte", () => {
    const body = JSON.stringify({ event: "payment.captured", id: "evt_1" });
    const sig = createHmac("sha256", "whsec").update(body).digest("hex");
    expect(verifyWebhookSignature(body, sig, "whsec")).toBe(true);
    expect(verifyWebhookSignature(body + " ", sig, "whsec")).toBe(false);
    expect(verifyWebhookSignature(body, null, "whsec")).toBe(false);
  });
});
