"use client";

import { useFormStatus } from "react-dom";
import { cx } from "@/components/ui";

/** Submit button that asks for confirmation before a destructive or significant action. */
export function ConfirmButton({
  children,
  confirm: message,
  tone = "danger",
  className,
}: {
  children: React.ReactNode;
  confirm: string;
  tone?: "danger" | "neutral";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={cx(
        "inline-flex min-h-9 items-center rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
        tone === "danger" ? "border-danger text-danger hover:bg-danger hover:text-paper" : "border-line-strong text-ink hover:border-ink",
        className,
      )}
    >
      {pending ? "Working…" : children}
    </button>
  );
}

export function SubmitButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cx(
        "inline-flex min-h-9 items-center rounded-full border border-line-strong px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-ink disabled:opacity-50",
        className,
      )}
    >
      {pending ? "Working…" : children}
    </button>
  );
}
