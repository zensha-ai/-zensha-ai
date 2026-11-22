import Link from "next/link";
import { Fragment, type ComponentProps, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { NetworkField } from "@/components/effects";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

type BtnVariant = "primary" | "secondary" | "ghost";
const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors duration-300 ease-[var(--ease-calm)] disabled:cursor-not-allowed disabled:opacity-50 min-h-11";
const btnVariants: Record<BtnVariant, string> = {
  primary: "magnetic shine fill-wipe bg-ink text-paper hover:text-on-accent shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_30px_-8px_var(--glow)]",
  secondary: "magnetic border border-line-strong text-ink hover:border-ink hover:bg-surface",
  ghost: "text-ink underline-offset-4 hover:underline px-0",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  arrow = false,
  ...rest
}: { href: string; variant?: BtnVariant; arrow?: boolean } & Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link href={href} className={cx(btnBase, btnVariants[variant], className)} {...rest}>
      {children}
      {arrow && <ArrowUpRight aria-hidden className="size-4" />}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  ...rest
}: { variant?: BtnVariant } & ComponentProps<"button">) {
  return <button className={cx(btnBase, btnVariants[variant], className)} {...rest} />;
}

export function Section({
  children,
  className,
  id,
  tone = "paper",
  ...rest
}: { tone?: "paper" | "alt" | "ink" } & ComponentProps<"section">) {
  const tones = {
    paper: "",
    alt: "tone-cream",
    ink: "relative overflow-hidden border-y border-line bg-paper-2",
  };
  return (
    <section id={id} className={cx("py-20 sm:py-28", tones[tone], className)} {...rest}>
      {tone === "ink" && <div aria-hidden className="aurora opacity-70" />}
      <div className="container-z relative">{children}</div>
    </section>
  );
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  text,
  action,
  as: Tag = "h2",
}: {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  action?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="reveal mb-12 grid gap-6 border-t border-line pt-6 md:grid-cols-12 md:gap-10">
      <p className="eyebrow md:col-span-3">
        {index && <span className="mr-3 text-accent">{index}</span>}
        {eyebrow}
      </p>
      <div className="md:col-span-9">
        <Tag className="reveal-title display-2 max-w-4xl text-balance">{title}</Tag>
        {text && <p className="lede mt-5 max-w-2xl">{text}</p>}
        {action && <div className="mt-8">{action}</div>}
      </div>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  actions,
  aside,
  visual,
  strip,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  /** Animated illustration shown beside the text (replaces `aside`). */
  visual?: ReactNode;
  /** Slim full-width band along the bottom edge of a visual hero. */
  strip?: ReactNode;
  children?: ReactNode;
}) {
  if (visual) {
    // Same composition as the homepage hero: text left, animation right, vertically centred.
    return (
      <header className="relative flex flex-col overflow-hidden border-b border-line lg:min-h-[calc(100svh-4.5rem)]">
        <div aria-hidden className="aurora" />
        <div aria-hidden className="grid-paper pointer-events-none absolute inset-0 opacity-60" />
        <NetworkField className="absolute inset-0 h-full w-full opacity-60" />
        <div className="container-z relative grid flex-1 items-center gap-12 pb-16 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-8 lg:py-12">
          <div className="lg:col-span-6">
            <p className="eyebrow inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-surface/70 px-3 py-1.5 backdrop-blur">
              <span aria-hidden className="live-dot size-1.5 rounded-full bg-accent-2" />
              {eyebrow}
            </p>
            <h1 className="display-1 mt-7 text-balance">{typeof title === "string" ? <SplitWords text={title} accentLast /> : title}</h1>
            {text && (
              <p className="lede fade-up mt-8 max-w-xl" style={{ "--d": "0.45s" } as React.CSSProperties}>
                {text}
              </p>
            )}
            {actions && (
              <div className="fade-up mt-10 flex flex-wrap gap-3" style={{ "--d": "0.6s" } as React.CSSProperties}>
                {actions}
              </div>
            )}
            {children}
          </div>
          <div className="fade-up mx-auto w-full max-w-xl lg:col-span-6 lg:max-w-none xl:-mr-8" style={{ "--d": "0.2s" } as React.CSSProperties}>
            <div className="flex items-center justify-center">{visual}</div>
          </div>
        </div>
        {strip && <div className="relative border-t border-line bg-paper/40 backdrop-blur">{strip}</div>}
      </header>
    );
  }

  return (
    <header className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="aurora" />
      <div aria-hidden className="grid-paper pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-z relative grid gap-12 pb-16 pt-14 sm:pb-24 sm:pt-20 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-1 mt-6 text-balance">{typeof title === "string" ? <SplitWords text={title} /> : title}</h1>
          {text && (
            <p className="lede fade-up mt-8 max-w-2xl" style={{ "--d": "0.35s" } as React.CSSProperties}>
              {text}
            </p>
          )}
          {actions && (
            <div className="fade-up mt-10 flex flex-wrap gap-3" style={{ "--d": "0.5s" } as React.CSSProperties}>
              {actions}
            </div>
          )}
          {children}
        </div>
        {aside && <div className="lg:col-span-4 lg:self-end">{aside}</div>}
      </div>
    </header>
  );
}

