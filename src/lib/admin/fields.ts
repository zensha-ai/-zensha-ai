import { z } from "zod";

/**
 * Config-driven form fields for the admin CMS. Field definitions are plain,
 * serializable objects so they can be passed to the client form component.
 */
export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "slug"
  | "url"
  | "date"
  | "number"
  | "money"
  | "boolean"
  | "select"
  | "string-list"
  | "json"
  | "faq-list"
  | "feature-list";

export type Field = {
  /** Column name, or a dotted path inside a jsonb document (e.g. "cta.heading"). */
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  max?: number;
  /** Visual grouping heading shown above this field. */
  section?: string;
  /** Half-width on large screens. */
  half?: boolean;
  defaultValue?: string | boolean;
};

export type FormState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string | boolean>;
};

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SEP = " :: ";

// ---------------------------------------------------------------------------
// DB value → form value
// ---------------------------------------------------------------------------
export function toFormValue(field: Field, value: unknown): string | boolean {
  if (field.type === "boolean") return Boolean(value ?? field.defaultValue ?? false);
  if (value === null || value === undefined) return typeof field.defaultValue === "string" ? field.defaultValue : "";
  switch (field.type) {
    case "money":
      return typeof value === "number" ? String(value / 100) : "";
    case "number":
      return String(value);
    case "date":
      return typeof value === "string" ? value.slice(0, 10) : "";
    case "string-list":
      return Array.isArray(value) ? value.join("\n") : "";
    case "faq-list":
      return Array.isArray(value) ? value.map((f: { q?: string; a?: string }) => `${f.q ?? ""}${SEP}${f.a ?? ""}`).join("\n") : "";
    case "feature-list":
      return Array.isArray(value)
        ? value.map((f: { title?: string; description?: string }) => `${f.title ?? ""}${SEP}${f.description ?? ""}`).join("\n")
        : "";
    case "json":
      return JSON.stringify(value, null, 2);
    default:
      return String(value);
  }
}

// ---------------------------------------------------------------------------
// Raw form value → typed input (validation happens in zod afterwards)
// ---------------------------------------------------------------------------
const lines = (s: string) =>
  s
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

const splitPair = (line: string) => {
  const i = line.indexOf("::");
  if (i === -1) return [line.trim(), ""] as const;
  return [line.slice(0, i).trim(), line.slice(i + 2).trim()] as const;
};

export function rawToInput(field: Field, raw: FormDataEntryValue | null): unknown {
  if (field.type === "boolean") return raw === "on" || raw === "true";
  const s = typeof raw === "string" ? raw : "";
  switch (field.type) {
    case "number":
      return s.trim() === "" ? null : Number(s);
    case "money": {
      if (s.trim() === "") return null;
      const n = Number(s.replace(/[₹,\s]/g, ""));
      return Number.isFinite(n) ? Math.round(n * 100) : NaN;
    }
    case "string-list":
      return lines(s);
    case "faq-list":
      return lines(s).map((l) => {
        const [q, a] = splitPair(l);
        return { q, a };
      });
    case "feature-list":
      return lines(s).map((l) => {
        const [title, description] = splitPair(l);
        return { title, description };
      });
    case "json":
      if (s.trim() === "") return null;
      try {
        return JSON.parse(s);
      } catch {
        return { __invalidJson: true };
      }
    default:
      return s.trim();
  }
}

// ---------------------------------------------------------------------------
// zod schema per field
// ---------------------------------------------------------------------------
const REQUIRED = "This field is required.";

function optionalString(schema: z.ZodString, required?: boolean) {
  return required ? schema.min(1, REQUIRED) : schema.transform((v) => (v === "" ? null : v));
}

