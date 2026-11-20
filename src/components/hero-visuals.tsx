import type { CSSProperties } from "react";
import { AppWindow, Bot, Boxes, Database, Layout, MessageCircle, Plug, Search, Smartphone, Sparkles, Workflow, type LucideIcon } from "lucide-react";
import { serviceTints } from "@/components/service-visual";

/*
 * Animated page-hero illustrations. Pure SVG + CSS (no hydration needed),
 * decorative (aria-hidden), and static under prefers-reduced-motion.
 */

const line = "var(--line-strong)";
const svgProps = { viewBox: "0 0 400 400", className: "hv h-auto w-full", "aria-hidden": true, fill: "none" } as const;

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--ink)" />
        <stop offset="0.55" stopColor="var(--accent)" />
        <stop offset="1" stopColor="var(--accent-2)" />
      </linearGradient>
      <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

/* ── Services: 11 services orbiting a glowing core ─────────────────── */
const svcIcons: { slug: string; Icon: LucideIcon }[] = [
  { slug: "website-design-development", Icon: Layout },
  { slug: "web-application-development", Icon: AppWindow },
  { slug: "mobile-application-development", Icon: Smartphone },
  { slug: "ai-development-intelligent-solutions", Icon: Sparkles },
  { slug: "custom-software-development", Icon: Boxes },
  { slug: "business-process-automation", Icon: Workflow },
  { slug: "api-development-integrations", Icon: Plug },
  { slug: "whatsapp-instagram-automation", Icon: MessageCircle },
  { slug: "digital-marketing-seo", Icon: Search },
  { slug: "ai-chatbot-development", Icon: Bot },
  { slug: "data-engineering-analytics", Icon: Database },
];

export function ServicesOrbitVisual() {
  const R = 150;
  return (
    <svg {...svgProps}>
      <Defs id="so" />
      <circle cx="200" cy="200" r={R} stroke={line} strokeDasharray="2 6" />
      <circle cx="200" cy="200" r="96" stroke={line} opacity="0.6" />
      <g className="hv-spin" style={{ transformOrigin: "200px 200px" }}>
        {svcIcons.map(({ slug, Icon }, i) => {
          const a = (i / svcIcons.length) * Math.PI * 2 - Math.PI / 2;
          const x = 200 + R * Math.cos(a);
          const y = 200 + R * Math.sin(a);
          const tint = serviceTints[slug];
          return (
            <g key={slug}>
              <line x1="200" y1="200" x2={x} y2={y} stroke={line} opacity="0.35" />
              <line className="sv-flow" style={{ animationDelay: `${i * 0.15}s` }} x1="200" y1="200" x2={x} y2={y} stroke={tint} strokeWidth="1.5" strokeDasharray="3 14" />
              <g transform={`translate(${x} ${y})`}>
                <g className="hv-spin-rev">
                  <circle r="21" fill="var(--surface)" stroke={tint} strokeWidth="1.5" />
                  <Icon x={-9} y={-9} width={18} height={18} color={tint} strokeWidth={1.75} />
                </g>
              </g>
            </g>
          );
        })}
      </g>
      <circle cx="200" cy="200" r="56" fill="var(--surface)" stroke="url(#so-g)" strokeWidth="3" filter="url(#so-glow)" />
      <circle className="sv-pulse" cx="200" cy="200" r="56" stroke="var(--accent)" />
      <text x="200" y="198" textAnchor="middle" fontSize="30" fontWeight="600" fill="var(--ink)" fontFamily="var(--font-display)">
        11
      </text>
      <text x="200" y="220" textAnchor="middle" fontSize="10" letterSpacing="2" fill="var(--muted)" fontFamily="monospace">
        SERVICES
      </text>
    </svg>
  );
}

