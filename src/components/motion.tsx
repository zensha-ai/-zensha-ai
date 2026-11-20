import type { CSSProperties, ReactNode } from "react";

/**
 * Calm fade-and-rise on scroll using CSS scroll-driven animations.
 * Progressive enhancement: content is fully visible without JS, in browsers
 * without `animation-timeline`, and when reduced motion is requested.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  return (
    <Tag className={`reveal ${className ?? ""}`} style={{ "--reveal-delay": `${delay}s` } as CSSProperties}>
      {children}
    </Tag>
  );
}

/**
 * Original hero composition: an ensō-like open circle drawn in one stroke,
 * crossed by a precise grid and a rising sequence of data points.
 * Drawn with CSS so it renders immediately (no hydration dependency).
 */
export function HeroMark() {
  const points = [
    [120, 300],
    [168, 252],
    [214, 268],
    [262, 206],
    [306, 222],
    [352, 160],
  ];
  return (
    <svg viewBox="0 0 480 480" role="img" aria-label="Abstract mark: an open circle with a rising line of data points" className="hero-mark h-auto w-full">
      <defs>
        <linearGradient id="enso-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--ink)" />
          <stop offset="60%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-2)" />
        </linearGradient>
        <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g stroke="var(--line-strong)" strokeWidth="1" fill="none" opacity="0.7">
        {[80, 160, 240, 320, 400].map((x) => (
          <line key={`v${x}`} x1={x} y1="40" x2={x} y2="440" />
        ))}
        {[80, 160, 240, 320, 400].map((y) => (
          <line key={`h${y}`} x1="40" y1={y} x2="440" y2={y} />
        ))}
      </g>
      <path className="hero-enso" pathLength={1} d="M 372 112 A 176 176 0 1 0 410 196" fill="none" stroke="url(#enso-grad)" strokeWidth="10" strokeLinecap="round" filter="url(#soft-glow)" />
      <polyline className="hero-line" pathLength={1} points={points.map((p) => p.join(",")).join(" ")} fill="none" stroke="var(--accent-2)" strokeWidth="2" filter="url(#soft-glow)" />
      {points.map(([x, y], i) => (
        <circle
          key={i}
          className="hero-dot"
          style={{ animationDelay: `${1 + i * 0.15}s` }}
          cx={x}
          cy={y}
          r={i === points.length - 1 ? 7 : 4}
          fill={i === points.length - 1 ? "var(--accent-2)" : "var(--paper)"}
          stroke="var(--accent-2)"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}
