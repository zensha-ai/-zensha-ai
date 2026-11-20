-- ZENSHA AI — optional seed data
--
-- PROMOTE YOUR ACCOUNT TO ADMIN
-- 1. Register on the website (/register) and confirm your email.
-- 2. Run this in the Supabase SQL editor (replace the email):
--
--    update public.profiles set role = 'admin'
--    where id = (select id from auth.users where email = 'you@example.com');
--
-- 3. Sign in and open /admin. Use "Seed services & FAQs from code" on the dashboard
--    to copy the service pages and general FAQs into the database for editing.
--
-- EXAMPLE ROWS
-- The rows below exist only to preview the product and student-project templates.
-- They are marked is_example = true and published = false, so they never appear on
-- the public site and can never be purchased. Delete them once real content exists.

insert into public.products (
  slug, name, tagline, category, status, is_example, published,
  story, problem, solution, features, how_it_works, use_cases, faqs
) values (
  'example-document-assistant',
  'Example Document Assistant',
  'EXAMPLE ONLY — illustrates how a product page is structured. Not a real product.',
  'ai-products',
  'coming_soon',
  true,
  false,
  'This placeholder demonstrates the product page template. Replace every field with verified information before publishing a real product.',
  'Describe a realistic customer difficulty with a concrete example.',
  'Describe the product''s actual workflow and how it improves the experience.',
  '[{"title":"Example feature","description":"Each verified feature should state a clear benefit."}]'::jsonb,
  array['Start or connect', 'Add your information', 'Run the workflow', 'Review results', 'Export, share or continue'],
  array['Example use case — replace with real roles and scenarios'],
  '[{"q":"Is this a real product?","a":"No. This is example content used to preview the template."}]'::jsonb
) on conflict (slug) do nothing;

insert into public.student_projects (
  slug, title, demonstrates, summary, category, difficulty, delivery_type, stack,
  price_paise, is_free, is_example, published,
  features, learning_objectives, how_it_works, setup_guide, package_contents, license, support, faqs
) values (
  'example-sensor-dashboard',
  'Example Sensor Dashboard',
  'EXAMPLE ONLY — illustrates the student project template',
  'Example content that shows how a project page lists its objective, stack, package contents and licence. Not for sale.',
  'iot-robotics',
  'beginner',
  'digital',
  array['ESP32', 'Python', 'Example only'],
  0,
  true,
  true,
  false,
  '[{"title":"Example feature","description":"Explain what the learner will see working."}]'::jsonb,
  array['Understand how a sensor reading travels from device to dashboard (example objective)'],
  'Explain inputs, processing, outputs and the main hardware/software interactions.',
  array['Prerequisites', 'Download and inspect', 'Install or assemble', 'Configure', 'Run', 'Test and modify'],
  array['Example: source code (ZIP)', 'Example: documentation (PDF)'],
  'Example licence text — replace with the Student Project License terms.',
  'Example support scope — replace with the real support coverage.',
  '[{"q":"Is this a real project?","a":"No. This is example content used to preview the template."}]'::jsonb
) on conflict (slug) do nothing;
