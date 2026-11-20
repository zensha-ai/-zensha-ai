import { brand } from "@/config/brand";
import type { Faq } from "./types";

const B = brand.brandName;

/** Page-level SEO from the content document, section 10. */
export const pageSeo = {
  home: {
    title: `${B} | Websites, Software, AI & Automation`,
    description: `Explore website development, apps, AI solutions, business automation and practical student projects at ${B}.`,
  },
  services: {
    title: `IT Services & Software Development | ${B}`,
    description: "Discover web development, mobile apps, custom software, AI, integrations, data engineering and business automation services.",
  },
  products: {
    title: `AI & Business Software Products | ${B}`,
    description: "Explore software and AI tools with clear features, demonstrations and product information.",
  },
  studentProjects: {
    title: `Software, Hardware & IoT Student Projects | ${B}`,
    description: "Browse practical software, hardware, AI, IoT and robotics projects with demos and clear package details.",
  },
  resources: {
    title: `Business Technology Guides & Insights | ${B}`,
    description: "Read practical business technology guides, articles, case studies and FAQs about software, AI and automation.",
  },
  ourWork: {
    title: `Portfolio & Digital Projects | ${B}`,
    description: "Explore real website, software, AI and automation work, including project challenges and solutions.",
  },
  about: {
    title: `About ${B} | Technology With Purpose`,
    description: "Learn about our approach to websites, software, AI, automation and practical technology solutions.",
  },
  contact: {
    title: `Contact ${B} | Discuss Your Project`,
    description: "Tell us about your website, software, AI or automation project and take the next step.",
  },
} as const;

export const home = {
  eyebrow: "Build better. Work smarter. Grow confidently.",
  headline: "Technology that moves your ideas forward.",
  intro: "Websites, apps, AI and automation — designed with care and engineered to last.",
  whatWeDo: {
    heading: "What we do",
    text: "One technology partner for the digital experiences, systems and tools your business needs to move forward.",
    items: [
      {
        title: "Websites that make a strong first impression",
        text: "Modern, responsive websites built to communicate clearly, load efficiently and turn interest into enquiries.",
        href: "/services/website-design-development",
      },
      {
        title: "Applications designed around real work",
        text: "Web and mobile applications that make services, data and daily tasks easier to manage.",
        href: "/services/web-application-development",
      },
      {
        title: "AI that solves useful problems",
        text: "AI assistants, intelligent search, document workflows and practical features that support your team.",
        href: "/services/ai-development-intelligent-solutions",
      },
      {
        title: "Automation that saves time",
        text: "Connect your tools, organize customer conversations and reduce repetitive manual work.",
        href: "/services/business-process-automation",
      },
    ],
  },
  products: {
    heading: "Useful software. Built for real needs.",
    text: "Discover our growing collection of software and AI-powered tools. Each product page explains the problem it addresses, what it does, how it works and how to get started.",
  },
  data: {
    heading: "Engineering experience behind practical solutions.",
    text: "Founded by a data engineer who builds systems that stay reliable long after launch.",
  },
  students: {
    heading: "Explore. Understand. Build.",
    text: "Hands-on software, hardware and IoT projects — with clear demos, parts lists and package contents.",
  },
  why: [
    "Clear communication from planning through delivery",
    "Solutions designed around your actual goals",
    "Thoughtful user experience and maintainable development",
    "Transparent project scope and practical next steps",
  ],
  process: [
    { n: "01", title: "Discover", text: "We learn about your goals, users, challenges and priorities." },
    { n: "02", title: "Plan", text: "We define the right scope, approach and key milestones." },
    { n: "03", title: "Design & build", text: "We create, test and refine the solution with your feedback." },
    { n: "04", title: "Launch & improve", text: "We help you release, understand and maintain what has been built." },
  ],
  work: {
    heading: "Featured work",
    text: "See how thoughtful design and engineering can bring digital ideas to life. Our portfolio highlights genuine work, the challenges behind it and the solutions delivered.",
  },
  resources: {
    heading: "Fresh thinking for business owners.",
    text: "Practical guides and real case studies on websites, software, AI and automation.",
  },
  finalCta: {
    heading: "Have an idea worth building?",
    text: "Tell us the idea. We'll show you the clearest way to build it.",
  },
};

