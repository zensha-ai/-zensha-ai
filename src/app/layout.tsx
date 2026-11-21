import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { brand } from "@/config/brand";
import { pageSeo } from "@/content/site";
import "./globals.css";

const body = Inter_Tight({ subsets: ["latin"], variable: "--font-body", display: "swap", weight: ["400", "500", "600"] });
const display = Inter_Tight({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["500", "600", "700", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: { default: pageSeo.home.title, template: `%s | ${brand.brandName}` },
  description: pageSeo.home.description,
  applicationName: brand.brandName,
  openGraph: { siteName: brand.brandName, locale: brand.locale, type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

const palettes = ["red", "violet", "lime", "blue", "amber"];
const paletteScript = `try{var k="zensha-palette",s=sessionStorage,p=s.getItem(k),l=${JSON.stringify(palettes)};if(l.indexOf(p)<0){p=l[Math.floor(Math.random()*l.length)];s.setItem(k,p)}document.documentElement.dataset.palette=p}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${body.variable} ${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Picks one accent palette per visit (kept for the browsing session) before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: paletteScript }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
