/**
 * Site-wide price offer, managed in Admin → Offers & discounts (stored in
 * site_settings under the key "offer"). Prices in code are always the regular
 * (default) prices; while an offer runs the discount is taken off them.
 */
export type Offer = {
  enabled: boolean;
  /** Whole-number percentage off, 1–90. */
  percent: number;
  /** First day of the offer, YYYY-MM-DD (India time, from 00:00). */
  startDate: string;
  /** Last day of the offer, YYYY-MM-DD (India time, until 23:59:59). */
  endDate: string;
  /** Short name shown next to the tag, e.g. "Launch offer". */
  label: string;
};

export const OFFER_KEY = "offer";
export const noOffer: Offer = { enabled: false, percent: 0, startDate: "", endDate: "", label: "" };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ist = (date: string, time: string) => new Date(`${date}T${time}+05:30`).getTime();

/** Reads an unknown stored value into a safe Offer (anything invalid → no offer). */
export function parseOffer(v: unknown): Offer {
  if (!v || typeof v !== "object") return noOffer;
  const o = v as Record<string, unknown>;
  const percent = Math.trunc(Number(o.percent));
  const startDate = typeof o.startDate === "string" && DATE_RE.test(o.startDate) ? o.startDate : "";
  const endDate = typeof o.endDate === "string" && DATE_RE.test(o.endDate) ? o.endDate : "";
  if (!(percent >= 1 && percent <= 90) || !startDate || !endDate) return noOffer;
  return { enabled: o.enabled === true, percent, startDate, endDate, label: typeof o.label === "string" ? o.label.slice(0, 40) : "" };
}

/** True while the offer is switched on and today is between its start and end dates (inclusive). */
export function offerActive(offer: Offer, now: Date = new Date()): boolean {
  if (!offer.enabled || offer.percent < 1 || !offer.startDate || !offer.endDate) return false;
  const t = now.getTime();
  return t >= ist(offer.startDate, "00:00:00") && t <= ist(offer.endDate, "23:59:59");
}

/** "₹14,999" at 50% → "₹7,499"; "₹69,999+" → "₹34,999+". Rounds down; keeps symbol and suffix. */
export function discountedPrice(price: string, percent: number): string {
  const m = price.match(/\d[\d,]*/);
  if (!m || m.index === undefined) return price;
  const n = Number(m[0].replace(/,/g, ""));
  if (!Number.isFinite(n) || n <= 0) return price;
  const now = Math.floor((n * (100 - percent)) / 100);
  return price.slice(0, m.index) + now.toLocaleString("en-IN") + price.slice(m.index + m[0].length);
}

/** Price to show plus the struck-through original while an offer is active. */
export function applyOffer(price: string, offer: Offer, now?: Date): { now: string; was: string | null } {
  if (!offerActive(offer, now)) return { now: price, was: null };
  return { now: discountedPrice(price, offer.percent), was: price };
}

/** "31 Dec 2026" */
export const fmtOfferDate = (d: string) =>
  d ? new Date(`${d}T12:00:00+05:30`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }) : "";
