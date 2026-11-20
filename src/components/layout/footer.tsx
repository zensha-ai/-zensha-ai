import Link from "next/link";
import { brand, copyrightLine, formatPhone } from "@/config/brand";
import { footerNav } from "@/config/navigation";
import { Logo } from "./logo";
import { Placeholder } from "@/components/ui";

export function Footer() {
  const { contact } = brand;
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-z grid gap-14 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-6 text-lg font-medium">{brand.footerLine}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{brand.footerDescription}</p>
          <p className="eyebrow mt-6">{brand.descriptor}</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-5">
          {footerNav.map((group) => (
            <div key={group.heading}>
              <h2 className="eyebrow">{group.heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-ink-2 hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="container-z flex flex-col gap-3 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p className="flex flex-wrap items-center gap-2">
            {contact.email ? <a href={`mailto:${contact.email}`} className="hover:text-ink">{contact.email}</a> : <Placeholder>[EMAIL]</Placeholder>}
            <span aria-hidden>·</span>
            {contact.whatsapp ? <a href={`https://wa.me/${contact.whatsapp}`} className="hover:text-ink" target="_blank" rel="noopener noreferrer">{formatPhone(contact.whatsapp)}</a> : <Placeholder>[PHONE]</Placeholder>}
            {contact.location && (
              <>
                <span aria-hidden>·</span>
                <span>{contact.location}</span>
              </>
            )}
          </p>
          <p>{copyrightLine()}</p>
        </div>
      </div>
    </footer>
  );
}
