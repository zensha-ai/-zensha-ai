import { applyOffer, fmtOfferDate, offerActive } from "@/content/offer";
import { servicePricing } from "@/content/service-pricing";
import { getOffer } from "@/lib/data/catalog";
import { cx } from "@/components/ui";

/** The price to charge: the regular price, or the discounted one while an offer runs. */
export async function OfferPrice({ price }: { price: string }) {
  return <>{applyOffer(price, await getOffer()).now}</>;
}

/** "From ₹7,499/month" for a service (discount applied when active). */
export async function PriceLabel({ slug }: { slug: string }) {
  const p = servicePricing[slug];
  if (!p) return null;
  return (
    <>
      From <OfferPrice price={p.from} />
      {p.unit ?? ""}
    </>
  );
}

/** The regular price struck through — only while an offer runs. */
export async function WasPrice({ price, className }: { price: string; className?: string }) {
  const { was } = applyOffer(price, await getOffer());
  if (!was) return null;
  return (
    <s className={cx("whitespace-nowrap text-muted decoration-accent/70 decoration-2", className)}>
      <span className="sr-only">Regular price </span>
      {was}
    </s>
  );
}

/** "50% OFF" tag — only while an offer runs. */
export async function OfferTag({ className }: { className?: string }) {
  const offer = await getOffer();
  if (!offerActive(offer)) return null;
  return (
    <span className={cx("inline-flex items-center whitespace-nowrap rounded-full bg-ink px-2.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.08em] text-paper", className)}>
      {offer.percent}% off
    </span>
  );
}

/** One line explaining the offer and its end date — only while it runs. */
export async function OfferNote({ className }: { className?: string }) {
  const offer = await getOffer();
  if (!offerActive(offer)) return null;
  return (
    <p className={cx("inline-flex flex-wrap items-center gap-2 text-sm text-ink-2", className)}>
      <OfferTag />
      {offer.label ? `${offer.label}: ` : ""}
      {offer.percent}% off all prices until {fmtOfferDate(offer.endDate)}.
    </p>
  );
}
