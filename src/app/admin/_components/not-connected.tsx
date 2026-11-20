import { isServiceRoleConfigured, isSupabaseConfigured } from "@/lib/env";

/** Honest state shown when the database is not connected. Exposes no data. */
export function NotConnected() {
  const steps = [
    { done: isSupabaseConfigured(), text: "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." },
    { done: isServiceRoleConfigured(), text: "Set SUPABASE_SERVICE_ROLE_KEY (server only — never expose it to the browser)." },
    { done: false, text: "Run the migrations in supabase/migrations (supabase db push, or paste into the SQL editor)." },
    { done: false, text: "Register an account on the site, then promote it: see the comment at the top of supabase/seed.sql." },
  ];
  return (
    <div className="max-w-2xl rounded-2xl border border-dashed border-line-strong bg-surface p-8">
      <p className="eyebrow">Admin</p>
      <h1 className="display-3 mt-2">Database not connected</h1>
      <p className="mt-3 text-sm text-muted">
        The admin dashboard manages content, orders and protected files stored in Supabase. Nothing can be shown or edited until the
        database is configured. Full setup steps are in the project README.
      </p>
      <ol className="mt-6 space-y-3 text-sm">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden className={s.done ? "text-success" : "text-muted"}>
              {s.done ? "✓" : `${i + 1}.`}
            </span>
            <span>
              {s.text}
              {s.done && <span className="sr-only"> (done)</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
