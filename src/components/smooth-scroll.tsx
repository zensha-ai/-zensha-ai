"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Buttery smooth wheel scrolling (Lenis). Off for reduced motion and touch. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -96 } });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    // Hold scrolling while the opening loader plays.
    if (document.documentElement.dataset.intro === "play") {
      lenis.stop();
      window.setTimeout(() => lenis.start(), 2200);
    }
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}
