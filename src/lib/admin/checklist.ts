import "server-only";
import { brand } from "@/config/brand";
import { isPaymentsConfigured, isServiceRoleConfigured, publicEnv, serverEnv } from "@/lib/env";

export type ChecklistItem = { label: string; detail: string; status: "done" | "outstanding" | "manual" };

/** Outstanding external dependencies before public launch, computed from env where possible. */
export function launchChecklist(): ChecklistItem[] {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  return [
    {
      label: "Brand, company-name & trademark clearance",
      detail: `“${brand.brandName}” is a working brand. Other Indian entities use “Zensha”; professional screening is required before launch.`,
      status: "manual",
    },
    {
      label: "Production domain",
      detail: siteUrl && !siteUrl.includes("localhost") ? `NEXT_PUBLIC_SITE_URL = ${siteUrl}` : "Set NEXT_PUBLIC_SITE_URL to the cleared, owned domain.",
      status: siteUrl && !siteUrl.includes("localhost") ? "done" : "outstanding",
    },
    {
      label: "Business contact details",
      detail: [
        brand.contact.email ? "email ✓" : "NEXT_PUBLIC_CONTACT_EMAIL missing",
        brand.contact.whatsapp ? "WhatsApp ✓" : "NEXT_PUBLIC_CONTACT_WHATSAPP missing",
        brand.contact.location ? "location ✓" : "location optional",
        brand.contact.hours ? "hours ✓" : "hours optional",
      ].join(" · "),
      status: brand.contact.email && brand.contact.whatsapp ? "done" : "outstanding",
    },
    {
      label: "Database & service role",
      detail: isServiceRoleConfigured() ? "Supabase URL, anon key and service-role key configured." : "Configure Supabase env vars and run migrations.",
      status: isServiceRoleConfigured() ? "done" : "outstanding",
    },
    {
      label: "Payments (Razorpay)",
      detail: isPaymentsConfigured()
        ? "Keys, webhook secret and PAYMENTS_ENABLED=true are set. Test a live ₹1 order end to end."
        : [
            publicEnv.razorpayKeyId ? "key id ✓" : "NEXT_PUBLIC_RAZORPAY_KEY_ID missing",
            serverEnv.razorpayKeySecret ? "secret ✓" : "RAZORPAY_KEY_SECRET missing",
            serverEnv.razorpayWebhookSecret ? "webhook secret ✓" : "RAZORPAY_WEBHOOK_SECRET missing",
            process.env.PAYMENTS_ENABLED === "true" ? "enabled ✓" : "PAYMENTS_ENABLED not true",
          ].join(" · "),
      status: isPaymentsConfigured() ? "done" : "outstanding",
    },
    {
      label: "Rate-limit IP hashing salt",
      detail: serverEnv.ipHashSalt ? "IP_HASH_SALT set." : "Set IP_HASH_SALT to a long random string.",
      status: serverEnv.ipHashSalt ? "done" : "outstanding",
    },
    {
      label: "Legal review",
      detail: "Privacy, Terms, Refund, Licensing and Cookie pages are drafts and need review against actual operations and applicable law.",
      status: "manual",
    },
    {
      label: "Founder employment details approved",
      detail: "NEXT_PUBLIC_PUBLISH_FOUNDER_EMPLOYMENT=true once employer names, titles and dates are approved for publication.",
      status: brand.publish.founderEmployment ? "done" : "outstanding",
    },
    {
      label: "Founder portfolio projects approved",
      detail: "NEXT_PUBLIC_PUBLISH_FOUNDER_PORTFOLIO=true once confidentiality and publication rights are confirmed.",
      status: brand.publish.founderPortfolio ? "done" : "outstanding",
    },
    {
      label: "Real catalogue content",
      detail: "Add actual products, student project packages (files, demos, components, licences) and permissioned portfolio work.",
      status: "manual",
    },
  ];
}