/** Splits a headline into words for a staggered CSS reveal. Screen readers get the plain text. */
export function SplitWords({ text, accentLast = false }: { text: string; accentLast?: boolean }) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="word-mask">
              <span className={cx("word", accentLast && i === words.length - 1 && "text-gradient")} style={{ "--i": i } as React.CSSProperties}>
                {w}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "success" | "warn" }) {
  const tones = {
    neutral: "border-line-strong text-ink-2",
    accent: "border-accent text-accent",
    success: "border-success text-success",
    warn: "border-accent bg-accent-soft text-accent",
  };
  return (
    <span className={cx("inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-[0.1em]", tones[tone])}>
      {children}
    </span>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span className="rounded border border-dashed border-line-strong px-1.5 py-0.5 font-mono text-xs text-muted" title="Pending verified information">
      {children}
    </span>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-line-strong bg-surface p-8 sm:p-12">
      <span aria-hidden className="block size-10 rounded-full border border-line-strong" />
      <h3 className="display-3">{title}</h3>
      <p className="max-w-xl text-muted">{text}</p>
      {action}
    </div>
  );
}

export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-medium [&::-webkit-details-marker]:hidden">
            {f.q}
            <span aria-hidden className="mt-1 font-mono text-muted transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 max-w-3xl text-ink-2">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="container-z pt-6">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-2">
            {it.href ? (
              <Link href={it.href} className="hover:text-ink">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {it.label}
              </span>
            )}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CtaBand({
  title,
  text,
  primary,
  secondary,
}: {
  title: string;
  text: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-z">
        <div className="relative overflow-hidden rounded-3xl border border-line-strong bg-surface px-6 py-16 sm:px-14 sm:py-24">
          <div aria-hidden className="aurora" />
          <div aria-hidden className="grid-paper absolute inset-0 opacity-40" />
          <div className="relative grid gap-10 lg:grid-cols-12">
            <h2 className="display-2 text-balance lg:col-span-7">{title}</h2>
            <div className="lg:col-span-5 lg:pt-3">
              <p className="text-lg leading-relaxed text-ink-2">{text}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={primary.href} className={cx(btnBase, btnVariants.primary)}>
                  {primary.label}
                  <ArrowUpRight aria-hidden className="size-4" />
                </Link>
                {secondary && (
                  <Link href={secondary.href} className={cx(btnBase, btnVariants.secondary)}>
                    {secondary.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="rounded-md bg-paper-2 px-2 py-1 font-mono text-xs text-ink-2">{children}</span>;
}

export function DraftNotice({ children }: { children: ReactNode }) {
  return (
    <div role="note" className="rounded-xl border border-accent bg-accent-soft p-4 text-sm text-ink">
      {children}
    </div>
  );
}
