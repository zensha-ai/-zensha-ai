import { describe, expect, it } from "vitest";
import { offerActive, regularPrice } from "./offer";

describe("launch offer", () => {
  it("doubles the launch price for a 50% offer, keeping the format", () => {
    expect(regularPrice("₹14,999")).toBe("₹29,998");
    expect(regularPrice("₹9,999")).toBe("₹19,998");
    expect(regularPrice("₹69,999+")).toBe("₹1,39,998+");
  });

  it("returns null when there is no number", () => {
    expect(regularPrice("Custom quote")).toBeNull();
  });

  it("runs until the end of 31 Dec 2026 (IST) and then switches off", () => {
    expect(offerActive(new Date("2026-12-31T23:00:00+05:30"))).toBe(true);
    expect(offerActive(new Date("2027-01-01T00:00:01+05:30"))).toBe(false);
  });
});
