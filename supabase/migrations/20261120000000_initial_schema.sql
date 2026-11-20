-- ZENSHA AI — initial schema
-- Run with the Supabase CLI (`supabase db push`) or paste into the SQL editor.
-- All tables have Row Level Security enabled. The service-role key (server only)
-- bypasses RLS and is used exclusively inside verified server code paths.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles & roles
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('customer', 'admin');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Users may update their own name/phone but never their role.
create or replace function public.prevent_role_escalation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;

create trigger profiles_role_guard before update on public.profiles
  for each row execute function public.prevent_role_escalation();

alter table public.profiles enable row level security;
create policy "profiles: read own or admin" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles: update own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles: admin all" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- CMS: services, FAQs, site settings, articles, work, categories, media
-- ---------------------------------------------------------------------------
create table public.services (
  slug text primary key,
  position int not null default 0,
  data jsonb not null,            -- shape of src/content/types.ts#Service
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  scope text not null default 'general',   -- general | students | products | ...
  question text not null,
  answer text not null,
  position int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,              -- e.g. 'home', 'contact', 'seo:/about'
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create type public.article_kind as enum ('blog', 'guide', 'case_study');

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  kind public.article_kind not null,
  title text not null,
  excerpt text not null default '',
  body text not null default '',     -- Markdown
  category text not null default 'General',
  cover_image_url text,
  read_minutes int not null default 5,
  published boolean not null default false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.work_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  kind text not null check (kind in ('company', 'founder')),
  client text,
  industry text,
  project_type text not null default '',
  year text,
  summary text not null default '',
  challenge text,
  approach text,
  solution text,
  features text[] not null default '{}',
  technologies text[] not null default '{}',
  outcome text,
  demo_url text,
  cover_image_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  domain text not null check (domain in ('product', 'student_project', 'article')),
  slug text not null,
  name text not null,
  description text,
  position int not null default 0,
  unique (domain, slug)
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,          -- path inside the public 'media' bucket
  alt text not null default '',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Products (software / AI)
-- ---------------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  category text not null check (category in ('ai-products', 'business-software', 'automation-tools')),
  status text not null default 'coming_soon' check (status in ('available', 'beta', 'coming_soon')),
  is_example boolean not null default false,
  story text, problem text, solution text,
  features jsonb not null default '[]',
  how_it_works text[] not null default '{}',
  use_cases text[] not null default '{}',
  integrations text[] not null default '{}',
  architecture text, security text, pricing text,
  demo_url text, demo_video_url text, hero_image_url text,
  faqs jsonb not null default '[]',
  seo_title text, seo_description text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Student projects marketplace
-- ---------------------------------------------------------------------------
create table public.student_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  demonstrates text not null default '',
  summary text not null default '',
  category text not null check (category in ('software', 'hardware', 'iot-robotics', 'ai-ml')),
  difficulty text not null default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  delivery_type text not null default 'digital' check (delivery_type in ('digital', 'physical_kit', 'digital_and_kit')),
  stack text[] not null default '{}',
  price_paise int not null default 0 check (price_paise >= 0),
  kit_price_paise int check (kit_price_paise is null or kit_price_paise >= 0),
  is_free boolean not null default false,
  is_example boolean not null default false,
  demo_video_url text, demo_gif_url text, demo_caption text, cover_image_url text,
  features jsonb not null default '[]',
  learning_objectives text[] not null default '{}',
  how_it_works text,
  components text[] not null default '{}',
  circuit_diagram_url text,
  setup_guide text[] not null default '{}',
  package_contents text[] not null default '{}',
  documentation_notes text,
  license text, support text, shipping_terms text,
  faqs jsonb not null default '[]',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint free_has_no_price check (not is_free or price_paise = 0),
  constraint kit_needs_shipping check (delivery_type = 'digital' or shipping_terms is not null or not published)
);

-- Protected files live in the PRIVATE 'project-files' bucket. Never public.
create table public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.student_projects (id) on delete cascade,
  label text not null,
  storage_path text not null unique,
  size_bytes bigint,
  is_free_preview boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Commerce
-- ---------------------------------------------------------------------------
create type public.order_status as enum ('pending', 'paid', 'failed', 'refunded', 'cancelled');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  status public.order_status not null default 'pending',
  currency text not null default 'INR',
  amount_paise int not null check (amount_paise >= 0),
  billing_name text not null,
  billing_email text not null,
  billing_phone text,
  shipping_address jsonb,             -- only when a physical kit is ordered
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  project_id uuid not null references public.student_projects (id) on delete restrict,
  package text not null check (package in ('digital', 'kit')),
  title_snapshot text not null,
  unit_price_paise int not null check (unit_price_paise >= 0),
  quantity int not null default 1 check (quantity between 1 and 10)
);

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid not null references public.student_projects (id) on delete cascade,
  order_id uuid references public.orders (id) on delete set null,
  source text not null check (source in ('purchase', 'free', 'admin_grant')),
  revoked boolean not null default false,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, project_id)
);

