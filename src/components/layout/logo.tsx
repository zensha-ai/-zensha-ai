import Link from "next/link";
import { brand } from "@/config/brand";

/** Text wordmark with a small open-circle mark. No trademark claim implied. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label={`${brand.brandName} — home`}>
      <svg viewBox="0 0 24 24" aria-hidden className="size-7 shrink-0 transition-transform duration-500 group-hover:rotate-[-20deg]">
        <defs>
          <linearGradient id="zensha-logo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3f4f6" />
            <stop offset="0.55" stopColor="#8b9cff" />
            <stop offset="1" stopColor="#5eead4" />
          </linearGradient>
        </defs>
        <path d="M19 6.2A9 9 0 1 0 20.8 11" fill="none" stroke="url(#zensha-logo-grad)" strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="20.6" cy="7.8" r="1.9" fill="#5eead4" />
      </svg>
      <span className="font-[family-name:var(--font-display)] text-[1.05rem] font-semibold tracking-[0.18em]">
        {brand.brandName}
      </span>
    </Link>
  );
}
