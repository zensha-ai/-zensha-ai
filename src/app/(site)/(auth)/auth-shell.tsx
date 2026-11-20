import type { ReactNode } from "react";
import { isSupabaseConfigured } from "@/lib/env";
import { ButtonLink } from "@/components/ui";
import { Notice } from "@/components/commerce/fields";

export function AuthShell({ eyebrow, title, text, children, footer }: { eyebrow: string; title: string; text: string; children: ReactNode; footer?: ReactNode }) {
  const configured = isSupabaseConfigured();
  return (
    <div className="container-z grid gap-12 py-16 sm:py-24 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display-2 mt-5">{title}</h1>
        <p className="lede mt-5 max-w-md">{text}</p>
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-10">
          {configured ? (
            children
          ) : (
            <div className="grid gap-5">
              <Notice tone="info">Accounts are not available yet — the database isn&rsquo;t connected.</Notice>
              <ButtonLink href="/contact" variant="secondary">
                Contact us instead
              </ButtonLink>
            </div>
          )}
        </div>
        {footer && <div className="mt-6 text-sm text-ink-2">{footer}</div>}
      </div>
    </div>
  );
}
