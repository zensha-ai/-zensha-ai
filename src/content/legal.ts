import { brand } from "@/config/brand";

const B = brand.brandName;

/**
 * DRAFT legal content. Every page renders a prominent "pending legal review"
 * notice. These drafts describe what the site actually does today and must be
 * reviewed against real business operations, payment terms and applicable law
 * (including India's DPDP Act 2023 and consumer-protection e-commerce rules)
 * before launch.
 */
export type LegalDoc = { slug: string; title: string; summary: string; body: string };

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "What information is collected, why, how long it is kept, your rights and how to contact us.",
    body: `## Who we are
${B} ("we") operates this website. Legal entity name, registered address and grievance officer details: [TO BE CONFIRMED].

## Information we collect
- **Enquiries:** name, email, optional phone and company, the service you are interested in, optional budget and timeline, and your message.
- **Accounts:** name, email address and an encrypted password managed by our authentication provider.
- **Orders:** billing name, email, optional phone, shipping address (only for physical kits), items purchased and payment status. Card and UPI details are handled by the payment provider and are never stored by us.
- **Security data:** a one-way hash of your IP address for rate limiting and spam prevention, and a record of file downloads tied to your account.

## Why we use it
To respond to enquiries, provide accounts, fulfil orders and downloads, prevent abuse, and meet legal obligations.

## Service providers
We use hosting, database/authentication and payment providers to run the site. [LIST PROVIDERS AND REGIONS BEFORE LAUNCH].

## Retention
[DEFINE RETENTION PERIODS FOR ENQUIRIES, ACCOUNTS AND ORDERS].

## Your rights
You may request access to, correction of, or deletion of your personal data, subject to legal retention requirements. Contact: [BUSINESS EMAIL].

## Cookies
See the [Cookie Notice](/legal/cookies).`,
  },
  {
    slug: "terms",
    title: "Terms of Service",
    summary: "Use of the website, services and platform responsibilities.",
    body: `## Using this website
By using this website you agree to these terms. If you do not agree, please do not use the site.

## Services
Information about services is general. Scope, deliverables, timelines, pricing, ownership and support for any engagement are defined in a separate written proposal or agreement.

## Accounts
You are responsible for keeping your login credentials secure and for activity under your account.

## Digital products and student projects
Purchases are licensed, not sold, under the [Student Project License](/legal/licensing). Materials are for learning and legitimate project development. Purchasing does not guarantee academic approval or results.

## Acceptable use
Do not attempt to access other users' data, bypass download protections, redistribute paid files, or disrupt the service.

## Liability
[LIMITATION OF LIABILITY CLAUSE — TO BE DRAFTED BY COUNSEL].

## Governing law
[JURISDICTION — TO BE CONFIRMED].`,
  },
  {
    slug: "refunds",
    title: "Refund & Cancellation Policy",
    summary: "Separate rules for services, digital downloads and physical items.",
    body: `## Services
Cancellation and refund terms for service engagements are set out in each project agreement.

## Digital downloads
[DEFINE POLICY — e.g. refunds considered when files are defective or materially different from the listed package contents and the issue cannot be resolved by support].

## Physical kits
[DEFINE SHIPPING, DAMAGE, RETURN AND REFUND WINDOWS] — physical kits are only sold where separate shipping terms are shown on the product page.

## Failed payments
If your payment did not complete but you believe you were charged, contact support with your order reference. We verify payment status directly with the payment provider.

## How to request
Use [Student Project Support](/support#project-support) with your order reference.`,
  },
  {
    slug: "licensing",
    title: "Student Project License",
    summary: "Permitted use, redistribution restrictions and attribution requirements.",
    body: `## Permitted use
You may use, study, modify and build upon purchased or free project materials for personal learning, experimentation and legitimate project development.

## Not permitted
- Redistributing, reselling, sharing or publicly uploading the files (in original or modified form).
- Presenting the materials as your own original work where your institution requires original work.

## Academic integrity
Students should understand, adapt and acknowledge sources as required by their institution. Purchased work is not a substitute for your own academic work, and purchasing a package does not guarantee academic approval or results.

## Third-party components
Some projects include open-source libraries under their own licenses, listed in the package documentation.

## Attribution
[DEFINE ATTRIBUTION REQUIREMENT, IF ANY].`,
  },
  {
    slug: "cookies",
    title: "Cookie Notice",
    summary: "The cookies and storage this site actually uses.",
    body: `## Strictly necessary
- **Authentication cookies** (set by our authentication provider) keep you signed in. Only set when you sign in.

## Local storage
- **Cart** — the projects you add to your cart are stored in your browser until checkout.

## Analytics and tracking
No analytics or advertising trackers are currently installed. If that changes, this notice will be updated before they are enabled.`,
  },
];

export const getLegalDoc = (slug: string) => legalDocs.find((d) => d.slug === slug);
