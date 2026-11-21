import type { CSSProperties } from "react";

/** Per-service tint used by the card glow, icon and illustration. */
export const serviceTints: Record<string, string> = {
  "website-design-development": "var(--accent)",
  "web-application-development": "var(--accent)",
  "mobile-application-development": "var(--accent)",
  "ai-development-intelligent-solutions": "var(--accent)",
  "custom-software-development": "var(--accent)",
  "business-process-automation": "var(--accent-2)",
  "api-development-integrations": "var(--accent)",
  "whatsapp-instagram-automation": "var(--accent)",
  "digital-marketing-seo": "var(--accent)",
  "ai-chatbot-development": "var(--accent)",
  "data-engineering-analytics": "var(--accent-2)",
};

/**
 * Small, original animated illustration per service (pure SVG + CSS).
 * Static when reduced motion is requested; decorative (aria-hidden).
 */
export function ServiceVisual({ slug, className = "" }: { slug: string; className?: string }) {
  const tint = serviceTints[slug] ?? "var(--accent)";
  const style = { "--tint": tint } as CSSProperties;
  const common = { viewBox: "0 0 200 120", className: `sv ${className}`, style, "aria-hidden": true, fill: "none" } as const;
  const line = "var(--line-strong)";

  switch (slug) {
    case "website-design-development":
      return (
        <svg {...common}>
          <rect x="30" y="14" width="140" height="92" rx="8" stroke={line} />
          <line x1="30" y1="30" x2="170" y2="30" stroke={line} />
          {[40, 50, 60].map((x) => (
            <circle key={x} cx={x} cy="22" r="2.5" fill={line} />
          ))}
          <rect className="sv-build" style={{ animationDelay: "0s" }} x="42" y="40" width="70" height="10" rx="3" fill="var(--tint)" />
          <rect className="sv-build" style={{ animationDelay: ".25s" }} x="42" y="56" width="116" height="5" rx="2.5" fill={line} />
          <rect className="sv-build" style={{ animationDelay: ".4s" }} x="42" y="65" width="96" height="5" rx="2.5" fill={line} />
          <rect className="sv-build" style={{ animationDelay: ".6s" }} x="42" y="80" width="34" height="14" rx="7" fill="var(--tint)" opacity=".85" />
          <rect className="sv-build" style={{ animationDelay: ".75s" }} x="122" y="74" width="36" height="22" rx="4" stroke="var(--tint)" />
        </svg>
      );
    case "web-application-development":
      return (
        <svg {...common}>
          <rect x="26" y="14" width="148" height="92" rx="8" stroke={line} />
          <rect x="26" y="14" width="34" height="92" rx="8" fill="var(--surface-2)" />
          {[30, 42, 54].map((y) => (
            <rect key={y} x="34" y={y} width="18" height="4" rx="2" fill={line} />
          ))}
          {[30, 46, 62, 78, 94, 110, 126, 142].map((x, i) => (
            <rect
              key={x}
              className="sv-bar"
              style={{ animationDelay: `${i * 0.12}s`, transformOrigin: `${x + 5}px 94px` }}
              x={x + 40}
              y={94 - (20 + ((i * 37) % 45))}
              width="9"
              height={20 + ((i * 37) % 45)}
              rx="2"
              fill={i === 5 ? "var(--tint)" : "color-mix(in oklab, var(--tint) 35%, transparent)"}
            />
          ))}
        </svg>
      );
    case "mobile-application-development":
      return (
        <svg {...common}>
          <rect x="72" y="8" width="56" height="104" rx="12" stroke={line} />
          <rect x="92" y="13" width="16" height="4" rx="2" fill={line} />
          <g className="sv-notify">
            <rect x="78" y="26" width="44" height="18" rx="5" fill="var(--surface-2)" stroke="var(--tint)" />
            <circle cx="86" cy="35" r="3.5" fill="var(--tint)" />
            <rect x="93" y="31" width="24" height="3" rx="1.5" fill={line} />
            <rect x="93" y="37" width="16" height="3" rx="1.5" fill={line} />
          </g>
          {[54, 66, 78].map((y, i) => (
            <rect key={y} x="80" y={y} width={40 - i * 8} height="7" rx="3.5" fill={line} />
          ))}
          <circle className="sv-pulse" cx="100" cy="100" r="5" stroke="var(--tint)" />
        </svg>
      );
    case "ai-development-intelligent-solutions":
      return (
        <svg {...common}>
          <circle cx="100" cy="60" r="14" fill="color-mix(in oklab, var(--tint) 25%, transparent)" stroke="var(--tint)" />
          <path d="M100 51 L102.5 57.5 L109 60 L102.5 62.5 L100 69 L97.5 62.5 L91 60 L97.5 57.5 Z" fill="var(--tint)" />
          <ellipse cx="100" cy="60" rx="70" ry="26" stroke={line} />
          <ellipse cx="100" cy="60" rx="44" ry="44" stroke={line} strokeDasharray="2 5" />
          <g className="sv-orbit" style={{ transformOrigin: "100px 60px" }}>
            <circle cx="170" cy="60" r="4" fill="var(--tint)" />
            <circle cx="30" cy="60" r="3" fill={line} />
          </g>
          <g className="sv-orbit sv-orbit-rev" style={{ transformOrigin: "100px 60px" }}>
            <circle cx="100" cy="16" r="3.5" fill="var(--tint)" opacity=".7" />
          </g>
        </svg>
      );
    case "custom-software-development":
      return (
        <svg {...common}>
          {[
            [62, 74, 0],
            [102, 74, 0.15],
            [62, 50, 0.3],
            [102, 50, 0.45],
            [82, 26, 0.6],
          ].map(([x, y, d], i) => (
            <rect
              key={i}
              className="sv-drop"
              style={{ animationDelay: `${d}s` }}
              x={x}
              y={y}
              width="36"
              height="20"
              rx="4"
              fill={i === 4 ? "var(--tint)" : "var(--surface-2)"}
              stroke={i === 4 ? "var(--tint)" : line}
            />
          ))}
          <line x1="40" y1="98" x2="160" y2="98" stroke={line} />
        </svg>
      );
    case "business-process-automation":
      return (
        <svg {...common}>
          <path d="M24 86 C 60 86, 60 34, 100 34 S 140 86, 176 86" stroke={line} strokeWidth="1.5" />
          <path className="sv-flow" d="M24 86 C 60 86, 60 34, 100 34 S 140 86, 176 86" stroke="var(--tint)" strokeWidth="2" strokeDasharray="6 14" />
          {[
            [24, 86],
            [100, 34],
            [176, 86],
          ].map(([x, y], i) => (
            <g key={i}>
              <rect x={x - 12} y={y - 12} width="24" height="24" rx="6" fill="var(--surface-2)" stroke={i === 1 ? "var(--tint)" : line} />
              <circle cx={x} cy={y} r="3.5" fill={i === 1 ? "var(--tint)" : line} />
            </g>
          ))}
        </svg>
      );
    case "api-development-integrations":
      return (
        <svg {...common}>
          <rect x="18" y="38" width="44" height="44" rx="10" fill="var(--surface-2)" stroke={line} />
          <rect x="138" y="38" width="44" height="44" rx="10" fill="var(--surface-2)" stroke="var(--tint)" />
          <text x="40" y="64" textAnchor="middle" fontSize="11" fill="var(--muted)" fontFamily="monospace">{"{ }"}</text>
          <text x="160" y="64" textAnchor="middle" fontSize="11" fill="var(--tint)" fontFamily="monospace">API</text>
          <line x1="62" y1="52" x2="138" y2="52" stroke={line} />
          <line x1="62" y1="68" x2="138" y2="68" stroke={line} />
          <circle className="sv-packet" cx="62" cy="52" r="3.5" fill="var(--tint)" />
          <circle className="sv-packet sv-packet-rev" cx="138" cy="68" r="3.5" fill="var(--tint)" opacity=".7" />
        </svg>
      );
    case "whatsapp-instagram-automation":
      return (
        <svg {...common}>
          {[
            { x: 30, y: 18, w: 86, left: true, d: 0 },
            { x: 84, y: 46, w: 86, left: false, d: 0.5 },
            { x: 30, y: 74, w: 64, left: true, d: 1 },
          ].map((b, i) => (
            <g key={i} className="sv-bubble" style={{ animationDelay: `${b.d}s` }}>
              <rect x={b.x} y={b.y} width={b.w} height="22" rx="11" fill={b.left ? "var(--surface-2)" : "color-mix(in oklab, var(--tint) 30%, transparent)"} stroke={b.left ? line : "var(--tint)"} />
              <rect x={b.x + 12} y={b.y + 9} width={b.w - 30} height="4" rx="2" fill={b.left ? line : "var(--tint)"} />
            </g>
          ))}
          <circle cx="166" cy="96" r="7" fill="var(--tint)" />
          <path d="M163 96 l2.5 2.5 4.5 -5" stroke="var(--paper)" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "digital-marketing-seo":
      return (
        <svg {...common}>
          <line x1="28" y1="100" x2="176" y2="100" stroke={line} />
          <polyline className="sv-draw" pathLength={1} points="30,90 62,78 92,82 124,56 156,40 176,24" stroke="var(--tint)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          {[
            [62, 78],
            [92, 82],
            [124, 56],
            [156, 40],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="3" fill="var(--paper)" stroke="var(--tint)" strokeWidth="1.5" />
          ))}
          <g className="sv-float">
            <circle cx="46" cy="34" r="12" stroke={line} strokeWidth="2" />
            <line x1="55" y1="43" x2="64" y2="52" stroke={line} strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <text x="176" y="16" textAnchor="end" fontSize="10" fill="var(--tint)" fontFamily="monospace">#1</text>
        </svg>
      );
    case "ai-chatbot-development":
      return (
        <svg {...common}>
          <rect x="60" y="20" width="80" height="62" rx="18" fill="var(--surface-2)" stroke={line} />
          <circle cx="86" cy="48" r="5" fill="var(--tint)" />
          <circle cx="114" cy="48" r="5" fill="var(--tint)" />
          <line x1="100" y1="8" x2="100" y2="20" stroke={line} />
          <circle cx="100" cy="7" r="3" fill="var(--tint)" />
          <rect x="118" y="88" width="62" height="22" rx="11" fill="color-mix(in oklab, var(--tint) 25%, transparent)" stroke="var(--tint)" />
          {[136, 149, 162].map((x, i) => (
            <circle key={x} className="sv-typing" style={{ animationDelay: `${i * 0.18}s` }} cx={x} cy="99" r="2.8" fill="var(--tint)" />
          ))}
        </svg>
      );
    case "data-engineering-analytics":
      return (
        <svg {...common}>
          {[26, 60, 94].map((y) => (
            <rect key={y} x="10" y={y - 8} width="30" height="16" rx="4" fill="var(--surface-2)" stroke={line} />
          ))}
          {[26, 60, 94].map((y) => (
            <path key={y} d={`M40 ${y} C 70 ${y}, 70 60, 98 60`} stroke={line} />
          ))}
          {[26, 60, 94].map((y, i) => (
            <path key={`f${y}`} className="sv-flow" style={{ animationDelay: `${i * 0.3}s` }} d={`M40 ${y} C 70 ${y}, 70 60, 98 60`} stroke="var(--tint)" strokeWidth="2" strokeDasharray="4 12" />
          ))}
          <rect x="98" y="48" width="34" height="24" rx="6" fill="color-mix(in oklab, var(--tint) 25%, transparent)" stroke="var(--tint)" />
          <line x1="132" y1="60" x2="152" y2="60" stroke={line} />
          <path className="sv-flow" d="M132 60 L152 60" stroke="var(--tint)" strokeWidth="2" strokeDasharray="4 8" />
          <ellipse cx="172" cy="44" rx="18" ry="6" stroke="var(--tint)" />
          <path d="M154 44 v32 a18 6 0 0 0 36 0 v-32" stroke="var(--tint)" />
          <path d="M154 60 a18 6 0 0 0 36 0" stroke={line} />
        </svg>
      );
    default:
      return null;
  }
}