export const techExpertise = [
  { group: "Web & apps", items: ["TypeScript", "React", "Next.js", "Node.js", "React Native"] },
  { group: "Data", items: ["Python", "SQL", "PySpark", "Airflow", "Kafka"] },
  { group: "Cloud & warehouse", items: ["AWS", "GCP", "Snowflake", "BigQuery", "PostgreSQL"] },
  { group: "AI & analytics", items: ["LLM APIs", "RAG", "Computer vision", "Power BI"] },
];

export const generalFaqs: Faq[] = [
  {
    q: "What services do you offer?",
    a: "We work across websites, applications, AI, custom software, automation, integrations, data engineering and related digital solutions.",
  },
  {
    q: "How do I get a quote?",
    a: "Share your goals, key requirements and any relevant references through the contact form. We can then discuss scope and next steps.",
  },
  {
    q: "Do you offer fixed pricing?",
    a: "Pricing depends on the project. A proposal can clarify the scope, deliverables and commercial terms.",
  },
  {
    q: "How long does development take?",
    a: "The timeline depends on requirements, feedback cycles, integrations and testing. We agree on milestones before work begins.",
  },
  { q: "Will I own the finished project?", a: "Ownership, licensing and handover terms are specified in the project agreement." },
  {
    q: "Can you improve an existing website or app?",
    a: "Yes, we can review the current system and discuss feasible improvements.",
  },
  {
    q: "Do you provide maintenance?",
    a: "Support and maintenance options can be discussed and defined as part of the engagement.",
  },
  {
    q: "Can you integrate with our current software?",
    a: "We assess compatibility, API availability and security requirements before recommending an integration.",
  },
  {
    q: "How do you handle business information?",
    a: "Data access, storage and privacy arrangements are defined according to the project and applicable requirements.",
  },
  {
    q: "Can we start with a small version?",
    a: "Often, yes. We can help prioritize an initial release and plan later improvements.",
  },
];

export const resourceTopics = [
  "Website strategy and online presence",
  "AI for everyday business tasks",
  "WhatsApp and social communication automation",
  "Custom software planning and budgeting",
  "Digital marketing and SEO fundamentals",
  "Integrations, security and maintenance",
];

/** Planned editorial calendar from the content document. Not published articles. */
export const plannedArticles = {
  blog: [
    "Does Your Business Need a Website or a Web Application?",
    "Where AI Chatbots Help — and Where Human Support Still Matters",
    "A Practical Guide to WhatsApp Business Automation",
    "Five Questions to Ask Before Building Custom Software",
    "How to Prepare Your Business for a Website Redesign",
  ],
  guide: [
    "Website Project Planning Checklist",
    "How to Write a Simple Software Requirements Brief",
    "Choosing Between Custom Software and Ready-Made Tools",
    "A Beginner’s Guide to Business Workflow Automation",
    "Preparing Content and Assets for a New Website",
  ],
};

export const about = {
  eyebrow: "A practical approach to ambitious ideas",
  headline: "Useful, not complicated.",
  intro: `${B} brings design, software, AI and automation together — to build things that simply work.`,
  story: "We start with the problem — not the tools — and find the simplest reliable way forward.",
  mission:
    "To make thoughtful digital solutions more approachable for businesses and to support practical technical learning through well-documented student projects.",
  vision:
    "A future where useful software, connected systems and accessible technology help more people turn ideas into working solutions.",
  values: [
    { title: "Clarity", text: "Explain options in straightforward language." },
    { title: "Craft", text: "Care about details in design, functionality and documentation." },
    { title: "Practical innovation", text: "Use new technology when it creates real value." },
    { title: "Collaboration", text: "Build with feedback, transparency and shared goals." },
    { title: "Long-term thinking", text: "Consider maintainability and future growth from the start." },
  ],
  approach: [
    "Listen carefully.",
    "Define the scope.",
    "Build iteratively.",
    "Test thoroughly.",
    "Communicate clearly.",
    "Prepare for launch and next steps.",
  ],
  closing: "Starting something new, or improving what you have? Let’s talk.",
};

