import { services } from "@/content/services";
import { serviceTints } from "@/components/service-visual";

export type NavChild = { label: string; href: string; description?: string; icon?: string; tint?: string };
export type NavItem = { label: string; href: string; children?: NavChild[]; featured?: NavChild };

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: services.map((s) => ({ label: s.title, href: `/services/${s.slug}`, description: s.short, icon: s.icon, tint: serviceTints[s.slug] })),
  },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Student Projects",
    href: "/student-projects",
    children: [
      { label: "All Projects", href: "/student-projects", description: "Browse by category, stack, difficulty and format.", icon: "grid", tint: "var(--accent)" },
      { label: "Software Projects", href: "/student-projects?category=software", description: "Python, web, AI and data projects.", icon: "code", tint: "var(--accent)" },
      { label: "Hardware Projects", href: "/student-projects?category=hardware", description: "Arduino, ESP32 and Raspberry Pi builds.", icon: "cpu", tint: "var(--accent)" },
      { label: "IoT & Robotics", href: "/student-projects?category=iot-robotics", description: "Connected devices and smart robots.", icon: "wifi", tint: "var(--accent-2)" },
      { label: "AI / ML Projects", href: "/student-projects?category=ai-ml", description: "Machine learning and computer vision.", icon: "brain", tint: "var(--accent)" },
      { label: "Free Projects", href: "/student-projects?price=free", description: "Start learning at no cost.", icon: "gift", tint: "var(--accent)" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Blog & Insights", href: "/resources/blog", description: "Practical articles for business decision-makers.", icon: "newspaper", tint: "var(--accent)" },
      { label: "Business & Technology Guides", href: "/resources/guides", description: "Step-by-step planning guides.", icon: "book", tint: "var(--accent-2)" },
      { label: "Case Studies", href: "/resources/case-studies", description: "Real challenges and verified outcomes.", icon: "folder", tint: "var(--accent)" },
      { label: "FAQs", href: "/resources/faqs", description: "Pricing, delivery, ownership and support.", icon: "help", tint: "var(--accent)" },
    ],
  },
  { label: "Our Work", href: "/our-work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { heading: string; links: NavChild[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Services", href: "/services" },
      { label: "Pricing", href: "/pricing" },
      { label: "Products", href: "/products" },
      { label: "Student Projects", href: "/student-projects" },
      { label: "Our Work", href: "/our-work" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Blog & Insights", href: "/resources/blog" },
      { label: "Business Guides", href: "/resources/guides" },
      { label: "Case Studies", href: "/resources/case-studies" },
      { label: "FAQs", href: "/resources/faqs" },
    ],
  },
  { heading: "Company", links: [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }] },
  {
    heading: "Support",
    links: [
      { label: "Help Centre", href: "/support" },
      { label: "My Account", href: "/account" },
      { label: "My Downloads", href: "/account/downloads" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Refund Policy", href: "/legal/refunds" },
      { label: "Project Licensing", href: "/legal/licensing" },
      { label: "Cookies", href: "/legal/cookies" },
    ],
  },
];
