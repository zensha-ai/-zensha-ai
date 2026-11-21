"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "zensha-cookie-consent";
export type CookieChoice = "all" | "essential";

/** The visitor's saved choice, or null until they choose. */
export function getCookieChoice(): CookieChoice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Cookie banner on a visitor's first visit. Today the site uses only strictly
 * necessary cookies (sign-in) and local storage (cart). The choice is saved so
 * any optional analytics added later can respect it: read getCookieChoice() or
 * listen for the "zensha:cookie-consent" window event.
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (getCookieChoice()) return;
    const intro = document.documentElement.dataset.intro === "play";
    const t = window.setTimeout(() => setOpen(true), intro ? 2600 : 900);
    return () => window.clearTimeout(t);
  }, []);

  const choose = (choice: CookieChoice) => {
    try {
      localStorage.setItem(KEY, choice);
    } catch {}
    window.dispatchEvent(new CustomEvent("zensha:cookie-consent", { detail: choice }));
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="cookie-pop fixed inset-x-3 bottom-3 z-[90] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[25rem]"
    >
      <div className="rounded-2xl border border-line-strong bg-[#0c0c0c]/95 p-5 text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur">
        <h2 id="cookie-title" className="text-sm font-bold">
          Cookies on this site
        </h2>
        <p className="mt-2 text-[0.8rem] leading-relaxed text-ink-2">
          We use essential cookies to run this site and keep you signed in. With your permission, we may also use analytics cookies to
          understand how visitors use it.{" "}
          <Link href="/legal/cookies" className="text-ink underline underline-offset-4">
            Cookie Notice
          </Link>
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link href="/legal/cookies" className="mr-auto text-[0.8rem] font-semibold underline underline-offset-4 hover:text-accent">
            Cookie Settings
          </Link>
          <button
            type="button"
            onClick={() => choose("essential")}
            className="rounded-full border border-line-strong px-4 py-2 text-[0.8rem] font-semibold transition-colors hover:border-ink"
          >
            Reject Optional
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="rounded-full bg-accent px-4 py-2 text-[0.8rem] font-semibold text-on-accent transition-transform hover:-translate-y-0.5"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
