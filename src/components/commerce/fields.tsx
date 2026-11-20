import type { ReactNode } from "react";
import { cx } from "@/components/ui";

const inputCls =
  "mt-2 block w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-base text-ink placeholder:text-muted focus:border-ink focus:outline-none aria-[invalid=true]:border-danger";

export function TextField({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  defaultValue,
  error,
  hint,
  minLength,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
  hint?: string;
  minLength?: number;
  maxLength?: number;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && <span aria-hidden className="text-accent"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        minLength={minLength}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={inputCls}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function Notice({ tone, children }: { tone: "success" | "error" | "info"; children: ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cx(
        "rounded-xl border p-4 text-sm",
        tone === "success" && "border-success text-success",
        tone === "error" && "border-danger text-danger",
        tone === "info" && "border-line-strong bg-surface text-ink-2",
      )}
    >
      {children}
    </div>
  );
}
