"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, ShoppingBag, User, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { mainNav, type NavItem } from "@/config/navigation";
import { useCart } from "@/lib/cart";
import { Logo } from "./logo";
import { NavIcon } from "@/components/nav-icon";
import { cx } from "@/components/ui";

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCart().length;
  const navRef = useRef<HTMLElement>(null);

  // Close menus on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
    setMobile(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  return (
    <header
      className={cx(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || open || mobile ? "border-line bg-paper/92 backdrop-blur-md" : "border-transparent bg-paper",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <div className="container-z flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <Logo />

        <nav ref={navRef} aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <DesktopItem
                key={item.href}
                item={item}
                active={isActive(pathname, item.href)}
                open={open === item.label}
                onToggle={(v) => setOpen(v ? item.label : null)}
              />
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/account" aria-label="My account" className="hidden rounded-full p-2.5 text-ink-2 hover:bg-paper-2 hover:text-ink sm:inline-flex">
            <User className="size-[1.15rem]" aria-hidden />
          </Link>
          <Link href="/cart" aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`} className="relative inline-flex rounded-full p-2.5 text-ink-2 hover:bg-paper-2 hover:text-ink">
            <ShoppingBag className="size-[1.15rem]" aria-hidden />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-accent font-mono text-[0.6rem] text-on-accent">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/contact"
            className="hidden min-h-10 items-center magnetic rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition-colors hover:bg-[#a90e02] sm:inline-flex"
          >
            Let&rsquo;s Talk
          </Link>
          <button
            type="button"
            className="inline-flex rounded-full p-2.5 xl:hidden"
            aria-expanded={mobile}
            aria-controls="mobile-menu"
            aria-label={mobile ? "Close menu" : "Open menu"}
            onClick={() => setMobile((v) => !v)}
          >
            {mobile ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>{mobile && <MobileMenu key="mobile" pathname={pathname} />}</AnimatePresence>
    </header>
  );
}

function DesktopItem({
  item,
  active,
  open,
  onToggle,
}: {
  item: NavItem;
  active: boolean;
  open: boolean;
  onToggle: (v: boolean) => void;
}) {
  const panelId = useId();
  const linkCls = cx(
    "relative inline-flex items-center gap-1 rounded-full px-3 py-2 text-[0.92rem] transition-colors",
    active ? "text-ink" : "text-ink-2 hover:text-ink",
  );
  if (!item.children) {
    return (
      <li>
        <Link href={item.href} className={linkCls} aria-current={active ? "page" : undefined}>
          {item.label}
          {active && <span aria-hidden className="absolute inset-x-3 -bottom-0.5 h-px bg-accent" />}
        </Link>
      </li>
    );
  }
  const wide = item.children.length > 6;
  return (
    <li className="relative" onMouseLeave={() => onToggle(false)}>
      <div className="flex items-center" onMouseEnter={() => onToggle(true)}>
        <Link href={item.href} className={cx(linkCls, "pr-1")} aria-current={active ? "page" : undefined}>
          {item.label}
          {active && <span aria-hidden className="absolute inset-x-3 -bottom-0.5 h-px bg-accent" />}
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${item.label} menu`}
          onClick={() => onToggle(!open)}
          className="rounded-full p-1 text-muted hover:text-ink"
        >
          <ChevronDown className={cx("size-3.5 transition-transform", open && "rotate-180")} aria-hidden />
        </button>
      </div>
      <div
        id={panelId}
        hidden={!open}
        className={cx("absolute left-1/2 top-full -translate-x-1/2 pt-3", wide ? "w-[min(46rem,92vw)]" : "w-[25rem]")}
      >
        <div className="rounded-3xl border border-line-strong bg-paper p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
          <ul className={cx("grid gap-0.5", wide && "grid-cols-2")}>
            {item.children.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="group/item flex items-start gap-3.5 rounded-2xl p-3 transition-colors hover:bg-surface-2">
                  <NavIcon name={c.icon} tint={c.tint} />
                  <span className="min-w-0 pt-0.5">
                    <span className="block text-sm font-medium text-ink">{c.label}</span>
                    {c.description && <span className="mt-1 block text-xs leading-relaxed text-muted">{c.description}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-line px-3 pb-1 pt-3">
            <Link href={item.href} className="group/all flex items-center justify-between text-sm font-medium text-accent-2 hover:text-ink">
              View all {item.label.toLowerCase()}
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover/all:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      id="mobile-menu"
      className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-line bg-paper xl:hidden"
      initial={reduce ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav aria-label="Mobile" className="container-z py-6">
        <ul className="divide-y divide-line">
          {mainNav.map((item) => (
            <li key={item.href} className="py-1">
              {item.children ? (
                <details open={isActive(pathname, item.href) && item.href !== "/"}>
                  <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-2xl font-medium [&::-webkit-details-marker]:hidden">
                    {item.label}
                    <ChevronDown className="size-5 text-muted" aria-hidden />
                  </summary>
                  <ul className="mb-3 grid gap-1 pl-1">
                    <li>
                      <Link href={item.href} className="block py-2 text-ink-2">
                        Overview
                      </Link>
                    </li>
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="group/item flex items-center gap-3 py-2 text-ink-2">
                          <NavIcon name={c.icon} tint={c.tint} />
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <Link
                  href={item.href}
                  className="block py-3 text-2xl font-medium"
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-8 grid gap-3">
          <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink text-paper">
            Let&rsquo;s Talk
          </Link>
          <Link href="/account" className="inline-flex min-h-12 items-center justify-center rounded-full border border-line-strong">
            My account
          </Link>
        </div>
      </nav>
    </motion.div>
  );
}
