/**
 * Website packages and pricing-page content. Prices supplied by the owner
 * (same as their existing VISHNEXA packages). Edit here to change them everywhere.
 */
export type Plan = {
  id: string;
  name: string;
  price: string;
  pages: string;
  icon: "rocket" | "briefcase" | "gem" | "building";
  tint: string;
  popular?: boolean;
  description: string;
  features: string[];
  bestFor: string;
};

export const websitePlans: Plan[] = [
  {
    id: "starter",
    name: "Starter Website",
    price: "₹9,999",
    pages: "Up to 5 pages",
    icon: "rocket",
    tint: "#5eead4",
    description: "A professional, responsive website that builds trust and makes it easy to get in touch.",
    features: ["Premium design", "Mobile-friendly layout", "Contact form", "Basic SEO setup", "WhatsApp chat button", "Deployment included"],
    bestFor: "Restaurants, shops, local businesses and small service providers",
  },
  {
    id: "business",
    name: "Business Website",
    price: "₹19,999",
    pages: "Up to 10 pages",
    icon: "briefcase",
    tint: "#8b9cff",
    popular: true,
    description: "A stronger website with analytics, SEO structure, integrations and a blog to grow your reach.",
    features: [
      "Everything in Starter",
      "Advanced UI/UX",
      "Visitor analytics",
      "Technical SEO structure",
      "Social & contact integrations",
      "Blog section",
      "Speed optimisation",
      "Social share previews",
    ],
    bestFor: "Clinics, agencies, consultants and service businesses",
  },
  {
    id: "premium",
    name: "Premium Website",
    price: "₹39,999",
    pages: "Up to 15 pages",
    icon: "gem",
    tint: "#f0abfc",
    description: "A premium website with a distinct brand feel, smooth animations and top performance.",
    features: ["Everything in Business", "Advanced animations", "Premium UI/UX", "Performance tuning", "Brand identity setup", "Advanced integrations"],
    bestFor: "Companies, brands and startups that need to stand out",
  },
  {
    id: "enterprise",
    name: "Enterprise Web App",
    price: "₹69,999+",
    pages: "20+ pages · custom scope",
    icon: "building",
    tint: "#fcd34d",
    description: "A custom platform with users, data, dashboards, APIs, payments and workflows.",
    features: ["Backend APIs", "PostgreSQL database", "Secure login & accounts", "Admin dashboard", "CMS & lead management", "Payment gateway", "Deployment included"],
    bestFor: "Growing businesses, SaaS products, portals and dashboards",
  },
];

export const pricingNote = "Final price is confirmed after a short call about your scope.";

export const pricingFinePrint =
  "Prices shown are starting prices. Taxes, domain, hosting, paid licences, premium tools, content writing, special integrations and work outside the package are quoted separately.";

export const pricingStats = [
  { value: "₹9,999", label: "Starting price", icon: "indian-rupee" },
  { value: "Responsive", label: "On every device", icon: "smartphone" },
  { value: "SEO", label: "Foundations included", icon: "search" },
  { value: "Scalable", label: "Ready to grow", icon: "trending-up" },
] as const;

export const pricingPrinciple = {
  title: "Pay for outcomes. Scope the engineering honestly.",
  points: [
    "Packages are built around what you actually get: a credible design, enquiries, SEO, speed, analytics and a live launch.",
    "Bigger platforms are priced only after we understand your users, workflows, data, security and long-term plans.",
  ],
};

/** Comparison table: index of the first plan (0–3) that includes each feature. */
export const comparison: { feature: string; from: number }[] = [
  { feature: "Premium design", from: 0 },
  { feature: "Mobile responsive", from: 0 },
  { feature: "Contact form", from: 0 },
  { feature: "WhatsApp integration", from: 0 },
  { feature: "Basic SEO", from: 0 },
  { feature: "Advanced UI/UX", from: 1 },
  { feature: "Visitor analytics", from: 1 },
  { feature: "Technical SEO structure", from: 1 },
  { feature: "SEO blog", from: 1 },
  { feature: "Advanced animations", from: 2 },
  { feature: "Brand identity setup", from: 2 },
  { feature: "Backend APIs", from: 3 },
  { feature: "Database", from: 3 },
  { feature: "Secure login", from: 3 },
  { feature: "Admin dashboard", from: 3 },
  { feature: "Payment gateway", from: 3 },
];

