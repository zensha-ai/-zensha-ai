"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/+*";

/** Letters shuffle, then settle left to right (plain-text `.eyebrow` labels). */
function scramble(el: HTMLElement) {
  const final = el.textContent ?? "";
  if (!final.trim()) return;
  el.setAttribute("aria-label", final);
  const start = performance.now();
  const dur = Math.min(900, 300 + final.length * 22);
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / dur);
    const settled = Math.floor(p * final.length);
    let out = final.slice(0, settled);
    for (let i = settled; i < final.length; i++) {
      out += final[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(tick);
    else {
      el.textContent = final;
      el.removeAttribute("aria-label");
    }
  };
  requestAnimationFrame(tick);
}

/** Counts the first number in the text up from zero, keeping its format (₹14,999 · 98 · 4.8). */
function countUp(el: HTMLElement) {
  const final = el.textContent ?? "";
  const m = final.match(/\d[\d,]*(\.\d+)?/);
  if (!m || m.index === undefined) return;
  const target = parseFloat(m[0].replace(/,/g, ""));
  const decimals = m[1] ? m[1].length - 1 : 0;
  const grouped = m[0].includes(",");
  const before = final.slice(0, m.index);
  const after = final.slice(m.index + m[0].length);
  const fmt = (v: number) =>
    grouped ? v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : v.toFixed(decimals);
  el.setAttribute("aria-label", final);
  const start = performance.now();
  const dur = 1300;
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = before + fmt(target * e) + after;
    if (p < 1) requestAnimationFrame(tick);
    else {
      el.textContent = final;
      el.removeAttribute("aria-label");
    }
  };
  requestAnimationFrame(tick);
}

/**
 * Site-wide text motion: scrambling eyebrow labels and counting numbers
 * (`[data-countup]`), each once, when they scroll into view. Server HTML keeps
 * the final text, so nothing changes without JS or with reduced motion.
 */
export function TextEffects() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const el = en.target as HTMLElement;
          io.unobserve(el);
          if (el.matches("[data-countup]")) countUp(el);
          else scramble(el);
        }
      },
      { threshold: 0.6 },
    );
    // Wait a frame so the new route's DOM is in place.
    const id = requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>("main .eyebrow, main [data-countup]").forEach((el) => {
        if (el.matches("[data-countup]") || el.children.length === 0) io.observe(el);
      });
    });
    return () => {
      cancelAnimationFrame(id);
      io.disconnect();
    };
  }, [pathname]);
  return null;
}