create table public.download_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  file_id uuid not null references public.project_files (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.payment_events (
  id text primary key,                -- Razorpay event id (idempotency)
  event text not null,
  payload jsonb not null,
  received_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Enquiries (business + student support)
-- ---------------------------------------------------------------------------
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'business' check (kind in ('business', 'student_support')),
  name text not null,
  email text not null,
  phone text,
  company text,
  service text,
  budget text,
  timeline text,
  order_reference text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed', 'spam')),
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.rate_limits (
  key text primary key,
  window_start timestamptz not null,
  count int not null
);

-- Atomic fixed-window rate limiter usable from server code.
create or replace function public.rate_limit_hit(p_key text, p_limit int, p_window_seconds int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  insert into public.rate_limits as r (key, window_start, count)
  values (p_key, now(), 1)
  on conflict (key) do update
    set count = case when r.window_start < now() - make_interval(secs => p_window_seconds) then 1 else r.count + 1 end,
        window_start = case when r.window_start < now() - make_interval(secs => p_window_seconds) then now() else r.window_start end
  returning count into v_count;
  return v_count <= p_limit;
end;
$$;
revoke all on function public.rate_limit_hit(text, int, int) from public, anon, authenticated;

-- updated_at triggers
create trigger services_touch before update on public.services for each row execute function public.touch_updated_at();
create trigger faqs_touch before update on public.faqs for each row execute function public.touch_updated_at();
create trigger settings_touch before update on public.site_settings for each row execute function public.touch_updated_at();
create trigger articles_touch before update on public.articles for each row execute function public.touch_updated_at();
create trigger work_touch before update on public.work_items for each row execute function public.touch_updated_at();
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();
create trigger sp_touch before update on public.student_projects for each row execute function public.touch_updated_at();
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.services enable row level security;
alter table public.faqs enable row level security;
alter table public.site_settings enable row level security;
alter table public.articles enable row level security;
alter table public.work_items enable row level security;
alter table public.categories enable row level security;
alter table public.media enable row level security;
alter table public.products enable row level security;
alter table public.student_projects enable row level security;
alter table public.project_files enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.entitlements enable row level security;
alter table public.download_events enable row level security;
alter table public.payment_events enable row level security;
alter table public.enquiries enable row level security;
alter table public.rate_limits enable row level security;

-- Public read of published content
create policy "services: public read" on public.services for select using (published or public.is_admin());
create policy "faqs: public read" on public.faqs for select using (published or public.is_admin());
create policy "settings: public read" on public.site_settings for select using (true);
create policy "articles: public read" on public.articles for select using (published or public.is_admin());
create policy "work: public read" on public.work_items for select using (published or public.is_admin());
create policy "categories: public read" on public.categories for select using (true);
create policy "media: public read" on public.media for select using (true);
create policy "products: public read" on public.products for select using (published or public.is_admin());
create policy "student_projects: public read" on public.student_projects for select using (published or public.is_admin());

-- Buyers keep access to what they own, even if a project is later unpublished.
create or replace function public.has_entitlement(p_project uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.entitlements e
    where e.project_id = p_project and e.user_id = auth.uid() and not e.revoked
      and (e.expires_at is null or e.expires_at > now())
  );
$$;

create policy "student_projects: entitled read" on public.student_projects for select using (public.has_entitlement(id));

-- File metadata: labels visible for published projects or to entitled buyers (storage paths are useless without signed URLs).
create policy "project_files: read" on public.project_files for select using (
  public.is_admin()
  or public.has_entitlement(project_id)
  or exists (select 1 from public.student_projects p where p.id = project_id and p.published)
);

-- Admin write on CMS/catalogue
create policy "services: admin" on public.services for all using (public.is_admin()) with check (public.is_admin());
create policy "faqs: admin" on public.faqs for all using (public.is_admin()) with check (public.is_admin());
create policy "settings: admin" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "articles: admin" on public.articles for all using (public.is_admin()) with check (public.is_admin());
create policy "work: admin" on public.work_items for all using (public.is_admin()) with check (public.is_admin());
create policy "categories: admin" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "media: admin" on public.media for all using (public.is_admin()) with check (public.is_admin());
create policy "products: admin" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "student_projects: admin" on public.student_projects for all using (public.is_admin()) with check (public.is_admin());
create policy "project_files: admin" on public.project_files for all using (public.is_admin()) with check (public.is_admin());

-- Commerce: customers read their own; all writes happen server-side with the service role.
create policy "orders: read own" on public.orders for select using (user_id = auth.uid() or public.is_admin());
create policy "order_items: read own" on public.order_items for select using (
  public.is_admin() or exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "entitlements: read own" on public.entitlements for select using (user_id = auth.uid() or public.is_admin());
create policy "entitlements: admin" on public.entitlements for all using (public.is_admin()) with check (public.is_admin());
create policy "orders: admin update" on public.orders for update using (public.is_admin()) with check (public.is_admin());
create policy "download_events: admin read" on public.download_events for select using (public.is_admin());
create policy "payment_events: admin read" on public.payment_events for select using (public.is_admin());

-- Enquiries: inserted server-side only; admins read/update.
create policy "enquiries: admin" on public.enquiries for all using (public.is_admin()) with check (public.is_admin());
-- rate_limits: no policies → only the service role / security-definer function can touch it.

create index on public.orders (user_id, created_at desc);
create index on public.entitlements (user_id);
create index on public.student_projects (published, category);
create index on public.products (published, category);
create index on public.articles (published, kind, published_at desc);
create index on public.enquiries (status, created_at desc);

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public, file_size_limit)
values ('project-files', 'project-files', false, 524288000) on conflict (id) do nothing;

create policy "media: public read objects" on storage.objects for select using (bucket_id = 'media');
create policy "media: admin write objects" on storage.objects for all
  using (bucket_id = 'media' and public.is_admin()) with check (bucket_id = 'media' and public.is_admin());
-- project-files: admin may manage; nobody else gets a policy → downloads only via server-issued signed URLs.
create policy "project-files: admin manage" on storage.objects for all
  using (bucket_id = 'project-files' and public.is_admin()) with check (bucket_id = 'project-files' and public.is_admin());
