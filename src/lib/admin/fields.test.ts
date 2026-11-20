import { describe, expect, it } from "vitest";
import { nest, parseForm, toFormValue, type Field } from "./fields";

const fd = (entries: Record<string, string>) => {
  const f = new FormData();
  Object.entries(entries).forEach(([k, v]) => f.append(k, v));
  return f;
};

describe("admin field parsing", () => {
  const fields: Field[] = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "Slug", type: "slug", required: true },
    { name: "price_paise", label: "Price", type: "money", required: true },
    { name: "is_free", label: "Free", type: "boolean" },
    { name: "faqs", label: "FAQs", type: "faq-list" },
    { name: "stack", label: "Stack", type: "string-list" },
    { name: "cta.label", label: "CTA", type: "text" },
  ];

  it("coerces money to paise, lists and booleans", () => {
    const r = parseForm(fields, fd({ title: "A", slug: "a-b", price_paise: "1,499.50", is_free: "on", faqs: "Q1 :: A1\nQ2 :: A2", stack: "Python\n\nSQL", "cta.label": "" }));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.price_paise).toBe(149950);
    expect(r.data.is_free).toBe(true);
    expect(r.data.faqs).toEqual([{ q: "Q1", a: "A1" }, { q: "Q2", a: "A2" }]);
    expect(r.data.stack).toEqual(["Python", "SQL"]);
    expect(nest(r.data)).toMatchObject({ cta: { label: null } });
  });

  it("rejects bad slugs, missing required values and negative prices", () => {
    const r = parseForm(fields, fd({ title: "", slug: "Bad Slug", price_paise: "-5" }));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(Object.keys(r.errors).sort()).toEqual(["price_paise", "slug", "title"]);
  });

  it("applies cross-field refinement", () => {
    const r = parseForm(fields, fd({ title: "A", slug: "a", price_paise: "10", is_free: "on" }), (d): Record<string, string> =>
      d.is_free && d.price_paise !== 0 ? { price_paise: "Free projects must have a price of ₹0." } : {},
    );
    expect(r.ok).toBe(false);
  });

  it("round-trips values back into form strings", () => {
    expect(toFormValue(fields[2], 149950)).toBe("1499.5");
    expect(toFormValue(fields[4], [{ q: "Q", a: "A" }])).toBe("Q :: A");
  });
});