/* ── Pricing: gradient ring with the starting price in the middle ──── */
export function PricingRingVisual({ price, plans }: { price: string; plans: { id: string; tint: string }[] }) {
  return (
    <svg {...svgProps}>
      <Defs id="pr" />
      <circle cx="200" cy="200" r="150" stroke={line} opacity="0.5" />
      <path className="hero-enso" pathLength={1} d="M 306 94 A 150 150 0 1 0 344 160" stroke="url(#pr-g)" strokeWidth="12" strokeLinecap="round" filter="url(#pr-glow)" />
      <circle cx="200" cy="200" r="112" stroke={line} strokeDasharray="2 7" />
      <g className="hv-spin" style={{ transformOrigin: "200px 200px" }}>
        {plans.map((p, i) => {
          const a = (i / plans.length) * Math.PI * 2;
          return <circle key={p.id} cx={200 + 112 * Math.cos(a)} cy={200 + 112 * Math.sin(a)} r="8" fill={p.tint} filter="url(#pr-glow)" />;
        })}
      </g>
      <text x="200" y="172" textAnchor="middle" fontSize="11" letterSpacing="3" fill="var(--muted)" fontFamily="monospace">
        STARTING FROM
      </text>
      <text x="200" y="222" textAnchor="middle" fontSize="50" fontWeight="600" fill="url(#pr-g)" fontFamily="var(--font-display)" letterSpacing="-1.5">
        {price}
      </text>
      <text x="200" y="252" textAnchor="middle" fontSize="11" letterSpacing="2" fill="var(--muted)" fontFamily="monospace">
        {plans.length} PACKAGES
      </text>
    </svg>
  );
}

/* ── Student projects: circuit chip with flowing signals ───────────── */
export function CircuitVisual() {
  const traces = [
    "M140 170 H90 V100 H50",
    "M140 200 H60",
    "M140 230 H90 V300 H50",
    "M260 170 H310 V100 H350",
    "M260 200 H340",
    "M260 230 H310 V300 H350",
    "M180 140 V60",
    "M220 140 V90 H280 V50",
    "M200 260 V340",
  ];
  const leds = [
    [50, 100, "#5eead4"],
    [60, 200, "#fcd34d"],
    [50, 300, "#f0abfc"],
    [350, 100, "#7dd3fc"],
    [340, 200, "#86efac"],
    [350, 300, "#8b9cff"],
    [180, 60, "#fdba74"],
    [280, 50, "#5eead4"],
    [200, 340, "#c4b5fd"],
  ] as const;
  return (
    <svg {...svgProps}>
      <Defs id="ci" />
      {traces.map((d) => (
        <path key={d} d={d} stroke={line} strokeWidth="2" />
      ))}
      {traces.map((d, i) => (
        <path key={`f${d}`} className="sv-flow" style={{ animationDelay: `${i * 0.2}s` }} d={d} stroke={leds[i][2]} strokeWidth="2" strokeDasharray="4 16" />
      ))}
      {leds.map(([x, y, c], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill="var(--surface)" stroke={line} />
          <circle className="hv-blink" style={{ animationDelay: `${i * 0.35}s` }} cx={x} cy={y} r="4.5" fill={c} filter="url(#ci-glow)" />
        </g>
      ))}
      <rect x="140" y="140" width="120" height="120" rx="14" fill="var(--surface)" stroke="url(#ci-g)" strokeWidth="2.5" filter="url(#ci-glow)" />
      {[160, 180, 200, 220, 240].map((p) => (
        <g key={p} stroke={line} strokeWidth="2">
          <line x1={p} y1="132" x2={p} y2="140" />
          <line x1={p} y1="260" x2={p} y2="268" />
          <line x1="132" y1={p} x2="140" y2={p} />
          <line x1="260" y1={p} x2="268" y2={p} />
        </g>
      ))}
      <text x="200" y="196" textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--ink)" fontFamily="monospace">
        ESP32
      </text>
      <text x="200" y="216" textAnchor="middle" fontSize="9" letterSpacing="2" fill="var(--muted)" fontFamily="monospace">
        LEARN · BUILD
      </text>
    </svg>
  );
}

