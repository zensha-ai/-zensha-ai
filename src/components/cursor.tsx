"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide custom cursor: a red dot plus a trailing ring.
 * - grows over links and buttons
 * - becomes a filled "VIEW" bubble over portfolio/service cards ([data-card], .svc-card)
 * - hides over text fields (the native caret is kept there)
 * Primary buttons (.magnetic) lean toward the pointer.
 * Only on fine pointers; the native cursor is hidden only once this runs.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring || !window.matchMedia("(pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("has-cursor");

    let x = -100, y = -100, rx = -100, ry = -100, frame = 0, shown = false;
    let magnet: HTMLElement | null = null;

    const tick = () => {
      const k = reduce ? 1 : 0.18;
      rx += (x - rx) * k;
      ry += (y - ry) * k;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const setMagnet = (el: HTMLElement | null, e?: PointerEvent) => {
      if (magnet && magnet !== el) magnet.style.transform = "";
      magnet = el;
      if (el && e && !reduce) {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
        el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      }
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        rx = x;
        ry = y;
        shown = true;
        document.documentElement.dataset.cursor = "on";
      }
      const t = e.target as Element | null;
      const field = t?.closest?.("input, textarea, select, [contenteditable='true']");
      const card = t?.closest?.("[data-card], .svc-card");
      const link = t?.closest?.("a, button, [role='button'], summary, label");
      const state = field ? "hidden" : card && !t?.closest?.("a[target], button") ? "view" : link ? "link" : "default";
      ring.dataset.state = state;
      dot.dataset.state = state;
      setMagnet((t?.closest?.(".magnetic") as HTMLElement | null) ?? null, e);
    };
    const onLeave = () => {
      document.documentElement.dataset.cursor = "off";
      shown = false;
      setMagnet(null);
    };
    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(frame);
      setMagnet(null);
      document.documentElement.classList.remove("has-cursor");
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden className="cur-ring" data-state="default">
        <span>View</span>
      </div>
      <div ref={dotRef} aria-hidden className="cur-dot" data-state="default" />
    </>
  );
}
