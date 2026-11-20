import "server-only";
import type { Field } from "./fields";

export type ListColumn = {
  key: string;
  label: string;
  kind?: "text" | "published" | "money" | "date" | "badge" | "bool";
};

export type ResourceConfig = {
  key: string;
  label: string;
  singular: string;
  description: string;
  table: string;
  /** Primary key column used in URLs. */
  idColumn: "id" | "slug";
  /** When set, fields (other than `topLevel`) are stored inside this jsonb column. */
  jsonbColumn?: string;
  topLevel?: string[];
  titleField: string;
  fields: Field[];
  listColumns: ListColumn[];
  orderBy: { column: string; ascending: boolean };
  /** Extra cross-field validation. Return {field: message}. */
  refine?: (d: Record<string, unknown>) => Record<string, string>;
  /** Final adjustments to the row before saving. */
  beforeSave?: (row: Record<string, unknown>) => Record<string, unknown>;
  /** Public paths to revalidate after a mutation. */
  revalidate: (row: Record<string, unknown>) => string[];
  hasExampleFlag?: boolean;
  /** Text shown above the form (editorial rules). */
  editorialNote?: string;
};

const published: Field = { name: "published", label: "Published", type: "boolean", help: "Only published items appear on the public site.", section: "Publishing" };

const seoFields: Field[] = [
  { name: "seo_title", label: "SEO title", type: "text", max: 70, section: "SEO", help: "Optional. Up to ~60 characters." },
  { name: "seo_description", label: "SEO description", type: "textarea", max: 200, help: "Optional. Up to ~155 characters." },
];

const articleKindPath: Record<string, string> = { blog: "blog", guide: "guides", case_study: "case-studies" };

