import { useId, type ReactNode } from "react";
import { cx } from "@/components/ui";

const control =
  "mt-2 block w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-base text-ink placeholder:text-muted/80 transition-colors focus:border-ink focus:outline-none aria-[invalid=true]:border-danger";

export function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  defaultValue,
  error,
  hint,
  as = "input",
  options,
  rows = 5,
  placeholder,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
  hint?: ReactNode;
  as?: "input" | "textarea" | "select";
  options?: { value: string; label: string }[];
  rows?: number;
  placeholder?: string;
  maxLength?: number;
}) {
  const id = useId();
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    defaultValue,
    className: control,
  };
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-accent"> *</span> : <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {as === "textarea" ? (
        <textarea {...common} rows={rows} placeholder={placeholder} maxLength={maxLength} />
      ) : as === "select" ? (
        <select {...common}>
          <option value="">Select…</option>
          {options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...common} type={type} autoComplete={autoComplete} placeholder={placeholder} maxLength={maxLength} />
      )}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormMessage({ tone, children }: { tone: "success" | "error"; children: ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cx(
        "rounded-xl border p-4 text-sm",
        tone === "success" ? "border-success text-success" : "border-danger text-danger",
      )}
    >
      {children}
    </div>
  );
}

/** Hidden honeypot field — real users never see or fill it. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
