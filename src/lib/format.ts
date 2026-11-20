export const formatINR = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: paise % 100 ? 2 : 0 }).format(
    paise / 100,
  );

export const formatDate = (iso: string | null | undefined) =>
  iso ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso)) : "";

export const labels = {
  productCategory: {
    "ai-products": "AI Products",
    "business-software": "Business Software",
    "automation-tools": "Automation Tools",
  },
  status: { available: "Available", beta: "In beta", coming_soon: "Coming soon" },
  studentCategory: {
    software: "Software",
    hardware: "Hardware",
    "iot-robotics": "IoT & Robotics",
    "ai-ml": "AI / ML",
  },
  difficulty: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
  delivery: {
    digital: "Digital download",
    physical_kit: "Physical kit",
    digital_and_kit: "Download + optional kit",
  },
} as const;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
