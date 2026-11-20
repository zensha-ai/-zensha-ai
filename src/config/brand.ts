/**
 * Central brand + business configuration.
 *
 * ZENSHA AI is a WORKING brand identity. Trademark, company-name and domain
 * clearance are pending — change `brandName` here and it propagates through
 * visible copy, metadata, structured data, emails and the admin UI.
 *
 * Contact details are deliberately `null` until verified. Components render an
 * honest "to be confirmed" state instead of inventing details.
 */
export const brand = {
  brandName: "ZENSHA AI",
  tagline: "Intelligence, Designed with Purpose.",
  descriptor: "AI, Software, Data & Engineering",
  footerLine: "Build with clarity. Create with purpose.",
  footerDescription:
    "ZENSHA AI develops websites, applications, AI solutions and automation tools, with a dedicated collection of hands-on student projects.",
  /** Public site URL. Set NEXT_PUBLIC_SITE_URL once a domain is cleared and owned. */
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_IN",
  currency: "INR",
  contact: {
    /** [BUSINESS EMAIL] — use a dedicated company inbox, not a personal address. */
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
    /** [VERIFIED NUMBER] — international format, digits only, e.g. 9198XXXXXXXX. */
    whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || null,
    /** [BUSINESS LOCATION, IF PUBLIC] */
    location: process.env.NEXT_PUBLIC_CONTACT_LOCATION || null,
    /** [VERIFIED HOURS] */
    hours: process.env.NEXT_PUBLIC_CONTACT_HOURS || null,
  },
  social: {} as Record<string, string>,
  founder: {
    name: "Vishnu S",
    title: "Data Engineer & Technology Builder",
    portfolioUrl: "https://vishnu-dataengineer.vercel.app/",
  },
  /**
   * Publication approvals. Each of these was marked "confirm before publishing"
   * in the content document. Flip to true once the owner has approved.
   */
  publish: {
    /** Employer names (Merchmix | Alkye, Uber Ext, Flipkart) on the About page. */
    founderEmployment: process.env.NEXT_PUBLIC_PUBLISH_FOUNDER_EMPLOYMENT === "true",
    /** The three projects from the founder's personal portfolio on Our Work. */
    founderPortfolio: process.env.NEXT_PUBLIC_PUBLISH_FOUNDER_PORTFOLIO === "true",
  },
} as const;

export type Brand = typeof brand;

/** "917810008567" → "+91 78100 08567" (Indian mobile); other numbers get a leading "+". */
export const formatPhone = (digits: string) =>
  /^91\d{10}$/.test(digits) ? `+91 ${digits.slice(2, 7)} ${digits.slice(7)}` : `+${digits}`;

export const copyrightLine =() => `© ${new Date().getFullYear()} ${brand.brandName}. All rights reserved.`;