/* ── Resources: floating article cards writing themselves ──────────── */
export function ArticlesVisual() {
  return (
    <svg {...svgProps}>
      <Defs id="ar" />
      <g transform="rotate(-8 200 200)" opacity="0.5">
        <rect x="90" y="90" width="200" height="240" rx="16" fill="var(--surface)" stroke={line} />
      </g>
      <g transform="rotate(5 200 200)" opacity="0.75">
        <rect x="110" y="80" width="200" height="240" rx="16" fill="var(--surface)" stroke={line} />
      </g>
      <g className="sv-float">
        <rect x="100" y="70" width="200" height="250" rx="16" fill="var(--surface-2)" stroke="url(#ar-g)" strokeWidth="2" filter="url(#ar-glow)" />
        <rect x="120" y="92" width="64" height="16" rx="8" fill="color-mix(in oklab, var(--accent-2) 25%, transparent)" />
        <rect className="sv-build" x="120" y="122" width="150" height="12" rx="4" fill="var(--ink)" />
        <rect className="sv-build" style={{ animationDelay: ".2s" }} x="120" y="140" width="110" height="12" rx="4" fill="var(--ink)" />
        {[168, 182, 196, 210, 224, 238].map((y, i) => (
          <rect key={y} className="sv-build" style={{ animationDelay: `${0.4 + i * 0.15}s` }} x="120" y={y} width={160 - (i % 3) * 22} height="6" rx="3" fill={line} />
        ))}
        <rect className="sv-build" style={{ animationDelay: "1.4s" }} x="120" y="262" width="76" height="24" rx="12" fill="var(--accent)" />
      </g>
      <g className="hv-bob" style={{ animationDelay: "-1s" }}>
        <circle cx="320" cy="96" r="26" fill="var(--surface)" stroke="var(--accent-2)" strokeWidth="2" />
        <path d="M309 96 l7 7 13 -14" stroke="var(--accent-2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/* ── Our Work: live product dashboard ──────────────────────────────── */
export function DashboardVisual() {
  const bars = [60, 95, 75, 120, 100, 140, 115];
  return (
    <svg {...svgProps}>
      <Defs id="db" />
      <g className="sv-float">
        <rect x="30" y="70" width="340" height="250" rx="16" fill="var(--surface)" stroke="url(#db-g)" strokeWidth="2" filter="url(#db-glow)" />
        <line x1="30" y1="100" x2="370" y2="100" stroke={line} />
        {[50, 64, 78].map((x) => (
          <circle key={x} cx={x} cy="85" r="4" fill={line} />
        ))}
        <circle className="live-dot" cx="340" cy="85" r="4" fill="var(--accent-2)" />
        <text x="330" y="89" textAnchor="end" fontSize="9" letterSpacing="1.5" fill="var(--muted)" fontFamily="monospace">
          LIVE
        </text>
        <rect x="50" y="118" width="90" height="44" rx="8" fill="var(--surface-2)" />
        <rect x="150" y="118" width="90" height="44" rx="8" fill="var(--surface-2)" />
        <rect x="250" y="118" width="100" height="44" rx="8" fill="var(--surface-2)" />
        <rect className="sv-build" x="60" y="130" width="40" height="8" rx="3" fill="var(--accent)" />
        <rect className="sv-build" style={{ animationDelay: ".2s" }} x="160" y="130" width="50" height="8" rx="3" fill="var(--accent-2)" />
        <rect className="sv-build" style={{ animationDelay: ".4s" }} x="260" y="130" width="60" height="8" rx="3" fill="#f0abfc" />
        {bars.map((h, i) => (
          <rect
            key={i}
            className="sv-bar"
            style={{ animationDelay: `${i * 0.12}s`, transformOrigin: `${62 + i * 26}px 300px` }}
            x={55 + i * 26}
            y={300 - h * 0.85}
            width="16"
            height={h * 0.85}
            rx="3"
            fill={i === 5 ? "var(--accent-2)" : "color-mix(in oklab, var(--accent) 45%, transparent)"}
          />
        ))}
        <polyline className="sv-draw" pathLength={1} points="245,285 270,260 295,270 320,230 350,215" stroke="var(--accent-2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="hv-bob" style={{ animationDelay: "-2s" }}>
        <rect x="292" y="210" width="78" height="140" rx="14" fill="var(--paper)" stroke={line} />
        <rect x="302" y="232" width="58" height="10" rx="5" fill="var(--accent)" />
        <rect x="302" y="250" width="44" height="6" rx="3" fill={line} />
        <rect x="302" y="262" width="52" height="6" rx="3" fill={line} />
        <circle cx="331" cy="330" r="6" stroke={line} />
      </g>
    </svg>
  );
}

/* ── About: ZENSHA mark with counter-rotating orbits ───────────────── */
export function AboutOrbitVisual() {
  return (
    <svg {...svgProps}>
      <Defs id="ab" />
      <g className="hv-spin" style={{ transformOrigin: "200px 200px" }}>
        <circle cx="200" cy="200" r="160" stroke={line} strokeDasharray="1 8" />
        <circle cx="200" cy="40" r="7" fill="var(--accent-2)" filter="url(#ab-glow)" />
        <circle cx="360" cy="200" r="5" fill="#fcd34d" />
      </g>
      <g className="hv-spin-slow-rev" style={{ transformOrigin: "200px 200px" }}>
        <circle cx="200" cy="200" r="122" stroke={line} />
        <circle cx="78" cy="200" r="6" fill="#f0abfc" filter="url(#ab-glow)" />
        <circle cx="200" cy="322" r="5" fill="var(--accent)" />
      </g>
      <path className="hero-enso" pathLength={1} d="M 262 118 A 90 90 0 1 0 284 168" stroke="url(#ab-g)" strokeWidth="14" strokeLinecap="round" filter="url(#ab-glow)" />
      <circle className="hero-dot" style={{ animationDelay: "1.6s" }} cx="282" cy="135" r="11" fill="var(--accent-2)" />
    </svg>
  );
}

/* ── Contact: paper plane flying into a typing chat bubble ─────────── */
export function ContactVisual() {
  const path = "M 40 320 C 120 300, 110 180, 190 170 S 290 120, 300 96";
  return (
    <svg {...svgProps}>
      <Defs id="ct" />
      <path d={path} stroke={line} strokeWidth="2" strokeDasharray="4 10" />
      <g className="hv-plane" style={{ offsetPath: `path("${path}")` } as CSSProperties}>
        <path d="M -16 -12 L 18 0 L -16 12 L -8 0 Z" fill="var(--accent)" filter="url(#ct-glow)" />
      </g>
      <g className="hv-bob">
        <rect x="250" y="40" width="130" height="78" rx="22" fill="var(--surface)" stroke="url(#ct-g)" strokeWidth="2" filter="url(#ct-glow)" />
        <path d="M 290 118 L 280 140 L 310 118 Z" fill="var(--surface)" stroke="url(#ct-g)" strokeWidth="2" strokeLinejoin="round" />
        {[296, 315, 334].map((x, i) => (
          <circle key={x} className="sv-typing" style={{ animationDelay: `${i * 0.18}s` }} cx={x} cy="79" r="6" fill="var(--accent-2)" />
        ))}
      </g>
      <g className="hv-bob" style={{ animationDelay: "-2.5s" }}>
        <rect x="40" y="200" width="120" height="70" rx="20" fill="var(--surface-2)" stroke={line} />
        <rect x="60" y="222" width="70" height="7" rx="3.5" fill={line} />
        <rect x="60" y="238" width="48" height="7" rx="3.5" fill={line} />
      </g>
      <circle className="sv-pulse" cx="40" cy="320" r="8" stroke="var(--accent-2)" />
      <circle cx="40" cy="320" r="5" fill="var(--accent-2)" />
    </svg>
  );
}

/* ── Products: floating layered blocks stacking up ─────────────────── */
export function ProductsStackVisual() {
  const layers = [
    { y: 250, c: "var(--accent-2)", d: 0 },
    { y: 190, c: "var(--accent)", d: 0.25 },
    { y: 130, c: "#f0abfc", d: 0.5 },
  ];
  return (
    <svg {...svgProps}>
      <Defs id="pd" />
      {layers.map((l) => (
        <g key={l.y} className="sv-drop" style={{ animationDelay: `${l.d}s` }}>
          <path d={`M200 ${l.y - 50} L320 ${l.y} L200 ${l.y + 50} L80 ${l.y} Z`} fill="var(--surface)" stroke={l.c} strokeWidth="2" filter="url(#pd-glow)" />
          <path d={`M80 ${l.y} L80 ${l.y + 18} L200 ${l.y + 68} L320 ${l.y + 18} L320 ${l.y}`} stroke={l.c} strokeWidth="2" opacity="0.6" />
        </g>
      ))}
      <circle className="hv-blink" cx="200" cy="130" r="6" fill="var(--ink)" />
    </svg>
  );
}
