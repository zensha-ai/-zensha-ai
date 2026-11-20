# ZENSHA AI — website & platform

**Intelligence, Designed with Purpose.** · AI, Software, Data & Engineering

Marketing site, software/AI product catalogue, student-project marketplace with secure downloads, business resources and a protected admin CMS.

> **Brand status:** ZENSHA AI is a *working* brand identity. Trademark, company-name and domain clearance are pending (other Indian entities use "Zensha"). The name lives in one place — `src/config/brand.ts` — so it can be changed safely.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS 4 with CSS-variable design tokens (light + dark) |
| Motion | CSS scroll-driven animations (progressive enhancement) + Motion for interactive transitions |
| Data/Auth/Files | Supabase Postgres (RLS), Supabase Auth, Supabase Storage (public `media`, private `project-files`) |
| Payments | Razorpay (disabled until credentials **and** `PAYMENTS_ENABLED=true`) |
| Validation | zod (server-side) |
| Tests | Vitest |

`cacheComponents` is intentionally **off**; public pages use ISR (`revalidate = 300`) and admin mutations call `revalidatePath`.

## Project structure

```
src/
  app/
    (site)/            public site + account/cart/checkout (shared header/footer)
      (auth)/          login, register, forgot/reset password
    admin/             protected CMS (own layout, noindex)
    api/               checkout, payment verify, Razorpay webhook, downloads
    auth/              Supabase callback + sign-out
    sitemap.ts, robots.ts
  components/          ui primitives, layout, catalog browsers, commerce, forms
  config/              brand.ts (single source of brand/contact), navigation.ts
  content/             typed seed content: services (11), site copy, legal drafts
  lib/                 auth (DAL), supabase clients, data repository, payments, rate limit, seo
  proxy.ts             session refresh + optimistic route guard (Next 16 "proxy", formerly middleware)
supabase/
  migrations/          schema, RLS policies, storage buckets
  seed.sql             optional example rows (is_example, unpublished)
```

### How content works
- **Services, FAQs, homepage copy, About, legal drafts** ship as typed content in `src/content/` (from *ZENSHA_AI_Complete_Website_Content.docx v1.2*). Once Supabase is connected, the admin **"Seed services from code"** action copies services/FAQs into the database, and DB rows take over.
- **Products, student projects, articles, work items** come only from the database. With none published, the site shows honest empty / "in preparation" states — nothing is invented.

## Local setup

```bash
npm install
cp .env.example .env.local      # fill in what you have; everything is optional for a first look
npm run dev                     # http://localhost:3000
```

Without Supabase the full marketing site works; forms, accounts, cart checkout and admin show explicit "not connected" messages (no fake success states).

### Connect Supabase
1. Create a project at supabase.com. Copy URL, anon key and service-role key into `.env.local`.
2. Apply all migrations: `npx supabase link --project-ref <ref>` then `npx supabase db push` (or run each file in `supabase/migrations/` in filename order in the SQL editor). Existing databases must also apply `20261120010000_fix_profile_role_guard.sql`.
3. Auth → URL configuration: set **Site URL** to `NEXT_PUBLIC_SITE_URL` and add `<site>/auth/callback` to redirect URLs.
4. Register on the site, then promote yourself in the Supabase SQL editor using the `postgres` role:
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'you@yourcompany.example');
   ```
5. Visit `/admin` → run **Seed services from code**.
6. (Optional) `supabase/seed.sql` adds clearly labelled, unpublished example rows.

After applying the migrations to a local or test Supabase database, run `supabase/tests/profile_role_guard.sql` as `postgres` to verify first-admin setup, service-role changes, admin changes and customer protection. The test runs in a transaction and rolls back its fixtures.

To save Supabase keys without copying them into chat or printing them in the terminal, create exactly one hosted project named `zensha-ai`, sign in with `npx.cmd supabase login`, then run:

```powershell
node scripts/configure-supabase-env.mjs
```

The script verifies the project's Storage API and saves public/server keys directly to the ignored `.env.local`, preserving unrelated settings. It does not create projects, apply migrations, deploy, or configure Vercel. Use a Free organization and select Mumbai (`ap-south-1`) when available; stop if payment is required. Vercel CLI authentication stays separate from the app's environment variables.

### Enable Razorpay (only after merchant onboarding)
1. Add `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.
2. Dashboard → Webhooks: URL `<site>/api/webhooks/razorpay`, events `payment.captured`, `order.paid`, `payment.failed`.
3. Test in Razorpay **test mode** end to end, then set `PAYMENTS_ENABLED=true`.

## Security model
- **RLS on every table.** Public reads are limited to published rows; customers read only their own orders/entitlements; `profiles.role` can't be self-escalated (trigger).
- **Service-role key** is server-only and used only after authentication/authorization in server code.
- **Admin:** `proxy.ts` redirects anonymous users; every admin page calls `requireAdmin()` and every admin action `assertAdmin()`.
- **Checkout:** prices are recomputed from the DB; client cart holds IDs only. Payment success requires a verified Razorpay HMAC signature (callback) or a verified webhook; webhook events are idempotent; amount mismatches are refused.
- **Downloads:** paid files live in a private bucket; `/api/downloads/[fileId]` checks session + entitlement, logs the event, and redirects to a 60-second signed URL. No public file URLs exist.
- **Forms:** zod validation, honeypot, minimum fill time, rate limiting (Postgres-backed when configured; in-memory fallback), generic auth errors, safe `next` redirects.
- **Headers:** HSTS, `X-Frame-Options: DENY`, `nosniff`, referrer and permissions policies (`next.config.ts`).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |

## Deploy (Vercel)
1. Import the repo in Vercel (framework: Next.js).
2. Add all env vars from `.env.example` (Production + Preview). Keep `NEXT_PUBLIC_ALLOW_INDEXING=false` until launch.
3. Deploy, then update Supabase Auth Site URL / redirect URLs and the Razorpay webhook URL to the deployed domain.

## Launch checklist (honest status)
- [ ] Brand, company-name and trademark clearance; domain purchased → set `NEXT_PUBLIC_SITE_URL`
- [ ] Verified business email / WhatsApp / location / hours → `NEXT_PUBLIC_CONTACT_*`
- [ ] Founder approvals → `NEXT_PUBLIC_PUBLISH_FOUNDER_EMPLOYMENT`, `NEXT_PUBLIC_PUBLISH_FOUNDER_PORTFOLIO`
- [ ] Company registration details on About
- [ ] Legal pages reviewed by counsel (currently marked **Draft — pending legal review**), incl. DPDP Act and e-commerce rules
- [ ] Supabase project connected, migrations applied, admin promoted, services seeded
- [ ] Real products, student projects (with files, demos, licences), articles and permissioned case studies added
- [ ] Razorpay merchant onboarding, test-mode run, webhook configured, `PAYMENTS_ENABLED=true`
- [ ] Refund and shipping terms finalised (physical kits only with stated shipping terms)
- [ ] Logo/OG imagery final; `NEXT_PUBLIC_ALLOW_INDEXING=true`; submit sitemap to Search Console
- [ ] End-to-end check of forms, accounts, checkout, downloads on desktop and mobile
