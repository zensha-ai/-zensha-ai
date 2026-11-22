import Link from "next/link";
import { fmtOfferDate, offerActive } from "@/content/offer";
import { getOffer } from "@/lib/data/catalog";

/**
 * "Breaking news" style offer bar across the top of every page. Rendered only
 * while an offer from Admin → Offers & discounts is running; it disappears by
 * itself when the offer ends or is switched off.
 */
export async function OfferTicker() {
  const offer = await getOffer();
  if (!offerActive(offer)) return null;
  const name = offer.label || "Limited-time offer";
  const items = [
    name,
    `${offer.percent}% off all prices`,
    `Ends ${fmtOfferDate(offer.endDate)}`,
    "Websites · Apps · AI · Automation",
  ];
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <li key={i} className="flex items-center gap-8 whitespace-nowrap">
          {i === 0 ? <b className="offer-ticker-name">{t}</b> : <span>{t}</span>}
          <span aria-hidden className="offer-ticker-dot" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="offer-ticker" role="region" aria-label="Current offer">
      <span className="offer-ticker-badge">
        <span aria-hidden className="live-dot size-1.5 rounded-full bg-white" /> Offer
      </span>
      <Link href="/pricing" className="offer-ticker-track-wrap" aria-label={`${name}: ${offer.percent}% off all prices until ${fmtOfferDate(offer.endDate)}. See prices.`}>
        <div className="offer-ticker-track">
          {row(false)}
          {row(true)}
          {row(true)}
          {row(true)}
        </div>
      </Link>
      <Link href="/pricing" className="offer-ticker-cta">
        See prices →
      </Link>
    </div>
  );
}
