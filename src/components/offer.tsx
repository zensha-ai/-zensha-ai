import { launchOffer, offerActive, regularPrice } from "@/content/offer";
import { cx } from "@/components/ui";

/** Struck-through regular price, shown before a launch price while the offer runs. */
export function WasPrice({ price, className }: { price: string; className?: string }) {
  const was = offerActive() ? regularPrice(price) : null;
  if (!was) return null;
  return (
    <s className={cx("whitespace-nowrap text-muted decoration-accent/70 decoration-2", className)}>
      <span className="sr-only">Regular price </span>
      {was}
    </s>
  );
}

/** Small "50% OFF" tag. */
export function OfferTag({ className }: { className?: string }) {
  if (!offerActive()) return null;
  return (
    <span className={cx("offer-tag inline-flex items-center whitespace-nowrap rounded-full bg-ink px-2.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.08em] text-paper", className)}>
      {launchOffer.percent}% off
    </span>
  );
}

/** One-line note explaining the offer and when it ends. */
export function OfferNote({ className }: { className?: string }) {
  if (!offerActive()) return null;
  return (
    <p className={cx("inline-flex flex-wrap items-center gap-2 text-sm text-ink-2", className)}>
      <OfferTag />
      {launchOffer.label}: launch prices shown, regular prices apply after {launchOffer.endsLabel}.
    </p>
  );
}
