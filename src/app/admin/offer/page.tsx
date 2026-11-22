import { getAdminContext } from "@/lib/admin/guard";
import { OFFER_KEY, fmtOfferDate, offerActive, parseOffer } from "@/content/offer";
import { servicePricing } from "@/content/service-pricing";
import { websitePlans } from "@/content/pricing";
import { services } from "@/content/services";
import { AdminHeader } from "../_components/shell";
import { NotConnected } from "../_components/not-connected";
import { OfferForm } from "../_components/forms";

export default async function OfferPage() {
  const ctx = await getAdminContext();
  if (!ctx) return <NotConnected />;
  const { data } = await ctx.db.from("site_settings").select("value").eq("key", OFFER_KEY).maybeSingle();
  const offer = parseOffer(data?.value);
  const active = offerActive(offer);
  const status = active
    ? `Running now — ${offer.percent}% off until ${fmtOfferDate(offer.endDate)}.`
    : offer.enabled && offer.startDate
      ? new Date() < new Date(`${offer.startDate}T00:00:00+05:30`)
        ? `Scheduled — starts ${fmtOfferDate(offer.startDate)}.`
        : `Ended on ${fmtOfferDate(offer.endDate)}. Regular prices are shown.`
      : "No offer running. Regular prices are shown.";

  const samples = [
    ...websitePlans.map((p) => ({ name: p.name, price: p.price })),
    ...services
      .filter((s) => servicePricing[s.slug])
      .slice(0, 4)
      .map((s) => ({ name: s.title, price: servicePricing[s.slug].from })),
  ];

  return (
    <div className="max-w-3xl space-y-8">
      <AdminHeader
        eyebrow="Pricing"
        title="Offers & discounts"
        description="Set a % off and the dates it runs. Regular prices stay as they are; during the offer the site shows the regular price struck through, the reduced price and a % OFF tag."
      />
      <p role="status" className={active ? "rounded-xl border border-accent bg-accent-soft p-4 text-sm" : "rounded-xl border border-line bg-surface p-4 text-sm text-ink-2"}>
        {status}
      </p>
      <OfferForm initial={offer} samples={samples} />
    </div>
  );
}
