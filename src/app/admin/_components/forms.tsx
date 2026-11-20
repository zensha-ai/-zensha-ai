"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/admin/fields";
import { grantEntitlement, saveSetting, seedFromCode } from "@/lib/admin/actions";
import { Button, cx } from "@/components/ui";

const inputCls =
  "w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-sm aria-[invalid=true]:border-danger";

function Message({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p role={state.ok ? "status" : "alert"} className={cx("text-sm", state.ok ? "text-success" : "text-danger")}>
      {state.message}
    </p>
  );
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return msg ? (
    <p id={id} className="mt-1 text-xs font-medium text-danger">
      {msg}
    </p>
  ) : null;
}

export function SeedForm() {
  const [state, action, pending] = useActionState(seedFromCode, {} as FormState);
  return (
    <form
      action={action}
      onSubmit={(e) => {
        const overwrite = (e.currentTarget.elements.namedItem("overwrite") as HTMLInputElement).checked;
        if (overwrite && !window.confirm("Overwrite every service in the database with the version in code? Admin edits to services will be lost.")) {
          e.preventDefault();
        }
      }}
      className="space-y-3"
    >
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="overwrite" className="size-4 accent-[var(--ink)]" />
        Overwrite existing services (otherwise only missing ones are added)
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Seeding…" : "Seed services & FAQs from code"}
        </Button>
        <Message state={state} />
      </div>
    </form>
  );
}

export function GrantForm({ projects }: { projects: { id: string; title: string; is_example: boolean }[] }) {
  const [state, action, pending] = useActionState(grantEntitlement, {} as FormState);
  const v = (state.values ?? {}) as Record<string, string>;
  return (
    <form action={action} noValidate className="grid gap-4 rounded-xl border border-line bg-surface p-5 md:grid-cols-3" key={JSON.stringify(state.values ?? {})}>
      <div>
        <label htmlFor="g-email" className="mb-1.5 block text-sm font-medium">
          Customer account email <span className="text-accent">*</span>
        </label>
        <input id="g-email" name="email" type="email" defaultValue={v.email} aria-invalid={state.errors?.email ? true : undefined} aria-describedby="g-email-err" className={inputCls} />
        <FieldError id="g-email-err" msg={state.errors?.email} />
      </div>
      <div>
        <label htmlFor="g-project" className="mb-1.5 block text-sm font-medium">
          Project <span className="text-accent">*</span>
        </label>
        <select id="g-project" name="project_id" defaultValue={v.project_id ?? ""} aria-invalid={state.errors?.project_id ? true : undefined} aria-describedby="g-project-err" className={inputCls}>
          <option value="">Choose…</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
              {p.is_example ? " (EXAMPLE)" : ""}
            </option>
          ))}
        </select>
        <FieldError id="g-project-err" msg={state.errors?.project_id} />
      </div>
      <div>
        <label htmlFor="g-exp" className="mb-1.5 block text-sm font-medium">
          Expires (optional)
        </label>
        <input id="g-exp" name="expires_at" type="date" defaultValue={v.expires_at} aria-invalid={state.errors?.expires_at ? true : undefined} aria-describedby="g-exp-err" className={inputCls} />
        <FieldError id="g-exp-err" msg={state.errors?.expires_at} />
      </div>
      <div className="flex flex-wrap items-center gap-3 md:col-span-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Granting…" : "Grant download access"}
        </Button>
        <Message state={state} />
      </div>
    </form>
  );
}

export function SettingForm({ initialKey, initialValue }: { initialKey: string; initialValue: string }) {
  const [state, action, pending] = useActionState(saveSetting, {} as FormState);
  const v = (state.values ?? { key: initialKey, value: initialValue }) as Record<string, string>;
  return (
    <form action={action} noValidate className="space-y-5" key={JSON.stringify(state.values ?? {})}>
      <input type="hidden" name="original_key" value={initialKey} />
      <div>
        <label htmlFor="s-key" className="mb-1.5 block text-sm font-medium">
          Key <span className="text-accent">*</span>
        </label>
        <input id="s-key" name="key" defaultValue={v.key} aria-invalid={state.errors?.key ? true : undefined} aria-describedby="s-key-help s-key-err" className={cx(inputCls, "font-mono")} />
        <p id="s-key-help" className="mt-1 text-xs text-muted">
          e.g. <code>home</code>, <code>contact</code>, or <code>seo:/about</code> for a page-level SEO override.
        </p>
        <FieldError id="s-key-err" msg={state.errors?.key} />
      </div>
      <div>
        <label htmlFor="s-value" className="mb-1.5 block text-sm font-medium">
          Value (JSON object) <span className="text-accent">*</span>
        </label>
        <textarea id="s-value" name="value" rows={18} defaultValue={v.value} spellCheck={false} aria-invalid={state.errors?.value ? true : undefined} aria-describedby="s-value-err" className={cx(inputCls, "font-mono text-[0.8rem]")} />
        <FieldError id="s-value-err" msg={state.errors?.value} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save setting"}
        </Button>
        <Message state={state} />
      </div>
    </form>
  );
}
