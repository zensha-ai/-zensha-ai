/**
 * Launch offer shown on every price. Owner decision (Nov 2026): today's prices
 * are the launch prices; the regular price shown struck through (2×) applies
 * from 1 Jan 2027. The offer switches itself off after `endsAt` — after that
 * date the regular prices must actually be charged, or the tags must go.
 */
export const launchOffer = {
  percent: 50,
  label: "Launch offer",
  endsAt: "2026-12-31T23:59:59+05:30",
  endsLabel: "31 Dec 2026",
} as const;

export const offerActive = (now: Date = new Date()) => now.getTime() <= new Date(launchOffer.endsAt).getTime();

/** "₹14,999" → "₹29,998"; "₹69,999+" → "₹1,39,998+" (Indian digit grouping). */
export function regularPrice(price: string): string | null {
  const m = price.match(/\d[\d,]*/);
  if (!m || m.index === undefined) return null;
  const n = Number(m[0].replace(/,/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  const regular = Math.round(n / (1 - launchOffer.percent / 100));
  return price.slice(0, m.index) + regular.toLocaleString("en-IN") + price.slice(m.index + m[0].length);
}