export const whatYouReceive = [
  { icon: "layout", title: "Business-focused design", text: "Layouts built for trust, clarity and more enquiries." },
  { icon: "smartphone", title: "Responsive build", text: "Looks and works great on phones, tablets and desktops." },
  { icon: "search", title: "SEO foundations", text: "Clean URLs, metadata and search-ready structure." },
  { icon: "gauge", title: "Speed in mind", text: "Images, layout and code planned for fast loading." },
  { icon: "shield", title: "Production setup", text: "HTTPS, secure forms, spam protection and live deployment." },
  { icon: "message", title: "Lead features", text: "Contact forms, WhatsApp, call buttons and clear calls to action." },
  { icon: "chart", title: "Analytics", text: "Visitor and conversion tracking on Business plans and above." },
  { icon: "life-buoy", title: "Launch support", text: "Help going live, plus support as agreed in your scope." },
] as const;

export const addOns = [
  { icon: "files", title: "Extra pages", text: "Service, location, landing or legal pages and new sections.", badge: "Quoted by scope" },
  { icon: "search", title: "Advanced SEO", text: "Keyword mapping, structured data, internal links and audits.", badge: "Quoted separately" },
  { icon: "wrench", title: "Ongoing maintenance", text: "Updates, monitoring, fixes and improvements after launch.", badge: "Monthly or per task" },
  { icon: "palette", title: "Logo & brand identity", text: "Logo refinement, colours, typography and brand guidelines.", badge: "Quoted separately" },
  { icon: "layout-dashboard", title: "Admin dashboard or CMS", text: "Content management, lead handling and internal tools.", badge: "Custom estimate" },
  { icon: "plug", title: "Custom integrations", text: "CRM, payments, bookings, email, analytics, AI or any API.", badge: "Custom estimate" },
] as const;

export const priceFactors = [
  { title: "Number of pages", text: "More pages mean more design, content structure, testing and SEO." },
  { title: "Design complexity", text: "Custom layouts, illustrations, animations and brand work add scope." },
  { title: "Functionality", text: "Logins, dashboards, payments, bookings and calculators need more engineering." },
  { title: "Content & languages", text: "Copywriting, rewriting and multilingual pages can change the estimate." },
  { title: "Integrations", text: "Connecting CRMs, APIs, payments, email or automation affects pricing." },
  { title: "Timeline", text: "Urgent delivery, phased launches or long approval cycles can change cost." },
];

export const projectTerms = [
  { icon: "wallet", title: "Payment schedule", text: "Confirmed in your proposal — usually milestone-based." },
  { icon: "clipboard", title: "Confirmed scope", text: "Pages, features, revisions and deliverables are agreed in writing first." },
  { icon: "calendar", title: "Timeline", text: "Depends on complexity, content readiness and feedback speed." },
  { icon: "refresh", title: "Revisions", text: "Clear revision rounds, defined by your package and scope." },
  { icon: "globe", title: "Domain & hosting", text: "Domain, hosting, email and paid tools may be billed separately." },
  { icon: "headset", title: "After launch", text: "Included support and maintenance options are confirmed upfront." },
] as const;

export const beyondTags = ["Web applications", "Mobile apps", "AI systems", "Admin dashboards", "APIs", "Payments", "Automation"];

export const pricingFaqs = [
  {
    q: "Are these fixed final prices?",
    a: "They are starting prices. Your final price is confirmed after we review pages, content, design, features, integrations, timeline and support needs.",
  },
  {
    q: "Which package should a small business choose?",
    a: "Starter is ideal for a professional online presence. Choose Business if you need more pages, analytics, a blog, stronger SEO or integrations.",
  },
  {
    q: "Why does Enterprise start at ₹69,999+?",
    a: "Enterprise apps can include APIs, databases, logins, dashboards, payments and custom workflows — so the price depends on the system you need.",
  },
  {
    q: "Are domain and hosting included?",
    a: "Deployment help is included. Domain registration, hosting plans, email services and paid licences may be billed separately.",
  },
  {
    q: "Is content writing included?",
    a: "We can use the content you provide. Copywriting, SEO content, rewriting and multilingual pages can be quoted separately.",
  },
  {
    q: "Can I add features after launch?",
    a: "Yes. New pages, integrations, SEO, dashboards, automation, AI, bookings or payments can be added later with a new scope.",
  },
  {
    q: "Do you offer maintenance?",
    a: "Yes — as a monthly plan or per task, covering updates, monitoring, fixes and improvements.",
  },
  {
    q: "Can you build something outside these packages?",
    a: "Absolutely. Packages cover common needs, but we prepare custom proposals for any website, portal, SaaS product or business system.",
  },
];
