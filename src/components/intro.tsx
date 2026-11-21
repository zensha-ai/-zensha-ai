import { brand } from "@/config/brand";

/**
 * Opening loader: our logo in a glowing red tile, the wordmark, a thin
 * progress line and a 000→100 counter, then the curtain lifts.
 * Plays once per browsing session (the inline script in app/layout.tsx sets
 * <html data-intro>). Pure CSS; skipped for reduced motion. Decorative only —
 * the page content is already in the DOM underneath.
 */
export function Intro() {
  return (
    <div aria-hidden className="intro">
      <div aria-hidden className="intro-glow" />
      <div className="intro-inner">
        <div className="intro-tile">
          <svg viewBox="0 0 24 24" className="size-9">
            <path className="intro-stroke" d="M19 6.2A9 9 0 1 0 20.8 11" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" pathLength={1} />
            <circle className="intro-dot" cx="20.6" cy="7.8" r="1.9" fill="currentColor" />
          </svg>
        </div>
        <p className="intro-name">{brand.brandName}</p>
        <p className="intro-tag">{brand.descriptor}</p>
        <div className="intro-bar">
          <i />
        </div>
        <p className="intro-count" />
      </div>
    </div>
  );
}
