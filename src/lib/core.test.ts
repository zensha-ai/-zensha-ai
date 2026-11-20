import { describe, expect, it } from "vitest";
import { safeNext } from "@/lib/safe-next";
import { enquirySchema, isPlausibleTiming } from "@/lib/validation/enquiry";
import { formatINR, slugify } from "@/lib/format";
import { services } from "@/content/services";
import { mainNav } from "@/config/navigation";
import { brand } from "@/config/brand";

describe("safeNext", () => {
  it("keeps same-site paths", () => {
    expect(safeNext("/account/orders?x=1")).toBe("/account/orders?x=1");
  });
  it.each(["https://evil.example", "//evil.example", "/\\evil.example", "javascript:alert(1)", "", null, undefined, "/ok\nSet-Cookie:x"])(
    "rejects %s",
    (v) => expect(safeNext(v as string)).toBe("/account"),
  );
});

describe("enquiry validation", () => {
  const valid = {
    kind: "business",
    name: "Asha Rao",
    email: "asha@example.com",
    service: "website-design-development",
    message: "We need a new website for our clinic with booking enquiries.",
    consent: "on",
  };
  it("accepts a complete business enquiry", () => {
    expect(enquirySchema.safeParse(valid).success).toBe(true);
  });
  it("requires consent", () => {
    const { consent: _c, ...rest } = valid;
    void _c;
    expect(enquirySchema.safeParse(rest).success).toBe(false);
  });
  it("rejects a bad email and a short message", () => {
    const r = enquirySchema.safeParse({ ...valid, email: "nope", message: "hi" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.map((i) => i.path[0])).toEqual(expect.arrayContaining(["email", "message"]));
  });
  it("rejects an invalid phone but allows an empty one", () => {
    expect(enquirySchema.safeParse({ ...valid, phone: "abc" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...valid, phone: "" }).success).toBe(true);
  });
  it("validates student support enquiries separately", () => {
    expect(
      enquirySchema.safeParse({ kind: "student_support", name: "Ravi K", email: "r@example.com", service: "Line follower", message: "The motor driver does not respond after flashing.", consent: "on" })
        .success,
    ).toBe(true);
  });
  it("rejects bot-speed and missing timestamps", () => {
    const now = 1_000_000_000;
    expect(isPlausibleTiming(String(now - 500), now)).toBe(false);
    expect(isPlausibleTiming(null, now)).toBe(false);
    expect(isPlausibleTiming(String(now - 10_000), now)).toBe(true);
  });
});

describe("content integrity", () => {
  it("has exactly the 11 confirmed services with unique slugs", () => {
    expect(services).toHaveLength(11);
    expect(new Set(services.map((s) => s.slug)).size).toBe(11);
    expect(services.map((s) => s.title)).toEqual([
      "Web Design",
      "Web Apps",
      "Mobile Apps",
      "AI Solutions",
      "Custom Software",
      "Automation",
      "API Integrations",
      "WhatsApp & Instagram",
      "SEO & Marketing",
      "AI Chatbots",
      "Data & Analytics",
    ]);
  });
  it("only references related services that exist", () => {
    const slugs = new Set(services.map((s) => s.slug));
    for (const s of services) for (const r of s.related) expect(slugs.has(r)).toBe(true);
  });
  it("keeps the main navigation in the required order", () => {
    expect(mainNav.map((n) => n.label)).toEqual(["Home", "Services", "Pricing", "Student Projects", "Resources", "Our Work", "About", "Contact"]);
  });
  it("uses the central brand name", () => {
    expect(brand.brandName).toBe("ZENSHA AI");
    for (const s of services) expect(s.seo.title.endsWith(`| ${brand.brandName}`)).toBe(true);
  });
});

describe("format helpers", () => {
  it("formats paise as INR", () => {
    expect(formatINR(149900)).toMatch(/1,499/);
  });
  it("slugifies titles", () => {
    expect(slugify("IoT & Robotics: Smart Farm!")).toBe("iot-robotics-smart-farm");
  });
});
