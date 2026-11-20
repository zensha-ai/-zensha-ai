/**
 * Public starting prices for each service (owner-approved launch pricing,
 * aimed at small and growing businesses in South Indian metros).
 * Every price is a starting point; final quotes follow a scope discussion.
 */
export type ServicePrice = {
  from: string;
  unit?: string;
  /** What this starting price represents. */
  represents: string;
  includes: string[];
  note?: string;
};

export const servicePricing: Record<string, ServicePrice> = {
  "website-design-development": {
    from: "₹14,999",
    represents: "Basic 3–5-page business website",
    includes: ["3–5-page business website", "Mobile-friendly design", "Contact form & WhatsApp", "Basic SEO & deployment"],
    note: "See all website packages on the Pricing page.",
  },
  "web-application-development": {
    from: "₹49,999",
    represents: "Discovery and interactive prototype",
    includes: ["Discovery & requirements", "Interactive prototype", "Core screens & user flows", "Build plan & estimate"],
  },
  "mobile-application-development": {
    from: "₹39,999",
    represents: "UI/UX design and clickable prototype",
    includes: ["App UI/UX design", "Clickable prototype", "Key user journeys", "Development estimate"],
  },
  "ai-development-intelligent-solutions": {
    from: "₹29,999",
    represents: "One limited AI proof of concept",
    includes: ["Use-case discovery", "One limited proof of concept", "Your sample data connected", "Results review & next steps"],
    note: "AI provider usage costs are billed separately.",
  },
  "custom-software-development": {
    from: "₹49,999",
    represents: "Discovery and workflow prototype",
    includes: ["Discovery workshop", "Workflow prototype", "Core modules mapped", "Build plan & estimate"],
  },
  "business-process-automation": {
    from: "₹14,999",
    represents: "Up to two simple workflows",
    includes: ["Process mapping", "Up to 2 simple workflows", "Alerts & error handling", "Documentation"],
  },
  "api-development-integrations": {
    from: "₹14,999",
    represents: "One straightforward integration",
    includes: ["One straightforward integration", "Secure authentication", "Data mapping & testing", "Failure handling"],
  },
  "whatsapp-instagram-automation": {
    from: "₹9,999",
    represents: "Basic single-channel automation setup",
    includes: ["Single-channel setup", "Auto-replies & FAQ flow", "Lead capture", "Hand-off to your team"],
    note: "Meta platform message fees are billed separately.",
  },
  "digital-marketing-seo": {
    from: "₹9,999",
    unit: "/month",
    represents: "Basic monthly SEO service",
    includes: ["Basic monthly SEO", "Technical fixes", "On-page optimisation", "Monthly progress update"],
  },
  "ai-chatbot-development": {
    from: "₹19,999",
    represents: "Simple website chatbot",
    includes: ["Simple website chatbot", "Trained on your content", "Lead capture", "Human hand-off"],
    note: "AI provider usage costs are billed separately.",
  },
  "data-engineering-analytics": {
    from: "₹29,999",
    represents: "Small batch-data pipeline",
    includes: ["Small batch-data pipeline", "Data source review", "Clean data model", "Scheduled runs & quality checks"],
  },
};

export const priceLabel = (slug: string) => {
  const p = servicePricing[slug];
  return p ? `From ${p.from}${p.unit ?? ""}` : null;
};