export const resources: Record<string, ResourceConfig> = {
  services: {
    key: "services",
    label: "Services",
    singular: "service",
    description: "The 11 service pages. Seed from code first, then edit here; the database overrides the code copy.",
    table: "services",
    idColumn: "slug",
    jsonbColumn: "data",
    topLevel: ["position", "published"],
    titleField: "title",
    orderBy: { column: "position", ascending: true },
    listColumns: [
      { key: "number", label: "No." },
      { key: "title", label: "Title" },
      { key: "slug", label: "Slug" },
      { key: "published", label: "Status", kind: "published" },
    ],
    editorialNote:
      "Describe capabilities honestly. Technologies are tools that MAY be used — do not claim past commercial delivery that has not happened.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, section: "Identity", half: true },
      { name: "slug", label: "Slug", type: "slug", required: true, half: true, help: "URL: /services/<slug>" },
      { name: "number", label: "Number", type: "text", required: true, max: 4, half: true, help: "Display index, e.g. 01" },
      { name: "icon", label: "Icon name", type: "text", half: true, help: "lucide icon name, e.g. database" },
      { name: "position", label: "Sort position", type: "number", required: true, half: true, defaultValue: "0" },
      { name: "short", label: "Short description", type: "text", required: true, max: 200, help: "Used in menus and cards." },
      { name: "headline", label: "Hero headline", type: "text", required: true, section: "Page copy" },
      { name: "intro", label: "Hero introduction", type: "textarea", required: true },
      { name: "challenge", label: "The challenge", type: "textarea", required: true },
      { name: "solution", label: "How we help", type: "textarea", required: true },
      { name: "capabilities", label: "What we can build", type: "string-list", required: true, help: "One per line." },
      { name: "useCases", label: "Use cases", type: "string-list", help: "One per line." },
      { name: "audience", label: "Who it is for", type: "textarea", required: true },
      { name: "process", label: "Process steps", type: "string-list", required: true, help: "One per line." },
      { name: "technologies", label: "Technologies", type: "string-list", help: "One per line." },
      { name: "technologyNote", label: "Technology note", type: "textarea" },
      { name: "outcome", label: "The outcome", type: "textarea", required: true },
      { name: "faqs", label: "FAQs", type: "faq-list", help: "One per line: Question :: Answer" },
      { name: "related", label: "Related service slugs", type: "string-list", help: "One slug per line." },
      { name: "cta.heading", label: "CTA heading", type: "text", required: true, section: "Call to action" },
      { name: "cta.text", label: "CTA text", type: "textarea", required: true },
      { name: "cta.label", label: "CTA button label", type: "text", required: true, max: 60 },
      { name: "seo.title", label: "SEO title", type: "text", required: true, max: 80, section: "SEO" },
      { name: "seo.description", label: "SEO description", type: "textarea", required: true, max: 220 },
      published,
    ],
    revalidate: (r) => ["/", "/services", `/services/${r.slug}`, "/sitemap.xml"],
  },

  products: {
    key: "products",
    label: "Products",
    singular: "product",
    description: "Software and AI products. Only publish real products with verified features and availability.",
    table: "products",
    idColumn: "id",
    titleField: "name",
    hasExampleFlag: true,
    orderBy: { column: "updated_at", ascending: false },
    listColumns: [
      { key: "name", label: "Name" },
      { key: "category", label: "Category", kind: "badge" },
      { key: "status", label: "Availability", kind: "badge" },
      { key: "published", label: "Status", kind: "published" },
    ],
    editorialNote:
      "Do not publish hypothetical product names, screenshots, performance claims or availability labels as though they are real. Use “Request Pricing” when prices are not final.",
    fields: [
      { name: "name", label: "Product name", type: "text", required: true, section: "Identity", half: true },
      { name: "slug", label: "Slug", type: "slug", required: true, half: true, help: "URL: /products/<slug>" },
      { name: "tagline", label: "One-sentence benefit", type: "text", required: true, max: 200 },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        half: true,
        options: [
          { value: "ai-products", label: "AI Products" },
          { value: "business-software", label: "Business Software" },
          { value: "automation-tools", label: "Automation Tools" },
        ],
      },
      {
        name: "status",
        label: "Verified availability",
        type: "select",
        required: true,
        half: true,
        options: [
          { value: "available", label: "Available" },
          { value: "beta", label: "Beta" },
          { value: "coming_soon", label: "Coming soon" },
        ],
      },
      { name: "is_example", label: "Example content (not a real product)", type: "boolean", help: "Shown with an EXAMPLE label; never sold." },
      { name: "story", label: "Product story", type: "textarea", section: "Story" },
      { name: "problem", label: "The problem", type: "textarea" },
      { name: "solution", label: "The solution", type: "textarea" },
      { name: "features", label: "Key features", type: "feature-list", help: "One per line: Feature :: benefit. Verified features only." },
      { name: "how_it_works", label: "How it works", type: "string-list", help: "One step per line." },
      { name: "use_cases", label: "Use cases", type: "string-list" },
      { name: "integrations", label: "Integrations", type: "string-list", help: "Verified integrations only." },
      { name: "architecture", label: "Architecture overview", type: "markdown", section: "Technology & trust" },
      { name: "security", label: "Security & privacy", type: "markdown" },
      { name: "pricing", label: "Plans & pricing", type: "markdown", help: "Actual prices, billing, limits, trials and refunds — or leave empty for “Request Pricing”." },
      { name: "demo_url", label: "Demo URL", type: "url", section: "Media" },
      { name: "demo_video_url", label: "Demo video URL", type: "url" },
      { name: "hero_image_url", label: "Hero image URL", type: "url", help: "Upload in Media, then paste the URL." },
      { name: "faqs", label: "FAQs", type: "faq-list", help: "One per line: Question :: Answer" },
      ...seoFields,
      published,
    ],
    refine: (d): Record<string, string> =>
      d.published && d.is_example ? { published: "Example products cannot be published. Untick “Example content” once it is real." } : {},
    revalidate: (r) => ["/", "/products", `/products/${r.slug}`, "/sitemap.xml"],
  },

  student_projects: {
    key: "student_projects",
    label: "Student projects",
    singular: "student project",
    description: "Educational project packages. Clearly separate digital downloads from physical kits.",
    table: "student_projects",
    idColumn: "id",
    titleField: "title",
    hasExampleFlag: true,
    orderBy: { column: "updated_at", ascending: false },
    listColumns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category", kind: "badge" },
      { key: "delivery_type", label: "Delivery", kind: "badge" },
      { key: "price_paise", label: "Price", kind: "money" },
      { key: "published", label: "Status", kind: "published" },
    ],
    editorialNote:
      "Packages are learning materials. Never present purchased work as a substitute for a student’s own academic work. List exact package contents, licence and support scope.",
    fields: [
      { name: "title", label: "Project title", type: "text", required: true, section: "Identity", half: true },
      { name: "slug", label: "Slug", type: "slug", required: true, half: true, help: "URL: /student-projects/<slug>" },
      { name: "demonstrates", label: "What it demonstrates", type: "text", required: true, max: 200 },
      { name: "summary", label: "Quick overview", type: "textarea", required: true, max: 1000 },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        half: true,
        options: [
          { value: "software", label: "Software" },
          { value: "hardware", label: "Hardware" },
          { value: "iot-robotics", label: "IoT & Robotics" },
          { value: "ai-ml", label: "AI / ML" },
        ],
      },
      {
        name: "difficulty",
        label: "Difficulty",
        type: "select",
        required: true,
        half: true,
        options: [
          { value: "beginner", label: "Beginner" },
          { value: "intermediate", label: "Intermediate" },
          { value: "advanced", label: "Advanced" },
        ],
      },
      { name: "stack", label: "Technology stack", type: "string-list", help: "Languages, frameworks, boards, sensors — one per line." },
      { name: "is_example", label: "Example content (not for sale)", type: "boolean" },
      {
        name: "delivery_type",
        label: "Delivery type",
        type: "select",
        required: true,
        section: "Pricing & delivery",
        options: [
          { value: "digital", label: "Digital download only" },
          { value: "physical_kit", label: "Physical kit only" },
          { value: "digital_and_kit", label: "Digital download + optional physical kit" },
        ],
      },
      { name: "is_free", label: "Free project", type: "boolean", help: "Free projects must have a price of ₹0." },
      { name: "price_paise", label: "Digital package price (₹)", type: "money", required: true, half: true, defaultValue: "0" },
      { name: "kit_price_paise", label: "Physical kit price (₹)", type: "money", half: true, help: "Required when a kit is offered." },
      { name: "shipping_terms", label: "Shipping terms", type: "textarea", help: "Required before publishing anything with a physical kit." },
      { name: "license", label: "Licence", type: "textarea", help: "Permitted use, redistribution and attribution." },
      { name: "support", label: "Support scope", type: "textarea" },
      { name: "demo_video_url", label: "Demo video URL", type: "url", section: "Demonstration" },
      { name: "demo_gif_url", label: "Demo GIF URL", type: "url" },
      { name: "demo_caption", label: "Demo caption", type: "text", help: "What exactly is demonstrated." },
      { name: "cover_image_url", label: "Cover image URL", type: "url" },
      { name: "circuit_diagram_url", label: "Circuit diagram URL", type: "url" },
      { name: "features", label: "Key features", type: "feature-list", section: "Learning content", help: "One per line: Feature :: explanation" },
      { name: "learning_objectives", label: "Learning objectives", type: "string-list" },
      { name: "how_it_works", label: "How it works", type: "markdown", help: "Inputs, processing, outputs." },
      { name: "components", label: "Hardware components", type: "string-list", help: "State whether each is included." },
      { name: "setup_guide", label: "Setup guide steps", type: "string-list" },
      { name: "package_contents", label: "Package contents", type: "string-list", help: "Every file and item, individually." },
      { name: "documentation_notes", label: "Documentation notes", type: "markdown" },
      { name: "faqs", label: "FAQs", type: "faq-list", help: "One per line: Question :: Answer" },
      published,
    ],
    refine: (d) => {
      const e: Record<string, string> = {};
      if (d.is_free && (d.price_paise as number) !== 0) e.price_paise = "Free projects must have a price of ₹0.";
      if (!d.is_free && d.published && d.delivery_type !== "physical_kit" && !((d.price_paise as number) > 0))
        e.price_paise = "Set a price, or mark the project as free.";
      if (d.delivery_type !== "digital" && d.published && !d.shipping_terms)
        e.shipping_terms = "Shipping terms are required before publishing a project with a physical kit.";
      if (d.delivery_type !== "digital" && d.published && d.kit_price_paise == null)
        e.kit_price_paise = "Set the kit price before publishing a project with a physical kit.";
      if (d.published && d.is_example) e.published = "Example projects cannot be published. Untick “Example content” once it is real.";
      if (d.published && !(d.package_contents as string[])?.length) e.package_contents = "List the package contents before publishing.";
      return e;
    },
    beforeSave: (r) => (r.delivery_type === "digital" ? { ...r, kit_price_paise: null } : r),
    revalidate: (r) => ["/", "/student-projects", `/student-projects/${r.slug}`, "/sitemap.xml"],
  },

  categories: {
    key: "categories",
    label: "Categories",
    singular: "category",
    description: "Optional category descriptions for products, student projects and articles.",
    table: "categories",
    idColumn: "id",
    titleField: "name",
    orderBy: { column: "position", ascending: true },
    listColumns: [
      { key: "name", label: "Name" },
      { key: "domain", label: "Domain", kind: "badge" },
      { key: "slug", label: "Slug" },
    ],
    fields: [
      {
        name: "domain",
        label: "Applies to",
        type: "select",
        required: true,
        options: [
          { value: "product", label: "Products" },
          { value: "student_project", label: "Student projects" },
          { value: "article", label: "Articles" },
        ],
      },
      { name: "name", label: "Name", type: "text", required: true, half: true },
      { name: "slug", label: "Slug", type: "slug", required: true, half: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "position", label: "Sort position", type: "number", required: true, defaultValue: "0" },
    ],
    revalidate: () => ["/products", "/student-projects", "/resources"],
  },

  articles: {
    key: "articles",
    label: "Articles, guides & case studies",
    singular: "article",
    description: "Business-audience resources. Student tutorials belong inside Student Projects.",
    table: "articles",
    idColumn: "id",
    titleField: "title",
    orderBy: { column: "updated_at", ascending: false },
    listColumns: [
      { key: "title", label: "Title" },
      { key: "kind", label: "Type", kind: "badge" },
      { key: "published_at", label: "Published", kind: "date" },
      { key: "published", label: "Status", kind: "published" },
    ],
    editorialNote:
      "Case studies must describe real projects with client permission; include metrics only when substantiated and approved. Add references where factual claims need support.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, section: "Identity" },
      { name: "slug", label: "Slug", type: "slug", required: true, half: true },
      {
        name: "kind",
        label: "Type",
        type: "select",
        required: true,
        half: true,
        options: [
          { value: "blog", label: "Blog & Insights" },
          { value: "guide", label: "Business & Technology Guide" },
          { value: "case_study", label: "Case Study" },
        ],
      },
      { name: "category", label: "Category", type: "text", required: true, half: true, defaultValue: "General" },
      { name: "read_minutes", label: "Read time (minutes)", type: "number", required: true, half: true, defaultValue: "5" },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true, max: 400 },
      { name: "body", label: "Body (Markdown)", type: "markdown", required: true, section: "Content", help: "Open with a direct answer; close with a relevant next action." },
      { name: "cover_image_url", label: "Cover image URL", type: "url" },
      ...seoFields,
      { name: "published_at", label: "Publish date", type: "date", section: "Publishing", help: "Defaults to today when published." },
      { ...published, section: undefined },
    ],
    beforeSave: (r) => (r.published && !r.published_at ? { ...r, published_at: new Date().toISOString() } : r),
    revalidate: (r) => {
      const base = `/resources/${articleKindPath[String(r.kind)] ?? "blog"}`;
      return ["/", "/resources", base, `${base}/${r.slug}`, "/sitemap.xml"];
    },
  },

  work_items: {
    key: "work_items",
    label: "Our Work",
    singular: "work item",
    description: "Portfolio. Keep verified ZENSHA AI client work separate from the founder’s personal technical portfolio.",
    table: "work_items",
    idColumn: "id",
    titleField: "title",
    orderBy: { column: "updated_at", ascending: false },
    listColumns: [
      { key: "title", label: "Title" },
      { key: "kind", label: "Type", kind: "badge" },
      { key: "year", label: "Year" },
      { key: "published", label: "Status", kind: "published" },
    ],
    editorialNote:
      "Company work: publish only with client permission; list only verified technologies and substantiated, approved outcomes. Founder work: personal projects — never present as company client engagements or employer endorsements.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, section: "Identity", half: true },
      { name: "slug", label: "Slug", type: "slug", required: true, half: true },
      {
        name: "kind",
        label: "Type",
        type: "select",
        required: true,
        half: true,
        options: [
          { value: "company", label: "Verified company client project" },
          { value: "founder", label: "Founder’s technical portfolio" },
        ],
      },
      { name: "project_type", label: "Project type", type: "text", required: true, half: true, help: "e.g. Website, Automation" },
      { name: "client", label: "Client / project name", type: "text", half: true },
      { name: "industry", label: "Industry", type: "text", half: true },
      { name: "year", label: "Year", type: "text", max: 20, half: true },
      { name: "summary", label: "Summary", type: "textarea", required: true, section: "Story" },
      { name: "challenge", label: "The challenge", type: "textarea" },
      { name: "approach", label: "Our approach", type: "textarea" },
      { name: "solution", label: "The solution", type: "textarea" },
      { name: "features", label: "Delivered capabilities", type: "string-list" },
      { name: "technologies", label: "Verified technologies", type: "string-list" },
      { name: "outcome", label: "Outcome", type: "textarea", help: "Observable results; metrics only when substantiated and approved." },
      { name: "demo_url", label: "Demo URL", type: "url", section: "Media" },
      { name: "cover_image_url", label: "Cover image URL", type: "url" },
      published,
    ],
    revalidate: (r) => ["/", "/our-work", `/our-work/${r.slug}`, "/sitemap.xml"],
  },

  faqs: {
    key: "faqs",
    label: "FAQs",
    singular: "FAQ",
    description: "General and audience-specific questions. Seed general FAQs from code on the dashboard.",
    table: "faqs",
    idColumn: "id",
    titleField: "question",
    orderBy: { column: "position", ascending: true },
    listColumns: [
      { key: "question", label: "Question" },
      { key: "scope", label: "Scope", kind: "badge" },
      { key: "published", label: "Status", kind: "published" },
    ],
    fields: [
      {
        name: "scope",
        label: "Scope",
        type: "select",
        required: true,
        half: true,
        options: [
          { value: "general", label: "General (Resources → FAQs)" },
          { value: "students", label: "Student projects" },
          { value: "products", label: "Products" },
          { value: "support", label: "Help centre" },
        ],
      },
      { name: "position", label: "Sort position", type: "number", required: true, half: true, defaultValue: "0" },
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", required: true, max: 3000 },
      published,
    ],
    revalidate: () => ["/", "/resources/faqs", "/support", "/student-projects", "/products"],
  },
};

export const getResource = (key: string): ResourceConfig | undefined => (Object.hasOwn(resources, key) ? resources[key] : undefined);