export const founder = {
  name: brand.founder.name,
  title: brand.founder.title,
  location: "Bengaluru, Karnataka, India",
  education: "B.E. in Mechatronics Engineering, Nehru Institute of Engineering and Technology, Coimbatore (2020–2024)",
  bio: [
    `With a background in Mechatronics Engineering and professional experience in data engineering and analytics, ${brand.founder.name.split(" ")[0]} brings a practical, systems-focused approach to technology. His work spans data pipelines, cloud platforms, system integration, data modeling and business intelligence. His wider engineering interests include AI, automation, software, robotics and connected systems.`,
    "Through this technology venture, the aim is to bring together practical engineering, intelligent software and accessible digital solutions—helping businesses solve real problems while making hands-on technology projects available to students.",
  ],
  strengths: ["Python", "SQL", "PySpark", "Airflow", "Kafka", "AWS", "GCP", "Snowflake", "BigQuery", "Power BI", "ETL/ELT pipelines", "Data modeling", "Cloud data platforms", "Analytics"],
  /** Personal career credentials — NOT company clients or endorsements. Shown only when brand.publish.founderEmployment is true. */
  employment: [
    { role: "Data Engineer", org: "Merchmix | Alkye", period: "Jun 2025 – Present" },
    { role: "Data Engineer", org: "Uber Ext", period: "Dec 2024 – Apr 2025" },
    { role: "Data Analyst", org: "Flipkart", period: "Sep 2023 – Dec 2024" },
  ],
  motto: "Build with purpose. Engineer for reliability. Create lasting value.",
};

/**
 * Projects from the founder's personal portfolio (verified against
 * vishnu-dataengineer.vercel.app). Personal technical work — never presented as
 * ZENSHA AI client engagements or employer endorsements. Gated by
 * brand.publish.founderPortfolio.
 */
export const founderPortfolio = [
  {
    slug: "real-time-e-commerce-intelligence-platform",
    title: "Real-Time E-Commerce Intelligence Platform",
    period: "Mar 2025 – Jun 2025",
    summary:
      "Batch and streaming ETL pipelines for e-commerce event processing, orchestrated with Airflow, with BigQuery tables optimized through partitioning and clustering and data-quality validation and monitoring checks.",
    technologies: ["GCP", "PySpark", "Dataflow", "BigQuery", "Airflow"],
  },
  {
    slug: "multi-cloud-financial-risk-fraud-detection-pipeline",
    title: "Multi-Cloud Financial Risk & Fraud Detection Pipeline",
    period: "Nov 2024 – Feb 2025",
    summary:
      "PySpark ETL workflows for transaction aggregation and reporting, integrating AWS Glue and Snowflake, with Spark jobs for batch processing.",
    technologies: ["AWS", "AWS Glue", "Snowflake", "Databricks", "PySpark"],
  },
  {
    slug: "ride-hailing-operational-intelligence-platform",
    title: "Ride-Hailing Operational Intelligence Platform",
    period: "Jul 2024 – Oct 2024",
    summary:
      "Streaming pipelines using Kafka and Spark Streaming for ride-event processing, driver and trip dataset processing, SQL and Spark optimization, and dashboards supported by BigQuery and Power BI.",
    technologies: ["Kafka", "Spark Streaming", "BigQuery", "Airflow", "Power BI"],
  },
];

export const systemMessages = {
  notFound: "This page could not be found. It may have moved or the link may be incorrect.",
  emptySearch: "No matching results yet. Try another keyword or remove a filter.",
  comingSoon: "We are preparing this experience. Check back for updates.",
  loading: "Getting things ready…",
};

export const responsibleLearningNote =
  "These materials are intended for learning, experimentation and legitimate project development. Students should understand, adapt and acknowledge sources as required by their institution. Purchasing a package does not guarantee academic approval or results, and purchased work is not a substitute for your own academic work.";
