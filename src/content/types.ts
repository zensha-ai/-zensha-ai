export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  number: string;
  title: string;
  /** One-line description for menus and cards. */
  short: string;
  headline: string;
  intro: string;
  challenge: string;
  solution: string;
  capabilities: string[];
  useCases: string[];
  audience: string;
  process: string[];
  /** Technologies that MAY be used — never a claim of past commercial delivery. */
  technologies: string[];
  technologyNote: string;
  outcome: string;
  faqs: Faq[];
  related: string[];
  cta: { heading: string; text: string; label: string };
  seo: { title: string; description: string };
  icon: string;
};

export type ProductCategory = "ai-products" | "business-software" | "automation-tools";
export type AvailabilityStatus = "available" | "beta" | "coming_soon";

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  status: AvailabilityStatus;
  is_example: boolean;
  story: string | null;
  problem: string | null;
  solution: string | null;
  features: { title: string; description: string }[];
  how_it_works: string[];
  use_cases: string[];
  integrations: string[];
  architecture: string | null;
  security: string | null;
  pricing: string | null;
  demo_url: string | null;
  demo_video_url: string | null;
  hero_image_url: string | null;
  faqs: Faq[];
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  updated_at: string;
};

export type StudentCategory = "software" | "hardware" | "iot-robotics" | "ai-ml";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type DeliveryType = "digital" | "physical_kit" | "digital_and_kit";

export type StudentProject = {
  id: string;
  slug: string;
  title: string;
  demonstrates: string;
  summary: string;
  category: StudentCategory;
  difficulty: Difficulty;
  delivery_type: DeliveryType;
  stack: string[];
  price_paise: number;
  kit_price_paise: number | null;
  is_free: boolean;
  is_example: boolean;
  demo_video_url: string | null;
  demo_gif_url: string | null;
  demo_caption: string | null;
  cover_image_url: string | null;
  features: { title: string; description: string }[];
  learning_objectives: string[];
  how_it_works: string | null;
  components: string[];
  circuit_diagram_url: string | null;
  setup_guide: string[];
  package_contents: string[];
  documentation_notes: string | null;
  license: string | null;
  support: string | null;
  shipping_terms: string | null;
  faqs: Faq[];
  published: boolean;
  updated_at: string;
};

export type ArticleKind = "blog" | "guide" | "case_study";

export type Article = {
  id: string;
  slug: string;
  kind: ArticleKind;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  cover_image_url: string | null;
  read_minutes: number;
  published_at: string | null;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

export type WorkItem = {
  id: string;
  slug: string;
  title: string;
  /** company = verified ZENSHA AI client work; founder = personal portfolio. */
  kind: "company" | "founder";
  client: string | null;
  industry: string | null;
  project_type: string;
  year: string | null;
  summary: string;
  challenge: string | null;
  approach: string | null;
  solution: string | null;
  features: string[];
  technologies: string[];
  outcome: string | null;
  demo_url: string | null;
  cover_image_url: string | null;
  published: boolean;
};
