import type { CSSProperties } from "react";

/**
 * Original illustration for Trafenix AI: a signalised intersection with
 * vehicles flowing through each approach and turning-movement counters.
 * Decorative; static under reduced motion.
 */
export function TrafficVisual({ className = "" }: { className?: string }) {
  const tint = "#7dd3fc";
  const road = "var(--surface-2)";
  const lane = "var(--line-strong)";
  const cars: { path: string; delay: number; color: string }[] = [
    { path: "M -20 172 L 420 172", delay: 0, color: tint },
    { path: "M 420 148 L -20 148", delay: 1.2, color: "#5eead4" },
    { path: "M 188 -20 L 188 340", delay: 0.6, color: "#c4b5fd" },
    { path: "M 212 340 L 212 -20", delay: 1.8, color: tint },
    { path: "M -20 172 L 180 172 Q 212 172 212 140 L 212 -20", delay: 2.6, color: "#fdba74" },
    { path: "M 420 148 L 220 148 Q 188 148 188 180 L 188 340", delay: 3.4, color: "#5eead4" },
  ];
  return (
    <svg viewBox="0 0 400 320" className={`sv ${className}`} style={{ "--tint": tint, overflow: "hidden" } as CSSProperties} aria-hidden fill="none">
      {/* roads */}
      <rect x="0" y="132" width="400" height="56" fill={road} />
      <rect x="172" y="0" width="56" height="320" fill={road} />
      <line x1="0" y1="160" x2="168" y2="160" stroke={lane} strokeDasharray="8 8" />
      <line x1="232" y1="160" x2="400" y2="160" stroke={lane} strokeDasharray="8 8" />
      <line x1="200" y1="0" x2="200" y2="128" stroke={lane} strokeDasharray="8 8" />
      <line x1="200" y1="192" x2="200" y2="320" stroke={lane} strokeDasharray="8 8" />
      {/* stop lines */}
      <line x1="168" y1="160" x2="168" y2="188" stroke="var(--ink-2)" strokeWidth="2" />
      <line x1="232" y1="132" x2="232" y2="160" stroke="var(--ink-2)" strokeWidth="2" />
      {/* signals */}
      {[
        [154, 118],
        [246, 198],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 6} y={y - 14} width="12" height="28" rx="4" fill="var(--paper)" stroke={lane} />
          <circle cx={x} cy={y - 6} r="3" fill="#f87171" opacity={i ? 1 : 0.25} />
          <circle className="tv-green" cx={x} cy={y + 6} r="3" fill="#4ade80" opacity={i ? 0.25 : 1} />
        </g>
      ))}
      {/* vehicles */}
      {cars.map((c, i) => (
        <rect
          key={i}
          className="tv-car"
          width="14"
          height="8"
          rx="2.5"
          x="-7"
          y="-4"
          fill={c.color}
          style={{ offsetPath: `path("${c.path}")`, animationDelay: `${c.delay}s` } as CSSProperties}
        />
      ))}
      {/* counter panels */}
      {[
        { x: 18, y: 18, label: "TMC", value: "N→E" },
        { x: 290, y: 18, label: "CLASS", value: "4W · 2W" },
        { x: 18, y: 250, label: "QUEUE", value: "approach" },
        { x: 290, y: 250, label: "NMU", value: "ped · cycle" },
      ].map((p) => (
        <g key={p.label}>
          <rect x={p.x} y={p.y} width="92" height="50" rx="8" fill="var(--paper)" stroke={lane} />
          <text x={p.x + 10} y={p.y + 18} fontSize="9" fill="var(--muted)" fontFamily="monospace" letterSpacing="1">
            {p.label}
          </text>
          <text x={p.x + 10} y={p.y + 36} fontSize="11" fill="var(--tint)" fontFamily="monospace">
            {p.value}
          </text>
          <circle className="live-dot" cx={p.x + 80} cy={p.y + 14} r="2.5" fill="var(--tint)" />
        </g>
      ))}
    </svg>
  );
}
