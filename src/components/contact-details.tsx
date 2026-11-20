import { brand, formatPhone } from "@/config/brand";
import { Placeholder } from "@/components/ui";

export function ContactDetails() {
  const c = brand.contact;
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Email", value: c.email ? <a href={`mailto:${c.email}`} className="underline underline-offset-4">{c.email}</a> : <Placeholder>[BUSINESS EMAIL]</Placeholder> },
    {
      label: "WhatsApp",
      value: c.whatsapp ? (
        <a href={`https://wa.me/${c.whatsapp}`} className="underline underline-offset-4" rel="noopener noreferrer" target="_blank">
          {formatPhone(c.whatsapp)}
        </a>
      ) : (
        <Placeholder>[VERIFIED NUMBER]</Placeholder>
      ),
    },
    { label: "Location", value: c.location ?? <Placeholder>[BUSINESS LOCATION, IF PUBLIC]</Placeholder> },
    { label: "Hours", value: c.hours ?? <Placeholder>[VERIFIED HOURS]</Placeholder> },
  ];
  return (
    <dl className="divide-y divide-line border-y border-line">
      {rows.map((r) => (
        <div key={r.label} className="flex items-baseline justify-between gap-6 py-4">
          <dt className="eyebrow">{r.label}</dt>
          <dd className="text-right">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
