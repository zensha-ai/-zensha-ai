/**
 * Capability showcase for the Our Work page.
 *
 * These are CONCEPTS — illustrative examples of systems ZENSHA AI builds,
 * shown so visitors can picture what is possible. They are not client
 * projects and must always be labelled "Concept" wherever they appear.
 */
export type ShowcaseConcept = {
  slug: string;
  title: string;
  type: string;
  category: PortfolioCategory;
  industry: string;
  summary: string;
  /** Service page the card links to; also selects the illustration. */
  service: string;
};

export const portfolioCategories = ["Web Apps", "Websites", "AI", "Automation", "Data", "Mobile"] as const;
export type PortfolioCategory = (typeof portfolioCategories)[number];

export const showcaseConcepts: ShowcaseConcept[] = [
  {
    slug: "clinic-booking-website",
    title: "Clinic Booking Website",
    type: "Website",
    category: "Websites",
    industry: "Healthcare",
    summary: "A fast, mobile-first clinic website where patients see doctors, timings and services — and book a slot in under a minute.",
    service: "website-design-development",
  },
  {
    slug: "whatsapp-lead-engine",
    title: "WhatsApp Lead Engine",
    type: "Automation",
    category: "Automation",
    industry: "Real estate",
    summary: "Enquiries from ads, forms and Instagram land in one WhatsApp flow that replies instantly, qualifies the lead and alerts the sales team.",
    service: "whatsapp-instagram-automation",
  },
  {
    slug: "ai-support-assistant",
    title: "AI Support Assistant",
    type: "AI Chatbot",
    category: "AI",
    industry: "E-commerce",
    summary: "A chatbot that learns your FAQs and policies, answers order and return questions day and night, and hands over to a person when needed.",
    service: "ai-chatbot-development",
  },
  {
    slug: "sales-insights-dashboard",
    title: "Sales Insights Dashboard",
    type: "Data & Analytics",
    category: "Data",
    industry: "Distribution",
    summary: "Daily sales, stock and collections pulled from spreadsheets and billing software into one live dashboard.",
    service: "data-engineering-analytics",
  },
  {
    slug: "restaurant-ordering-app",
    title: "Restaurant Ordering App",
    type: "Mobile App",
    category: "Mobile",
    industry: "Food & beverage",
    summary: "Menu, cart, offers and order tracking in an app customers keep — with every order flowing straight to the kitchen.",
    service: "mobile-application-development",
  },
];

/** Best-effort category for a real project from its free-text project type. */
export function categoryFor(projectType: string): PortfolioCategory {
  const t = projectType.toLowerCase();
  if (/mobile|android|ios/.test(t)) return "Mobile";
  if (/\bai\b|chatbot|machine learning|ml\b/.test(t)) return "AI";
  if (/automation|whatsapp|workflow/.test(t)) return "Automation";
  if (/data|analytics|dashboard|pipeline/.test(t)) return "Data";
  if (/website|landing|e-?commerce/.test(t)) return "Websites";
  return "Web Apps";
}
