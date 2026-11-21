import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/json-ld";
import { SpotlightTracker } from "@/components/effects";
import { Cursor } from "@/components/cursor";
import { Intro } from "@/components/intro";
import { CookieConsent } from "@/components/cookie-consent";
import { SmoothScroll } from "@/components/smooth-scroll";
import { organizationJsonLd } from "@/lib/seo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Intro />
      <div aria-hidden className="scroll-progress" />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <JsonLd data={organizationJsonLd()} />
      <SpotlightTracker />
      <Cursor />
      <SmoothScroll />
      <CookieConsent />
    </>
  );
}
