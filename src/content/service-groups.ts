/**
 * The 11 services grouped into four capability areas for the Services page
 * (pinned showcase, hub diagram) and the category label on each service.
 */
export type ServiceGroup = {
  key: "build" | "ai" | "automate" | "grow";
  label: string;
  title: string;
  text: string;
  /** Short tags shown on the hub diagram cards. */
  tags: string[];
  services: string[];
};

export const serviceGroups: ServiceGroup[] = [
  {
    key: "build",
    label: "Build",
    title: "Websites, Apps & Software",
    text: "Websites, web apps, mobile apps and custom software — designed around your customers and engineered to stay reliable after launch.",
    tags: ["Websites", "Web apps", "Mobile"],
    services: ["website-design-development", "web-application-development", "mobile-application-development", "custom-software-development"],
  },
  {
    key: "ai",
    label: "AI",
    title: "AI Solutions & Chatbots",
    text: "Practical AI that answers customers, reads documents and supports decisions — with clear limits and a person in the loop where it matters.",
    tags: ["Assistants", "Chatbots", "Insights"],
    services: ["ai-development-intelligent-solutions", "ai-chatbot-development"],
  },
  {
    key: "automate",
    label: "Automate",
    title: "Automation & Integrations",
    text: "Connect your tools, automate the repetitive steps and reply to WhatsApp and Instagram enquiries quickly — so your team spends time on real work.",
    tags: ["Workflows", "APIs", "WhatsApp"],
    services: ["business-process-automation", "api-development-integrations", "whatsapp-instagram-automation"],
  },
  {
    key: "grow",
    label: "Grow",
    title: "Data, SEO & Marketing",
    text: "Get found on Google, measure what works and turn scattered spreadsheets into dashboards you can trust.",
    tags: ["SEO", "Dashboards", "Pipelines"],
    services: ["digital-marketing-seo", "data-engineering-analytics"],
  },
];

export const groupOf = (slug: string) => serviceGroups.find((g) => g.services.includes(slug)) ?? serviceGroups[0];