export function fieldSchema(f: Field): z.ZodType {
  switch (f.type) {
    case "text":
      return optionalString(z.string().max(f.max ?? 300, `Keep this under ${f.max ?? 300} characters.`), f.required);
    case "textarea":
    case "markdown":
      return optionalString(z.string().max(f.max ?? 50000, "This text is too long."), f.required);
    case "slug":
      return z
        .string()
        .min(1, REQUIRED)
        .max(80, "Keep slugs under 80 characters.")
        .regex(SLUG_RE, "Use lowercase letters, numbers and single hyphens only.");
    case "url":
      return z
        .string()
        .max(2000)
        .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v) || /^\/[^\s/]\S*$/.test(v), "Enter a full https:// URL or a site path starting with /.")
        .refine((v) => !f.required || v !== "", REQUIRED)
        .transform((v) => (v === "" ? null : v));
    case "date":
      return z
        .string()
        .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Use a valid date.")
        .refine((v) => !f.required || v !== "", REQUIRED)
        .transform((v) => (v === "" ? null : v));
    case "number": {
      const n = z.number({ error: "Enter a whole number." }).int("Enter a whole number.").min(0, "Must be zero or more.").max(1_000_000);
      return f.required ? n : n.nullable();
    }
    case "money": {
      const n = z
        .number({ error: "Enter an amount in rupees, e.g. 1499 or 1499.50." })
        .int()
        .min(0, "Amount cannot be negative.")
        .max(100_000_000, "Amount is too large.");
      return f.required ? n : n.nullable();
    }
    case "boolean":
      return z.boolean();
    case "select": {
      const values = (f.options ?? []).map((o) => o.value);
      const s = z.string().refine((v) => (v === "" && !f.required) || values.includes(v), "Choose one of the listed options.");
      return s.transform((v) => (v === "" ? null : v));
    }
    case "string-list": {
      const arr = z.array(z.string().max(500, "Each line must be under 500 characters.")).max(100, "Too many lines (max 100).");
      return f.required ? arr.min(1, "Add at least one line.") : arr;
    }
    case "faq-list":
      return z
        .array(
          z.object({
            q: z.string().min(1, "Each line needs a question before ' :: '."),
            a: z.string().min(1, "Each line needs an answer after ' :: '."),
          }),
        )
        .max(50);
    case "feature-list":
      return z
        .array(
          z.object({
            title: z.string().min(1, "Each line needs a title before ' :: '."),
            description: z.string(),
          }),
        )
        .max(30);
    case "json":
      return z
        .unknown()
        .refine((v) => !(v && typeof v === "object" && "__invalidJson" in (v as object)), "This is not valid JSON.")
        .refine((v) => !f.required || v !== null, REQUIRED);
  }
}

export function buildSchema(fields: Field[]) {
  const shape: Record<string, z.ZodType> = {};
  for (const f of fields) shape[f.name] = fieldSchema(f);
  return z.object(shape);
}

/** Reads + validates a FormData against field definitions. */
export function parseForm(
  fields: Field[],
  formData: FormData,
  refine?: (data: Record<string, unknown>) => Record<string, string>,
): { ok: true; data: Record<string, unknown>; values: Record<string, string | boolean> } | { ok: false; errors: Record<string, string>; values: Record<string, string | boolean> } {
  const input: Record<string, unknown> = {};
  const values: Record<string, string | boolean> = {};
  for (const f of fields) {
    const raw = formData.get(f.name);
    input[f.name] = rawToInput(f, raw);
    values[f.name] = f.type === "boolean" ? raw === "on" : typeof raw === "string" ? raw : "";
  }
  const result = buildSchema(fields).safeParse(input);
  const errors: Record<string, string> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "_form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors, values };
  }
  const extra = refine?.(result.data) ?? {};
  if (Object.keys(extra).length) return { ok: false, errors: extra, values };
  return { ok: true, data: result.data, values };
}

/** Turns {"cta.heading": "x"} into {cta: {heading: "x"}}. */
export function nest(flat: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(flat)) {
    const parts = k.split(".");
    let cur = out;
    parts.slice(0, -1).forEach((p) => {
      cur[p] = (cur[p] as Record<string, unknown>) ?? {};
      cur = cur[p] as Record<string, unknown>;
    });
    cur[parts[parts.length - 1]] = v;
  }
  return out;
}

export function getPath(obj: Record<string, unknown> | null | undefined, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, p) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[p] : undefined), obj);
}

export const slugifyClient = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
