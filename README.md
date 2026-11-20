# ZENSHA AI — Website & Platform

**Intelligence, Designed with Purpose.** · AI, Software, Data & Engineering

This README is the **complete end-to-end record** of how the ZENSHA AI website was planned, built, designed, priced, secured and launched — plus how to run, update and extend it. No secrets are stored in this file.

> **Brand status:** ZENSHA AI is a *working* brand identity. Trademark and company-name clearance are still pending (other Indian entities use "Zensha"). The name lives in one place — `src/config/brand.ts` — so it can be changed safely.

---

## Contents

1. [At a glance](#1-at-a-glance)
2. [Inputs we started from](#2-inputs-we-started-from)
3. [Phase 1 — Content audit & verification](#3-phase-1--content-audit--verification)
4. [Phase 2 — Architecture & build](#4-phase-2--architecture--build)
5. [Phase 3 — Design iterations](#5-phase-3--design-iterations)
6. [Phase 4 — Content changes](#6-phase-4--content-changes)
7. [Phase 5 — Pricing](#7-phase-5--pricing)
8. [Phase 6 — SEO](#8-phase-6--seo)
9. [Phase 7 — Infrastructure & go-live](#9-phase-7--infrastructure--go-live)
10. [Where everything lives](#10-where-everything-lives)
11. [Project structure & stack](#11-project-structure--stack)
12. [Local development](#12-local-development)
13. [How to update the site (runbook)](#13-how-to-update-the-site-runbook)
14. [Security model](#14-security-model)
15. [Open items & next steps](#15-open-items--next-steps)
16. [Commit history](#16-commit-history)

---

## 1. At a glance

| | |
|---|---|
| 🌐 **Live site** | **https://zenshaai.com** (HTTPS; `www.` and `http://` redirect to it) |
| 🔁 Vercel address | https://zensha-ai.vercel.app |
| 💻 Code | https://github.com/zensha-ai/-zensha-ai (private, branch `main`) |
| 🗄️ Database | Supabase project `zensha-ai` (Mumbai, Free plan) |
| 🚀 Hosting | Vercel team `zensha-ai`, project `zensha-ai` (Hobby/free) |
| 🌍 Domain | `zenshaai.com` registered at Hostinger |
| ✅ CI | GitHub Actions — lint, type-check, 34 unit tests, script tests, build |
| 🚢 CD | Every push to `main` auto-deploys; tests run before publishing |
| 🔐 Admin | https://zenshaai.com/admin (owner account is admin) |
| 💳 Payments | Built but **switched off** (`PAYMENTS_ENABLED=false`) |
| 🔎 Google | **Blocked for now** (`NEXT_PUBLIC_ALLOW_INDEXING=false`) |

**Status:** Live and working — all pages, contact form (saves to the database), accounts, admin, sitemap, share image, HTTPS. Payments and Google indexing are intentionally off until the owner decides.

---

## 2. Inputs we started from

| Input | What it was |
|---|---|
| `ZENSHA_AI_Final_Claude_Prompt.md` | Build brief: brand, audiences, fixed navigation, 11 services, products, student-project marketplace, resources, Our Work, About, Contact, admin, design direction, stack, security and launch rules |
| `ZENSHA_AI_Complete_Website_Content.docx` (v1.2) | Approved website copy: homepage, 11 service pages, products/student-project templates, resources, About, Contact, account pages, SEO titles, publishing checklist |
| Founder portfolio | https://vishnu-dataengineer.vercel.app/ — used to verify founder details |
| Design references (inspiration only) | airform.space, land-book (airform one), vishnexa.com, vishnexa.com/pricing, vishnexa.com/products/fashion-ai-studio. Later: land-book "Meridian" and "Kate M" (blocked by Cloudflare — could not be viewed) |
| Owner's earlier site | vishnexa.com — source of the pricing-page structure and dropdown style |
| Parallel review | The owner also used ChatGPT, which reviewed the code, fixed the admin role guard, added a Supabase key-setup script and saved contact defaults (all reviewed and kept — see Phase 7) |

---

## 3. Phase 1 — Content audit & verification

1. Extracted the full `.docx` (≈700 paragraphs) and audited every section.
2. **Confirmed the 11 services**: Website Design & Development, Web Application Development, Mobile Application Development, AI Development & Intelligent Solutions, Custom Software Development, Business Process Automation, API Development & Integrations, WhatsApp & Instagram Automation, Digital Marketing & SEO, AI Chatbot Development, Data Engineering & Analytics.
3. **Found and fixed inconsistencies** in the document:
   - Homepage "services preview" listed only 10 services (Data Engineering missing).
   - Product categories differed between the prompt and the doc → used *AI Products, Business Software, Automation Tools*.
   - The prompt required an **AI/ML** student category not in the doc → added.
   - "Mobile App Development" vs "Mobile Application Development" → aligned.
   - No old brand placeholders were found; only genuine `[BRACKETED]` placeholders remained.
4. **Verified the founder** against the portfolio: Vishnu S, Data Engineer, Bengaluru; B.E. (Mechatronics background), Nehru Institute of Engineering and Technology, Coimbatore (2020–2024); Data Engineer @ Merchmix | Alkye (Jun 2025–present), Uber Ext (Dec 2024–Apr 2025), Data Analyst @ Flipkart (Sep 2023–Dec 2024). Employer names and portfolio projects are **gated behind approval flags** (off by default).
5. Honesty rules applied throughout: no invented clients, reviews, results, products, team members, registrations or pricing; empty catalogues show honest "coming soon" states; legal pages marked **Draft — pending legal review**.

---

## 4. Phase 2 — Architecture & build

### Stack decisions
- **Next.js 16.4** (App Router, Turbopack), React 19, TypeScript, **Tailwind CSS 4**, zod, Vitest, Motion.
- **Supabase** (Postgres + RLS, Auth, Storage), **Razorpay** (gated), **Vercel** hosting.
- `cacheComponents` turned **off** (classic ISR `revalidate = 300` + `revalidatePath`) — simpler and safer with lots of auth/admin routes.

### What was built
| Area | Details |
|---|---|
| Foundation | Central brand config, design tokens, header (mega menus, mobile drawer, skip link), footer, UI primitives, safe Markdown renderer, JSON-LD helper |
| Public pages | Home, Services + 11 detail pages, Products + detail template, Student Projects + filters + detail template, Resources (Blog, Guides, Case Studies, FAQs) + article template, Our Work + case study template, About (founder profile), Contact, Support, 5 legal drafts, 404/error pages |
| Accounts & commerce | Register, login, forgot/reset password, account, orders, downloads, cart (server re-prices everything), checkout, Razorpay order + signature verification, webhook (idempotent), free-project claiming, protected downloads (60-second signed URLs) |
| Admin CMS (`/admin`) | Services, products, student projects, categories, articles, Our Work, FAQs, media, site settings, enquiries, orders, customers (roles), download permissions, protected ZIP uploads, launch checklist, "Seed services from code" |
| Database | `supabase/migrations/20261120000000_initial_schema.sql` — 17 tables, RLS on all, role-escalation guard, rate-limit function, storage buckets (`media` public, `project-files` private) |
| Tests | 34 unit tests (pricing, signatures, validation, safe redirects, content integrity, admin fields) + 3 script tests |

### Problems found during testing and fixed
1. **Invisible content** — Motion rendered hero/cards with `opacity: 0` until JavaScript loaded → switched reveals to CSS scroll-driven animations (content always visible).
2. **Soft 404s** — a `loading.tsx` made missing pages return 200 → removed; real 404s now.
3. **Auth pages pre-rendered as static** → `connection()` added to the auth layer so they always render per request.
4. **Buyers lost downloads if a project was unpublished** → added an RLS `has_entitlement()` rule so owners keep access.
5. Dev-server **stale CSS cache** (happened several times) → fixed by clearing `.next/dev` and restarting.

---

## 5. Phase 3 — Design iterations

| Step | Change |
|---|---|
| 1 | First version: warm beige "Japanese minimal" with vermilion accent |
| 2 | Owner: "colour and animation not good" → **dark "quiet console"** theme: near-black surfaces, white type, periwinkle `#8b9cff` + teal `#5eead4` accents, aurora glow, live dot-network in the hero, word-by-word headline reveal, gradient last word, cursor spotlight cards, button shine, scrolling strip |
| 3 | Headline didn't wrap (non-breaking spaces) → fixed |
| 4 | Services looked identical → **bento layout** with 11 unique animated illustrations and per-service colour tints; Data Engineering as a featured card |
| 5 | Owner wanted stronger highlight → **floating 3D cards**: gentle bob, tinted floor shadow, rotating gradient border, cursor tilt, glass glare |
| 6 | Experiment: bright light theme + toggle → **owner rejected → fully reverted** to the dark design (rule since then: no design changes without approval) |
| 7 | **Animated hero illustrations on every page** (Services orbit, Pricing ring with price in the middle, Student chip/circuit, Resources articles, Our Work dashboard, About orbits, Contact paper plane, Products stack) |
| 8 | Page heroes aligned to match the homepage exactly (pill label, size, centring, caption) |
| 9 | Headlines shortened to two lines so text sits beside the animation; heroes fit one screen at 1366×768 → 1920×1080 |
| 10 | Homepage scrolling strip changed from tech stack to the **11 services** |
| 11 | Dropdown menus restyled like vishnexa.com: icon tile + title + description per item, "View all →" |
| 12 | Logo mark (gradient ring + teal dot) in header; **favicon**, Apple icon and SVG icon created |

---

## 6. Phase 4 — Content changes

1. **Contact details** added: email `vishnus9943@gmail.com`, WhatsApp **+91 78100 08567** (formatted, links to WhatsApp), location *Bommanahalli, Bengaluru 560068*, hours *9:00 AM – 5:00 PM IST* (location/hours set via Vercel environment variables).
2. **Content audit** (homepage 1,049 words / 12 screens → 550 words / 7 screens):
   - Removed duplicate "What we do", empty product/resource sections, triple tech lists, homepage FAQ.
   - New lines: *"Websites, apps, AI and automation — designed with care and engineered to last."*, *"Eleven ways we help your business run better."*, *"Founded by a data engineer who builds systems that stay reliable long after launch."*
   - Each service got **2 service-specific FAQs** (instead of the same 3 everywhere); repeated "Who it is for" removed; approach shown as one compact line.
   - About trimmed (story in one line; removed repeated process and placeholder section); Products, Blog, Guides, Our Work shortened.
3. **Our Work → Trafenix AI** case study (https://trafenix.onrender.com/): traffic-survey platform (TMC, midblock, NMU, parking, queue, vehicle classification, joystick counting devices, admin/roles/audit). Described only from the public sign-in page and module structure; animated intersection illustration + real sign-in screenshot. *Owner to confirm: client/own product, year, backend, screenshots, results.*
4. **Compact service names** shown to visitors (full names kept in Google titles):

   | Full name | Compact name |
   |---|---|
   | Website Design & Development | Web Design |
   | Web Application Development | Web Apps |
   | Mobile Application Development | Mobile Apps |
   | AI Development & Intelligent Solutions | AI Solutions |
   | Custom Software Development | Custom Software |
   | Business Process Automation | Automation |
   | API Development & Integrations | API Integrations |
   | WhatsApp & Instagram Automation | WhatsApp & Instagram |
   | Digital Marketing & SEO | SEO & Marketing |
   | AI Chatbot Development | AI Chatbots |
   | Data Engineering & Analytics | Data & Analytics |

5. **Navigation**: "Products" replaced by **"Pricing"** (plain link, no dropdown, no prices in any dropdown). Products page still reachable from the footer. Final menu: *Home · Services · Pricing · Student Projects · Resources · Our Work · About · Contact*.
6. Page headlines shortened: *Build, connect and grow.* · *Simple, honest pricing.* · *Learn by building.* · *Clear answers, better decisions.* · *Useful, not complicated.* · *Real products, built and running.* · *Let's build something useful.* · *Tools that just work.*

---

## 7. Phase 5 — Pricing

### Website packages (`src/content/pricing.ts`)
| Package | First (from vishnexa.com) | **Current** | Pages |
|---|---|---|---|
| Starter Website | ₹15,000 | **₹9,999** | Up to 5 |
| Business Website (Most popular) | ₹30,000 | **₹19,999** | Up to 10 |
| Premium Website | ₹50,000 | **₹39,999** | Up to 15 |
| Enterprise Web App | ₹80,000+ | **₹69,999+** | 20+ / custom |

### Service starting prices (`src/content/service-pricing.ts`, owner-approved)
| Service | From | Represents |
|---|---|---|
| Web Design | ₹14,999 | Basic 3–5-page business website |
| Web Apps | ₹49,999 | Discovery and interactive prototype |
| Mobile Apps | ₹39,999 | UI/UX design and clickable prototype |
| AI Solutions | ₹29,999 | One limited AI proof of concept |
| Custom Software | ₹49,999 | Discovery and workflow prototype |
| Automation | ₹14,999 | Up to two simple workflows |
| API Integrations | ₹14,999 | One straightforward integration |
| WhatsApp & Instagram | ₹9,999 | Basic single-channel automation setup |
| SEO & Marketing | ₹9,999/month | Basic monthly SEO service |
| AI Chatbots | ₹19,999 | Simple website chatbot |
| Data & Analytics | ₹29,999 | Small batch-data pipeline |

### Pricing page (`/pricing`) — 12 sections
Hero with ring showing **₹9,999 in the middle** · stats strip · pricing principle · 4 floating package cards · fine print · **all-services prices** · 16-row comparison table · what you receive (8) · optional add-ons (6) · what changes the estimate (6) · project terms (6) · beyond packages · 8 pricing FAQs (with FAQ schema) · final CTA.

Prices also appear on service cards, the homepage service list and each service page ("Starting from" panel). Choosing a plan pre-fills the contact form. Contact-form budget ranges updated to: Under ₹10k · ₹10k–25k · ₹25k–50k · ₹50k–1L · Above ₹1L · Not sure.

> ⚠️ **Open decision:** Starter package is ₹9,999 but Web Design "from" is ₹14,999.

---

## 8. Phase 6 — SEO

- Page titles and meta descriptions from the content document on every main page (e.g. *"ZENSHA AI | Websites, Software, AI & Automation"*, *"Data Engineering & Analytics Services | ZENSHA AI"*).
- Canonical URLs, Open Graph and Twitter tags on all pages.
- **Share image** (`src/app/opengraph-image.tsx`) — branded 1200×630 preview for WhatsApp/LinkedIn/X.
- **Structured data**: `ProfessionalService` (name, phone, email, Bengaluru address, area served India, founder), `Service`, `FAQPage`, `BreadcrumbList`, `Article`, `Product`, `SoftwareApplication` where relevant.
- `sitemap.xml` (all pages incl. services, pricing, legal) and `robots.txt` — **currently blocks all crawling** until `NEXT_PUBLIC_ALLOW_INDEXING=true`.
- Claude-SEO plugin (AgriciDaniel/claude-seo) — **not installed** (needs the owner to run `/plugin marketplace add AgriciDaniel/claude-seo` and `/plugin install claude-seo@agricidaniel-claude-seo`); most useful for auditing the live site.

---

## 9. Phase 7 — Infrastructure & go-live

Every step, in order:

1. **Code committed** on branch `launch` (secrets excluded; `.env.local` git-ignored).
2. **Production safety fix** — `/admin` returns 404 in production if the database isn't connected (prevented the launch checklist being public).
3. **ChatGPT's changes reviewed and kept**:
   - `20261120010000_fix_profile_role_guard.sql` — fixed a real bug where admins (service role) couldn't change roles or create the first admin.
   - `scripts/configure-supabase-env.mjs` — saves Supabase keys to `.env.local` without printing them. Two bugs fixed: empty-value regex matching the next line, and forcing non-agent CLI mode.
4. **Parent `D:\My Company\Website\.env`** checked (names only): it belonged to another app (Docker Postgres, JWT, FFmpeg — likely Trafenix). Nothing reused. **Moved to Recycle Bin** at the owner's request.
5. **Supabase login** — the CLI refused to log in from Claude's shell (non-TTY / agent detection). Solved by opening a real PowerShell window with `npx supabase login --agent no --output-format text`; the owner approved in the browser.
6. Supabase account had no organization → created **org "ZENSHA AI"** (free) and **project `zensha-ai`** (ref `cxrjlhmokgwiginumhmo`, region `ap-south-1` Mumbai, no paid size). Database password generated randomly and stored only in `.env.local`.
7. Keys saved with the script; `supabase link` + **`supabase db push --remote`** applied both migrations.
8. **Database security verified**: anonymous key cannot read private tables or insert enquiries (blocked, 42501); buckets `media` public, `project-files` private.
9. **Vercel**: logged in as team `zensha-ai`; created project; added 12 production environment variables (public anon key confirmed as intentionally public; service key and salt as sensitive secrets); first production deployment.
10. Fixed `NEXT_PUBLIC_SITE_URL` (was `localhost`) → redeployed.
11. **Live contact-form test**: enquiry submitted on the live site, confirmed saved (IP stored only as a hash), test row deleted.
12. **Domain**: added `zenshaai.com` + `www` to Vercel; got project-specific DNS values.
13. **Hostinger DNS** (owner logged in to a separate Chrome window; Claude edited records — no password handling):
    - `A @` changed `2.57.91.91` (parking) → **`216.198.79.1`**
    - `CNAME www` changed `zenshaai.com` → **`49361b984b7fb9b7.vercel-dns-017.com`**
    - No MX/TXT records existed; nameservers unchanged (Hostinger).
14. DNS propagated; **Vercel verified both domains**; **Let's Encrypt HTTPS certificates** issued automatically (owner briefly saw "Not Secure" before issuance).
15. **`www` → `zenshaai.com` 308 redirect** set via `vercel api` (Git Bash needs `MSYS_NO_PATHCONV=1`).
16. `NEXT_PUBLIC_SITE_URL=https://zenshaai.com` → redeployed; all pages, redirects, sitemap and share image tested on the domain.
17. **GitHub**: owner created private repo `zensha-ai/-zensha-ai` and a fine-grained token (this repo only). Code pushed to `main` without storing the token in git config. Token saved in `.env.local` as `GITHUB_TOKEN`.
18. **Token rotated twice** (it had been pasted in chat); the final token was delivered via a Notepad file, moved into `.env.local`, file deleted; old tokens confirmed disabled.
19. **CI** added (`.github/workflows/ci.yml`). First push rejected until the token got **Workflows** permission. First CI run **failed at type-check** (Next.js route types are generated, not committed) → added `npx next typegen` step → **all green**.
20. **CD**: Vercel ↔ GitHub connection needed the Vercel GitHub App, which only the owner can install → owner installed it → `vercel git connect` → **auto-deploy verified** with a test commit.
21. **Branch protection** isn't available for private repos on GitHub Free → instead `vercel.json` runs **all tests before every build**, so a failing change never replaces the live site.
22. **Supabase Auth URLs** set via `supabase/config.toml` + `supabase config push` (only 2 settings changed: Site URL `https://zenshaai.com`; redirect URLs for zenshaai.com, www, vercel.app, localhost).
23. **Admin account**: owner registered `vishnus9943@gmail.com` → promoted to **admin** (validated the role-guard fix) → email confirmed via admin API → login failed with the forgotten password → **temporary password** set and delivered in a Notepad file (`D:\My Company\Website\temp-password.txt`) → owner logged in.

---

## 10. Where everything lives

### Accounts (all on the ZENSHA email)
| Service | Account / project |
|---|---|
| GitHub | org/user `zensha-ai`, repo `-zensha-ai` (private) |
| Vercel | team `zensha-ai` (Hobby), project `zensha-ai` |
| Supabase | org "ZENSHA AI", project `zensha-ai`, ref `cxrjlhmokgwiginumhmo`, Mumbai |
| Hostinger | domain `zenshaai.com` (DNS records only) |

The owner's **Trafenix** app (Render + its own Postgres) is completely separate and was never touched.

### Files
| Path | Purpose |
|---|---|
| `D:\My Company\Website\zensha-ai` | The project |
| `.env.local` (git-ignored) | All local secrets: Supabase URL/keys, DB password, IP salt, GitHub token, contact details |
| `.vercel/` (git-ignored) | Vercel project link |
| `supabase/config.toml` | Auth URL settings (pushed with `supabase config push`) |
| `vercel.json` | Build command: tests then build |
| `.github/workflows/ci.yml` | CI checks |

### Environment variables (names only)
| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Vercel | `https://zenshaai.com` |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Vercel | `false` (Google blocked) |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `_WHATSAPP` / `_LOCATION` / `_HOURS` | Vercel + local | Contact details |
| `NEXT_PUBLIC_PUBLISH_FOUNDER_EMPLOYMENT` / `_PORTFOLIO` | Vercel | `false` (owner approval pending) |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + local | Supabase (public by design) |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel (sensitive) + local | Server-only DB access |
| `IP_HASH_SALT` | Vercel (sensitive) + local | Hashing visitor IPs for rate limiting |
| `PAYMENTS_ENABLED` | Vercel | `false` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | not set yet | Payments |
| `SUPABASE_DB_PASSWORD`, `GITHUB_TOKEN` | local only | Migrations / pushing code |

---

## 11. Project structure & stack

```
src/
  app/
    (site)/            public site + account/cart/checkout (shared header/footer)
      (auth)/          login, register, forgot/reset password
      pricing/         full pricing page
    admin/             protected CMS (own layout, noindex, 404 in prod without DB)
    api/               checkout, payment verify, Razorpay webhook, downloads
    auth/              Supabase callback + sign-out
    opengraph-image.tsx, icon.svg, apple-icon.png, favicon.ico, sitemap.ts, robots.ts
  components/          ui, layout (header/footer/logo), hero-visuals, service cards & visuals,
                       work cards, pricing, effects (network, spotlight), commerce, forms
  config/              brand.ts (brand + contact), navigation.ts
  content/             services, site copy, pricing, service-pricing, work (Trafenix), legal drafts
  lib/                 auth, supabase clients, data repository, payments, rate limit, seo, validation
  proxy.ts             session refresh + route guard
supabase/              migrations, config.toml, seed.sql, tests
scripts/               configure-supabase-env.mjs (+ test)
```

| Layer | Choice |
|---|---|
| Framework | Next.js 16.4 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS 4, CSS-variable tokens (dark "quiet console") |
| Motion | CSS keyframes & scroll-driven animations; Motion for the mobile menu; canvas dot-network |
| Data/Auth/Files | Supabase Postgres (RLS), Auth, Storage |
| Payments | Razorpay (off) |
| Validation / tests | zod / Vitest |

**How content works:** services, FAQs, homepage, About and legal drafts ship as typed content in `src/content/`. In `/admin`, **"Seed services from code"** copies services/FAQs into the database, after which DB rows take over. Products, student projects, articles and extra work items come only from the database; Trafenix is built in (`src/content/work.ts`).

---

## 12. Local development

```bash
npm install
npm run dev            # http://localhost:3000  (.env.local already holds the keys)
npm test               # 34 unit tests
npx eslint src scripts # lint
npx next typegen && npx tsc --noEmit -p .   # type-check
npx next build         # production build
```

If styles look stale in dev, stop the server, delete `.next/dev` and start again.

Supabase CLI from an AI assistant's shell needs `--agent no` (and a real terminal for `login`).

---

## 13. How to update the site (runbook)

| Task | How |
|---|---|
| Change text, prices, services | Edit `src/content/*.ts` → commit → push to `main` → live in ~2 min |
| Change contact details | Update the env var in Vercel (Settings → Environment Variables) → redeploy |
| Add student projects, products, articles, FAQs, case studies | `/admin` (no code needed) |
| Read enquiries | `/admin/enquiries` |
| Make someone admin | `/admin/customers` |
| Database change | Add a file in `supabase/migrations/` → `npx supabase db push --remote --agent no` |
| Auth URL change | Edit `supabase/config.toml` → `npx supabase config diff` → `npx supabase config push --yes --agent no` |
| Undo a bad release | Vercel → Deployments → previous deployment → **Promote to Production** |
| Push code (from this PC) | Uses `GITHUB_TOKEN` in `.env.local` (fine-grained, this repo only, Contents + Workflows) |

**Pipeline:** push → GitHub Actions CI (lint, types, tests, build) → Vercel build (tests again, then build) → production. If tests fail, the live site stays on the last good version.

---

## 14. Security model

- **RLS on every table**; public reads only published rows; customers see only their own orders/entitlements; role changes blocked except by admins/service role.
- **Service-role key** server-only, used after authentication/authorization.
- **Admin**: proxy redirect + `requireAdmin()` on pages + `assertAdmin()` on actions; hidden (404) in production without a database.
- **Checkout**: server re-prices from the DB; Razorpay HMAC signature + verified, idempotent webhook; amount mismatches refused; no fake success states.
- **Downloads**: private bucket; entitlement check; logged; 60-second signed URLs.
- **Forms**: zod validation, honeypot, minimum fill time, rate limiting (Postgres), hashed IPs, generic auth errors, safe redirects.
- **Headers**: HSTS, `X-Frame-Options: DENY`, `nosniff`, referrer & permissions policies.
- **Secrets**: never committed; tokens rotated after exposure; passwords never read or stored in plain text by the site.

---

## 15. Open items & next steps

**Owner actions**
- [ ] Change the temporary password at https://zenshaai.com/reset-password and **delete** `D:\My Company\Website\temp-password.txt`
- [ ] In `/admin`, click **Seed services from code** once
- [ ] Decide Starter price: **₹9,999 or ₹14,999**
- [ ] Confirm Trafenix details (client/own product, year, backend, screenshots, results)
- [ ] Approve or keep hidden: founder employment & portfolio on About/Our Work
- [ ] Turn on Google indexing (`NEXT_PUBLIC_ALLOW_INDEXING=true`) and submit the sitemap to Google Search Console
- [ ] Brand/trademark clearance for "ZENSHA AI"; company registration details for About
- [ ] Legal review of Privacy, Terms, Refund, Licensing, Cookies (incl. DPDP Act)

**Development**
- [ ] Fix the 4 payment issues identified in the ChatGPT review, then Razorpay onboarding → keys → webhook → test mode → `PAYMENTS_ENABLED=true`
- [ ] Add real student projects, products, articles and more case studies
- [ ] Optional: custom SMTP for Supabase emails (free tier sends only a few per hour)
- [ ] Optional: install the Claude-SEO plugin and audit https://zenshaai.com

---

## 16. Commit history

| Commit | Date | Summary |
|---|---|---|
| `fc48635` | 2026-11-20 | Initial commit from Create Next App |
| `949cc3e` | 2026-11-20 | Full website: marketing site, pricing, catalogue, commerce and admin |
| `88464b4` | 2026-11-21 | Launch prep: share image, local business schema, Supabase setup |
| `0ff2cd4` | 2026-11-21 | CI workflow + CI/CD docs |
| `eaa9a19` | 2026-11-21 | CI: generate route types before type-check |
| `c638dba` | 2026-11-21 | Verify automatic deployment from GitHub |
| `687adc0` | 2026-11-21 | Supabase auth URLs as config; tests run in Vercel build |
| *(this commit)* | 2026-11-21 | Complete end-to-end README |
