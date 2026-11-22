import { describe, expect, it } from "vitest";
import { applyOffer, discountedPrice, noOffer, offerActive, parseOffer, type Offer } from "./offer";

const offer: Offer = { enabled: true, percent: 50, startDate: "2026-11-23", endDate: "2026-12-31", label: "Launch offer" };

describe("site offer", () => {
  it("takes the percentage off the regular price, keeping its format", () => {
    expect(discountedPrice("₹14,999", 50)).toBe("₹7,499");
    expect(discountedPrice("₹9,999", 20)).toBe("₹7,999");
    expect(discountedPrice("₹69,999+", 50)).toBe("₹34,999+");
    expect(discountedPrice("₹1,00,000", 10)).toBe("₹90,000");
    expect(discountedPrice("Custom quote", 50)).toBe("Custom quote");
  });

  it("is active only between the start and end dates, India time, inclusive", () => {
    expect(offerActive(offer, new Date("2026-11-22T23:59:59+05:30"))).toBe(false);
    expect(offerActive(offer, new Date("2026-11-23T00:00:00+05:30"))).toBe(true);
    expect(offerActive(offer, new Date("2026-12-31T23:59:00+05:30"))).toBe(true);
    expect(offerActive(offer, new Date("2027-01-01T00:00:00+05:30"))).toBe(false);
  });

  it("is never active when switched off", () => {
    expect(offerActive({ ...offer, enabled: false }, new Date("2026-12-01T12:00:00+05:30"))).toBe(false);
    expect(offerActive(noOffer)).toBe(false);
  });

  it("shows the regular price struck through only while active", () => {
    expect(applyOffer("₹14,999", offer, new Date("2026-12-01T12:00:00+05:30"))).toEqual({ now: "₹7,499", was: "₹14,999" });
    expect(applyOffer("₹14,999", offer, new Date("2027-02-01T12:00:00+05:30"))).toEqual({ now: "₹14,999", was: null });
  });

  it("treats bad stored values as no offer", () => {
    expect(parseOffer(null)).toEqual(noOffer);
    expect(parseOffer({ ...offer, percent: 95 })).toEqual(noOffer);
    expect(parseOffer({ ...offer, endDate: "31/12/2026" })).toEqual(noOffer);
    expect(parseOffer(offer)).toEqual(offer);
  });
});
