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
  themeColor: "#000000",
  colorScheme: "dark",
};

// Plays the opening loader once per browsing session; set before first paint.
const introScript = `try{var k="zensha-intro";if(sessionStorage.getItem(k)){document.documentElement.dataset.intro="seen"}else{sessionStorage.setItem(k,"1");document.documentElement.dataset.intro="play"}}catch(e){document.documentElement.dataset.intro="seen"}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${body.variable} ${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
