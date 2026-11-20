"use client";

import { useActionState, useRef } from "react";
import type { Field, FormState } from "@/lib/admin/fields";
import { slugifyClient } from "@/lib/admin/fields";
import { Button, cx } from "@/components/ui";

const inputCls =
  "w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-ink aria-[invalid=true]:border-danger";

export function ResourceForm({
  fields,
  defaults,
  action,
  submitLabel = "Save",
}: {
  fields: Field[];
  defaults: Record<string, string | boolean>;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {} as FormState);
  const formRef = useRef<HTMLFormElement>(null);
  const values = state.values ?? defaults;
  // React resets uncontrolled forms after an action; remount with the submitted
  // values on validation errors so nothing the admin typed is lost.
  const formKey = state.values ? JSON.stringify(state.values) : "initial";
  const titleField = fields.find((f) => f.name === "title" || f.name === "name");
  const hasSlug = fields.some((f) => f.type === "slug");

  const onTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const slug = formRef.current?.elements.namedItem("slug") as HTMLInputElement | null;
    if (slug && !slug.value.trim()) slug.value = slugifyClient(e.currentTarget.value);
  };

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-8">
      {state.message && (
        <p
          role={state.ok ? "status" : "alert"}
          className={cx(
            "rounded-lg border p-3 text-sm",
            state.ok ? "border-success text-success" : "border-danger text-danger",
          )}
        >
          {state.message}
        </p>
      )}
      <div key={formKey} className="grid gap-x-6 gap-y-5 lg:grid-cols-2">
        {fields.map((f) => {
          const err = state.errors?.[f.name];
          const id = `f-${f.name.replace(/\./g, "-")}`;
          const describedBy = [f.help ? `${id}-help` : null, err ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;
          const value = values[f.name];
          const common = {
            id,
            name: f.name,
            "aria-invalid": err ? true : undefined,
            "aria-describedby": describedBy,
            required: f.required,
          };
          return (
            <div key={f.name} className={cx(f.half ? "lg:col-span-1" : "lg:col-span-2", f.section && "lg:col-span-2")}>
              {f.section && <h2 className="eyebrow mb-4 mt-4 border-t border-line pt-6">{f.section}</h2>}
              <div className={cx(f.section && f.half && "lg:w-[calc(50%-0.75rem)]")}>
                {f.type === "boolean" ? (
                  <label htmlFor={id} className="flex items-start gap-3 text-sm">
                    <input {...common} type="checkbox" defaultChecked={Boolean(value)} className="mt-0.5 size-4 accent-[var(--ink)]" />
                    <span>
                      <span className="font-medium">{f.label}</span>
                      {f.help && (
                        <span id={`${id}-help`} className="block text-xs text-muted">
                          {f.help}
                        </span>
                      )}
                    </span>
                  </label>
                ) : (
                  <>
                    <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
                      {f.label}
                      {f.required && <span className="text-accent"> *</span>}
                    </label>
                    {f.type === "select" ? (
                      <select {...common} defaultValue={String(value ?? "")} className={inputCls}>
                        {!f.required && <option value="">—</option>}
                        {f.required && !value && <option value="">Choose…</option>}
                        {f.options?.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : ["textarea", "markdown", "string-list", "json", "faq-list", "feature-list"].includes(f.type) ? (
                      <textarea
                        {...common}
                        defaultValue={String(value ?? "")}
                        rows={f.type === "markdown" ? 14 : f.type === "json" ? 12 : f.type === "textarea" ? 4 : 6}
                        className={cx(inputCls, ["markdown", "json", "faq-list", "feature-list"].includes(f.type) && "font-mono text-[0.8rem]")}
                        spellCheck={f.type !== "json"}
                      />
                    ) : (
                      <input
                        {...common}
                        type={f.type === "date" ? "date" : f.type === "url" ? "url" : f.type === "number" || f.type === "money" ? "text" : "text"}
                        inputMode={f.type === "number" ? "numeric" : f.type === "money" ? "decimal" : undefined}
                        defaultValue={String(value ?? "")}
                        onBlur={hasSlug && titleField?.name === f.name ? onTitleBlur : undefined}
                        className={cx(inputCls, f.type === "slug" && "font-mono")}
                        placeholder={f.type === "money" ? "₹ amount, e.g. 1499" : f.type === "url" ? "https://…" : undefined}
                      />
                    )}
                    {f.help && (
                      <p id={`${id}-help`} className="mt-1 text-xs text-muted">
                        {f.help}
                      </p>
                    )}
                  </>
                )}
                {err && (
                  <p id={`${id}-err`} className="mt-1 text-xs font-medium text-danger">
                    {err}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="sticky bottom-0 -mx-1 flex items-center gap-3 border-t border-line bg-paper/95 px-1 py-4 backdrop-blur">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
        <span className="text-xs text-muted" aria-live="polite">
          {pending ? "Validating on the server…" : ""}
        </span>
      </div>
    </form>
  );
}
