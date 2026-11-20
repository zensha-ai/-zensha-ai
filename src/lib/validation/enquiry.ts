import { z } from "zod";

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

export const budgetOptions = ["Under ₹10,000", "₹10,000 – ₹25,000", "₹25,000 – ₹50,000", "₹50,000 – ₹1,00,000", "Above ₹1,00,000", "Not sure yet"];
export const timelineOptions = ["As soon as possible", "Within 1 month", "1–3 months", "3+ months", "Flexible"];

export const businessEnquirySchema = z.object({
  kind: z.literal("business"),
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.email("Please enter a valid email address.").max(200),
  phone: optional(30).refine((v) => !v || /^[+\d][\d\s-]{6,}$/.test(v), "Please enter a valid phone number."),
  company: optional(160),
  service: z.string().trim().min(1, "Please choose a service of interest.").max(120),
  budget: optional(60),
  timeline: optional(60),
  message: z.string().trim().min(20, "Please share at least a few sentences about your project.").max(5000),
  consent: z.literal("on", { error: "Please confirm you have read the Privacy Policy." }),
});

export const supportEnquirySchema = z.object({
  kind: z.literal("student_support"),
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.email("Please enter a valid email address.").max(200),
  order_reference: optional(80),
  service: z.string().trim().min(1, "Please enter the project name.").max(160),
  message: z.string().trim().min(20, "Please describe the problem in a little more detail.").max(5000),
  consent: z.literal("on", { error: "Please confirm you have read the Privacy Policy." }),
});

export const enquirySchema = z.discriminatedUnion("kind", [businessEnquirySchema, supportEnquirySchema]);
export type EnquiryInput = z.infer<typeof enquirySchema>;

/** Rejects submissions that are too fast (bots) or obviously stale/tampered. */
export function isPlausibleTiming(startedAt: string | null | undefined, now = Date.now()): boolean {
  const t = Number(startedAt);
  if (!Number.isFinite(t)) return false;
  const elapsed = now - t;
  return elapsed >= 3000 && elapsed <= 1000 * 60 * 60 * 24;
}
