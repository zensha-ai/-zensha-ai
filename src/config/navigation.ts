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
      { label: "All Projects", href: "/student-projects", description: "Browse by category, stack, difficulty and format.", icon: "grid", tint: "#8b9cff" },
      { label: "Software Projects", href: "/student-projects?category=software", description: "Python, web, AI and data projects.", icon: "code", tint: "#7dd3fc" },
      { label: "Hardware Projects", href: "/student-projects?category=hardware", description: "Arduino, ESP32 and Raspberry Pi builds.", icon: "cpu", tint: "#fcd34d" },
      { label: "IoT & Robotics", href: "/student-projects?category=iot-robotics", description: "Connected devices and smart robots.", icon: "wifi", tint: "#5eead4" },
      { label: "AI / ML Projects", href: "/student-projects?category=ai-ml", description: "Machine learning and computer vision.", icon: "brain", tint: "#f0abfc" },
      { label: "Free Projects", href: "/student-projects?price=free", description: "Start learning at no cost.", icon: "gift", tint: "#86efac" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Blog & Insights", href: "/resources/blog", description: "Practical articles for business decision-makers.", icon: "newspaper", tint: "#7dd3fc" },
      { label: "Business & Technology Guides", href: "/resources/guides", description: "Step-by-step planning guides.", icon: "book", tint: "#5eead4" },
      { label: "Case Studies", href: "/resources/case-studies", description: "Real challenges and verified outcomes.", icon: "folder", tint: "#fcd34d" },
      { label: "FAQs", href: "/resources/faqs", description: "Pricing, delivery, ownership and support.", icon: "help", tint: "#f0abfc" },
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
