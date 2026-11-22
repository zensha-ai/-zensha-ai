import type { CSSProperties, ReactNode } from "react";
import {
  BarChart3,
  Bot,
  BookOpen,
  Check,
  Database,
  FileText,
  Gauge,
  LayoutDashboard,
  MessageCircle,
  Rocket,
  Send,
  Smartphone,
  Sparkles,
  Workflow,
  Ruler,
  Cpu,
  Code2,
  Camera,
  Zap,
  SatelliteDish,
} from "lucide-react";
import { brand } from "@/config/brand";
import { TrafficVisual } from "@/components/work-visual";
import { ServiceVisual } from "@/components/service-visual";

/**
 * Page hero scenes (every page except Home). Each one is built from that
 * page's own content and loops on its own timeline in pure CSS. Static styles
 * are the finished frame, so reduced motion shows a complete still image.
 * Everything here is decorative (aria-hidden); the page text carries meaning.
 */

const v = (o: Record<string, string | number>) => o as CSSProperties;

function Scene({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className={`hx hx-${name}`} aria-hidden>
      <div className="hx-glow" />
      {children}
    </div>
  );
}

function Win({ title, className, style, children }: { title: string; className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div className={`hx-win ${className ?? ""}`} style={style}>
      <div className="hx-winbar">
        <i />
        <i />
        <i />
        <span>{title}</span>
      </div>
      <div className="hx-winbody">{children}</div>
    </div>
  );
}

function Toast({ className, children }: { className: string; children: ReactNode }) {
  return <span className={`gs-toast hx-toast ${className}`}>{children}</span>;
}

/* ── Services: four capability cards orbiting a glowing core ─────────── */
export function ServicesHeroScene({ count }: { count: number }) {
  const cards = [
    { k: "web", icon: Rocket, label: "Websites", body: <span className="hx-progress"><i /></span>, note: "Deploying…" },
    { k: "apps", icon: LayoutDashboard, label: "Web apps", body: <span className="hx-spark"><i /><i /><i /><i /><i /><i /></span>, note: "Dashboard live" },
    { k: "mobile", icon: Smartphone, label: "Mobile apps", body: <span className="hx-push"><i /><em>New booking</em></span>, note: "Push sent" },
    { k: "ai", icon: Bot, label: "AI & chatbots", body: <span className="gs-typing hx-dots"><i /> <i /> <i /></span>, note: "Answering" },
    { k: "auto", icon: Workflow, label: "Automation", body: <span className="hx-mini-flow"><b /><b /><b /><em /></span>, note: "Lead → CRM" },
    { k: "wa", icon: MessageCircle, label: "WhatsApp", body: <span className="hx-chatmini"><i /><i /></span>, note: "Reply sent" },
    { k: "data", icon: BarChart3, label: "Data & SEO", body: <span className="hx-line"><svg viewBox="0 0 60 18"><path d="M0 16 L12 12 L24 13 L36 7 L48 8 L60 1" /></svg></span>, note: "Report ready" },
  ];
  const n = cards.length;
  return (
    <Scene name="services">
      <div className="hx-ring">
        <span className="hx-ring-line" />
        <span className="hx-ring-line hx-ring-line-2" />
        <span className="hx-ring-line hx-ring-line-3" />
        <div className="hx-spin">
          {cards.map((c, i) => (
            <div key={c.k} className="hx-slot" style={v({ "--a": `${(i * 360) / n}deg` })}>
              <div className={`hx-face hx-orbit-card hx-oc-${c.k}`}>
                <span className="hx-oc-icon">
                  <c.icon className="size-3.5" />
                </span>
                <b>{c.label}</b>
                <span className="hx-oc-body">{c.body}</span>
                <small>{c.note}</small>
              </div>
            </div>
          ))}
        </div>
        <div className="hx-core3d">
          <div className="hx-core">
            <span className="hx-core-ring" />
            <span className="hx-core-ring hx-core-ring-2" />
            <div className="hx-core-orb">
              <b className="gs-count hx-count" style={v({ "--to": count })} />
              <small>services</small>
            </div>
          </div>
        </div>
      </div>
    </Scene>
  );
}

/* ── Pricing: package cards fanned out, the popular one in front ────────── */
export function PricingHeroScene({ plans }: { plans: { name: string; price: string; popular?: boolean }[] }) {
  const front = plans.findIndex((p) => p.popular);
  return (
    <Scene name="pricing">
      {plans.map((p, i) => {
        const pos = i - (front < 0 ? 1 : front);
        return (
          <div key={p.name} className={`hx-plan ${p.popular ? "is-popular" : ""}`} style={v({ "--pos": pos, "--abs": Math.abs(pos), "--i": i })}>
            <span className="hx-plan-name">{p.name}</span>
            {p.popular && <span className="hx-plan-badge"><Sparkles className="size-3" /> Most popular</span>}
            <b className="hx-plan-price">{p.price}</b>
            <ul>
              {[0, 1, 2, 3].map((n) => (
                <li key={n} style={v({ "--n": n })}>
                  <Check className="size-3" strokeWidth={3} />
                  <span />
                </li>
              ))}
            </ul>
            <span className="hx-plan-cta">Choose</span>
            {p.popular && <span className="hx-plan-sweep" />}
          </div>
        );
      })}
      <Toast className="hx-pr-t1">
        <Check className="size-3 text-accent" strokeWidth={3} /> No hidden costs
      </Toast>
      <Toast className="hx-pr-t2">
        <span className="live-dot size-1.5 rounded-full bg-accent" /> Final price after a short call
      </Toast>
    </Scene>
  );
}

/* ── Student projects: six robots take turns fixing one satellite ───────── */
type BotLook = { head: string; face: string; beak: string; body: string; foot: string; ring: string; sitting?: boolean };

function ServoBot({ look }: { look: BotLook }) {
  const y = look.sitting ? 26 : 0;
  return (
    <svg viewBox="0 0 140 200" className="hx-bot-svg">
      <ellipse cx="70" cy="194" rx="46" ry="5" className="hx-bot-shadow" />
      {look.sitting ? (
        <g>
          <rect x="22" y="160" width="34" height="30" rx="8" fill={look.foot} />
          <rect x="84" y="160" width="34" height="30" rx="8" fill={look.foot} />
          <rect x="40" y="150" width="60" height="18" rx="5" className="hx-bot-frame" />
          <circle cx="54" cy="159" r="4.5" className="hx-bot-servo" />
          <circle cx="86" cy="159" r="4.5" className="hx-bot-servo" />
        </g>
      ) : (
        <g className="hx-bot-legs">
          <path d="M34 128 L50 122 L50 152 Z" fill={look.body} />
          <rect x="46" y="140" width="12" height="32" rx="3" className="hx-bot-frame" />
          <rect x="82" y="140" width="12" height="32" rx="3" className="hx-bot-frame" />
          <circle cx="52" cy="156" r="3.5" className="hx-bot-servo" />
          <circle cx="88" cy="156" r="3.5" className="hx-bot-servo" />
          <rect x="34" y="170" width="34" height="14" rx="6" fill={look.foot} />
          <rect x="72" y="170" width="34" height="14" rx="6" fill={look.foot} />
          <rect x="34" y="181" width="34" height="5" rx="2" className="hx-bot-sole" />
          <rect x="72" y="181" width="34" height="5" rx="2" className="hx-bot-sole" />
        </g>
      )}
      <g transform={`translate(0 ${y})`}>
        <rect x="40" y="122" width="60" height="20" rx="5" className="hx-bot-frame" />
        <circle cx="54" cy="132" r="5" className="hx-bot-servo" />
        <circle cx="86" cy="132" r="5" className="hx-bot-servo" />
        <rect x="36" y="94" width="66" height="32" rx="13" fill={look.body} />
        <circle cx="90" cy="104" r="2" className="hx-bot-dot" />
        <circle cx="90" cy="112" r="2" className="hx-bot-dot" />
        <g className="hx-bot-neck">
          <rect x="56" y="62" width="18" height="36" rx="4" className="hx-bot-frame" />
          <rect x="52" y="68" width="8" height="10" rx="2" className="hx-bot-servo-sq" />
          <rect x="70" y="82" width="8" height="10" rx="2" className="hx-bot-servo-sq" />
        </g>
        <g className="hx-bot-head">
          <path d="M26 54 L26 30 Q26 8 52 8 L104 10 Q124 11 124 32 L124 54 Z" fill={look.head} />
          <rect x="40" y="16" width="70" height="34" rx="14" fill={look.face} />
          <g className="hx-bot-eye">
            <circle cx="94" cy="33" r="11" fill={look.ring} />
            <circle cx="94" cy="33" r="5.5" className="hx-bot-pupil" />
            <circle cx="96" cy="31" r="1.6" fill="#fff" />
          </g>
          <circle cx="110" cy="40" r="1.8" className="hx-bot-pupil" />
          <rect x="22" y="52" width="104" height="8" rx="3" fill={look.beak} />
          <g className="hx-bot-jaw">
            <rect x="28" y="61" width="96" height="7" rx="3" fill={look.beak} />
            <rect x="34" y="60" width="84" height="3" className="hx-bot-mouth" />
          </g>
        </g>
      </g>
    </svg>
  );
}

const L = {
  graphite: { head: "#34332e", face: "#c9c5b2", beak: "var(--accent)", body: "#34332e", foot: "var(--accent)", ring: "var(--accent)" },
  red: { head: "var(--accent)", face: "#2b2a27", beak: "#fffbd4", body: "var(--accent)", foot: "#fffbd4", ring: "#fffbd4" },
  cream: { head: "#fffbd4", face: "#c9c5b2", beak: "#ff7a3d", body: "#fffbd4", foot: "#ff9a3d", ring: "#ff9a3d" },
  wine: { head: "var(--accent-2)", face: "#2b2a27", beak: "#fffbd4", body: "var(--accent-2)", foot: "#fffbd4", ring: "#fffbd4" },
};

const STARS = Array.from({ length: 40 }, (_, i) => ({ x: (i * 83.7) % 400, y: (i * 47.3) % 400, r: i % 5 === 0 ? 1.5 : 0.8, d: (i % 7) * 0.45 }));

function Satellite() {
  return (
    <svg viewBox="0 0 220 130" className="hx-satbig">
      {/* blueprint outlines of everything still to build */}
      <g className="hx-ghost">
        <rect x="84" y="30" width="52" height="64" rx="6" />
        <rect x="6" y="46" width="62" height="30" rx="3" />
        <rect x="152" y="46" width="62" height="30" rx="3" />
        <path d="M96 22 Q 110 2 124 22 Z" />
        <circle cx="110" cy="104" r="9" />
      </g>
      {/* 0 · architecture: body, frame and struts */}
      <g className="hx-sp hx-sp-0">
        <rect x="68" y="58" width="16" height="6" className="hx-sat-arm" />
        <rect x="136" y="58" width="16" height="6" className="hx-sat-arm" />
        <rect x="84" y="30" width="52" height="64" rx="6" className="hx-sat-core" />
        <path d="M84 30 L136 94 M136 30 L84 94" className="hx-strut" />
        <line x1="110" y1="22" x2="110" y2="30" className="hx-sat-mast" />
      </g>
      {/* 1 · hardware: circuit board */}
      <g className="hx-sp hx-sp-1">
        <rect x="90" y="36" width="40" height="20" rx="2" className="hx-pcb2" />
        <path d="M93 41 H104 V46 H112 M93 51 H100 M126 40 V48 H118" className="hx-pcb2-trace" />
        <rect x="104" y="40" width="10" height="9" rx="1" className="hx-pcb2-chip" />
        <circle cx="124" cy="52" r="1.8" className="hx-beacon" />
      </g>
      {/* 2 · software: firmware screen */}
      <g className="hx-sp hx-sp-2">
        <rect x="90" y="60" width="40" height="26" rx="2" className="hx-screen" />
        <path d="M94 66 H112 M94 71 H120 M94 76 H106" className="hx-code" />
        <rect x="94" y="80" width="32" height="3" rx="1.5" className="hx-up-track" />
        <rect x="94" y="80" width="32" height="3" rx="1.5" className="hx-up-fill" />
      </g>
      {/* 3 · camera */}
      <g className="hx-sp hx-sp-3">
        <rect x="102" y="94" width="16" height="6" className="hx-sat-arm" />
        <circle cx="110" cy="104" r="9" className="hx-lens-ring" />
        <circle cx="110" cy="104" r="4.5" className="hx-lens" />
        <circle cx="112" cy="102" r="1.2" fill="#fffbd4" />
      </g>
      {/* 4 · power: solar panels */}
      <g className="hx-sp hx-sp-4">
        <rect x="6" y="46" width="62" height="30" rx="3" className="hx-panel" />
        <path d="M21 46 V76 M37 46 V76 M53 46 V76 M6 61 H68" className="hx-panel-grid" />
        <rect x="152" y="46" width="62" height="30" rx="3" className="hx-panel" />
        <path d="M167 46 V76 M183 46 V76 M199 46 V76 M152 61 H214" className="hx-panel-grid" />
      </g>
      {/* 5 · comms: dish, beacon, signal */}
      <g className="hx-sp hx-sp-5">
        <path d="M96 22 Q 110 2 124 22 Z" className="hx-dish2" />
        <circle cx="110" cy="13" r="2.4" className="hx-beacon" />
        <path d="M128 8 Q 136 14 132 24 M134 2 Q 146 13 139 28" className="hx-sig2" />
      </g>
      {/* sparks while a robot is working */}
      <g className="hx-fixsparks">
        {[0, 1, 2, 3, 4].map((k) => (
          <circle key={k} cx="110" cy="114" r="2" style={v({ "--sx": `${(k - 2) * 9}px`, "--sy": `${6 + (k % 2) * 6}px`, animationDelay: `${k * 0.12}s` })} />
        ))}
      </g>
    </svg>
  );
}

export function StudentHeroScene() {
  return (
    <Scene name="student">
      <div className="hx-space hx-bay">
        <svg viewBox="0 0 400 400" className="hx-space-svg" preserveAspectRatio="xMidYMid slice">
          {STARS.map((st, i) => (
            <circle key={i} cx={st.x} cy={st.y} r={st.r} className="hx-star" style={v({ animationDelay: `${st.d}s` })} />
          ))}
        </svg>
      </div>
      <div className="hx-ring hx-satring">
        <span className="hx-ring-line" />
        <span className="hx-ring-line hx-ring-line-2" />
        <div className="hx-spin">
            <div className="hx-slot" style={v({ "--a": "0deg" })}>
              <span className="hx-beam" />
              <div className="hx-face hx-fxr hx-fxr-0" style={v({ "--w": "17cqw", "--n": 0 })}>
                <div className="hx-rb-inner"><ServoBot look={L.graphite} /></div>
                <span className="hx-fxr-tag"><Ruler className="size-3" /> Max · Architecture</span>
              </div>
            </div>
            <div className="hx-slot" style={v({ "--a": "60deg" })}>
              <span className="hx-beam" />
              <div className="hx-face hx-fxr hx-fxr-1" style={v({ "--w": "15cqw", "--n": 1 })}>
                <div className="hx-rb-inner"><ServoBot look={L.wine} /></div>
                <span className="hx-fxr-tag"><Cpu className="size-3" /> Nova · Hardware</span>
              </div>
            </div>
            <div className="hx-slot" style={v({ "--a": "120deg" })}>
              <span className="hx-beam" />
              <div className="hx-face hx-fxr hx-fxr-2" style={v({ "--w": "13cqw", "--n": 2 })}>
                <div className="hx-rb-inner"><ServoBot look={L.red} /></div>
                <span className="hx-fxr-tag"><Code2 className="size-3" /> Ruby · Software</span>
              </div>
            </div>
            <div className="hx-slot" style={v({ "--a": "180deg" })}>
              <span className="hx-beam" />
              <div className="hx-face hx-fxr hx-fxr-3" style={v({ "--w": "10cqw", "--n": 3 })}>
                <div className="hx-rb-inner"><ServoBot look={L.cream} /></div>
                <span className="hx-fxr-tag"><Camera className="size-3" /> Pixel · Camera</span>
              </div>
            </div>
            <div className="hx-slot" style={v({ "--a": "240deg" })}>
              <span className="hx-beam" />
              <div className="hx-face hx-fxr hx-fxr-4" style={v({ "--w": "12cqw", "--n": 4 })}>
                <div className="hx-rb-inner"><ServoBot look={L.cream} /></div>
                <span className="hx-fxr-tag"><Zap className="size-3" /> Bolt · Power</span>
              </div>
            </div>
            <div className="hx-slot" style={v({ "--a": "300deg" })}>
              <span className="hx-beam" />
              <div className="hx-face hx-fxr hx-fxr-5" style={v({ "--w": "9cqw", "--n": 5 })}>
                <div className="hx-rb-inner"><ServoBot look={L.red} /></div>
                <span className="hx-fxr-tag"><SatelliteDish className="size-3" /> Chip · Comms</span>
              </div>
            </div>
        </div>
        <div className="hx-core3d">
          <div className="hx-satcore">
            <Satellite />
          </div>
        </div>
      </div>
      <span className="hx-build">
        Parts <b className="gs-count hx-built" style={v({ "--to": 6 })} />/6
      </span>
      <Toast className="hx-ready">
        <Check className="size-3 text-accent" strokeWidth={3} /> Satellite ready — mission go!
      </Toast>
    </Scene>
  );
}

/* ── Resources: a search, a glowing book and four resource types orbiting in 3D ── */
export function ResourcesHeroScene() {
  const cards = [
    {
      k: "blog",
      icon: FileText,
      label: "Blog",
      body: (
        <span className="hx-rc-blog">
          <i /> <i /> <i />
          <em>5 min read</em>
        </span>
      ),
    },
    {
      k: "guide",
      icon: BookOpen,
      label: "Guides",
      body: (
        <span className="hx-rc-guide">
          {[0, 1, 2].map((n) => (
            <span key={n} style={v({ "--n": n })}>
              <span className="hx-box"><Check className="size-2" strokeWidth={4} /></span>
              <i />
            </span>
          ))}
        </span>
      ),
    },
    {
      k: "case",
      icon: BarChart3,
      label: "Case studies",
      body: (
        <span className="hx-rc-case">
          <span><i className="hx-rc-before" /><small>Before</small></span>
          <span><i className="hx-rc-after" /><small>After</small></span>
        </span>
      ),
    },
    {
      k: "faq",
      icon: MessageCircle,
      label: "FAQs",
      body: (
        <span className="hx-rc-faq">
          <b>How long does it take?</b>
          <em />
        </span>
      ),
    },
  ];
  const n = cards.length;
  return (
    <Scene name="resources">
      <div className="hx-search">
        <Sparkles className="size-3.5 text-accent" />
        <span className="hx-type hx-q">How much does a website cost?</span>
        <span className="hx-caret" />
        <span className="hx-results">4 results</span>
      </div>
      <div className="hx-ring">
        <span className="hx-ring-line" />
        <span className="hx-ring-line hx-ring-line-2" />
        <div className="hx-spin">
          {cards.map((c, i) => (
            <div key={c.k} className="hx-slot" style={v({ "--a": `${(i * 360) / n}deg` })}>
              <div className="hx-face hx-orbit-card hx-rc">
                <span className="hx-oc-icon">
                  <c.icon className="size-3.5" />
                </span>
                <b>{c.label}</b>
                <span className="hx-oc-body">{c.body}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="hx-core3d">
          <div className="hx-book">
            <span className="hx-book-glow" />
            <span className="hx-page hx-page-l"><i /><i /><i /></span>
            <span className="hx-page hx-page-r"><i /><i /><i /></span>
            <span className="hx-page hx-page-flip" />
          </div>
        </div>
      </div>
      <Toast className="hx-rs-t">
        <FileText className="size-3 text-accent" /> New guide published
      </Toast>
    </Scene>
  );
}

/* ── Our Work: the three real projects rotating to the front ────────────── */
export function WorkHeroScene() {
  return (
    <Scene name="work">
      <Win title="Trafenix AI · traffic surveys" className="hx-proj" style={v({ "--k": 0 })}>
        <TrafficVisual className="block w-full" />
        <span className="hx-proj-tag">
          <Gauge className="size-3" /> TMC · Midblock · Classification
        </span>
      </Win>
      <Win title="Reel Research AI · reel → report" className="hx-proj" style={v({ "--k": 1 })}>
        <div className="hx-reel">
          <span className="hx-phone">
            <span className="hx-reel-label">REEL</span>
            <span className="hx-reel-wave">
              {Array.from({ length: 9 }).map((_, i) => (
                <i key={i} style={v({ "--w": i })} />
              ))}
            </span>
          </span>
          <span className="hx-reel-steps">
            {["Frames", "Transcript", "Fact-check", "Research"].map((s, i) => (
              <em key={s} style={v({ "--n": i })}>
                <Check className="size-2.5" strokeWidth={4} /> {s}
              </em>
            ))}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/work/reel-research-report.png" alt="" className="hx-pdf" />
        </div>
      </Win>
      <Win title="YouTube analytics · ETL pipeline" className="hx-proj" style={v({ "--k": 2 })}>
        <div className="hx-etl">
          <ServiceVisual slug="data-engineering-analytics" className="block w-full max-w-[16rem]" />
          <span className="hx-etl-steps">
            <em><Database className="size-3" /> Extract</em>
            <em>Transform</em>
            <em>Load</em>
          </span>
        </div>
      </Win>
      <Toast className="hx-wk-t">
        <span className="live-dot size-1.5 rounded-full bg-accent" /> Real projects, built by us
      </Toast>
    </Scene>
  );
}

/* ── About: "Useful, not complicated" — a tangle straightens into the approach ── */
const KNOT_POINTS: [number, number][] = [
  [30, 228], [92, 196], [150, 176], [208, 140], [266, 118], [322, 84], [372, 46],
];
const TANGLE =
  "M 60 140 C 340 20, 20 250, 300 200 C 380 170, 60 40, 200 120 C 330 210, 120 250, 90 90 C 60 0, 380 60, 260 160 C 160 240, 30 200, 140 60 C 230 -20, 360 120, 210 190";
const CLEAN = KNOT_POINTS.slice(1)
  .map(([x, y], i) => {
    const [px, py] = KNOT_POINTS[i];
    return `C ${px + 26} ${py}, ${x - 26} ${y}, ${x} ${y}`;
  })
  .reduce((acc, seg) => `${acc} ${seg}`, `M ${KNOT_POINTS[0][0]} ${KNOT_POINTS[0][1]}`);

export function AboutHeroScene({ steps }: { steps: string[] }) {
  const shown = steps.slice(0, 6);
  return (
    <Scene name="about">
      <div className="hx-knot-wrap">
        <span className="hx-knot-tag hx-knot-tag-a">Complicated</span>
        <span className="hx-knot-tag hx-knot-tag-b">Useful</span>
        <svg viewBox="0 0 400 260" className="hx-knot-svg">
          <path d={CLEAN} className="hx-knot-ghost" />
          <path d={CLEAN} className="hx-knot" style={v({ "--t": `path("${TANGLE}")`, "--c": `path("${CLEAN}")` })} />
          <g className="hx-knot-nodes">
            {KNOT_POINTS.slice(1).map(([x, y], i) => (
              <g key={i} className="hx-knot-node" style={v({ "--n": i })}>
                <circle cx={x} cy={y} r="11" className="hx-knot-halo" />
                <circle cx={x} cy={y} r="5.5" />
              </g>
            ))}
            <circle r="6" className="hx-runner">
              <animateMotion dur="10s" repeatCount="indefinite" path={CLEAN} keyPoints="0;0;1;1" keyTimes="0;0.36;0.86;1" calcMode="linear" />
            </circle>
          </g>
        </svg>
      </div>
      <ol className="hx-steps">
        {shown.map((st, i) => (
          <li key={st} style={v({ "--n": i })}>
            <b>{String(i + 1).padStart(2, "0")}</b>
            {st.replace(/\.$/, "")}
          </li>
        ))}
      </ol>
      <Toast className="hx-ab-t">
        <Sparkles className="size-3 text-accent" /> Useful, not complicated
      </Toast>
    </Scene>
  );
}

/* ── Contact: an enquiry filling in, sending, and arriving ──────────────── */
export function ContactHeroScene() {
  return (
    <Scene name="contact">
      <Win title="New enquiry" className="hx-form">
        <label>Name</label>
        <span className="hx-field"><span className="hx-type hx-t1">Priya Raman</span></span>
        <label>What do you need?</label>
        <span className="hx-pills">
          <em>Website</em>
          <em className="hx-pick">Web app</em>
          <em>AI</em>
        </span>
        <label>Message</label>
        <span className="hx-field hx-field-lg">
          <span className="hx-type hx-t2">We need a booking portal for</span>
          <span className="hx-type hx-t3">our three clinics.</span>
        </span>
        <span className="hx-send">
          Send <Send className="size-3" />
        </span>
      </Win>
      <span className="hx-plane">
        <Send className="size-5" />
      </span>
      <div className="hx-inbox">
        <span className="hx-inbox-icon"><MessageCircle className="size-4" /></span>
        <span>
          <b>{brand.brandName}</b>
          <small>Enquiry received — we&rsquo;ll be in touch.</small>
        </span>
      </div>
      <Toast className="hx-ct-t">
        <Check className="size-3 text-accent" strokeWidth={3} /> Message sent
      </Toast>
    </Scene>
  );
}

/* ── Products: the first products assembling, marked as in progress ─────── */
export function ProductsHeroScene() {
  return (
    <Scene name="products">
      <Win title="dashboard" className="hx-pw hx-pw1">
        <span className="hx-blk hx-blk-a" />
        <span className="hx-blk-row">
          <span className="hx-blk" /> <span className="hx-blk" /> <span className="hx-blk" />
        </span>
        <span className="hx-bars">
          {[40, 65, 50, 80, 60, 92].map((h, i) => (
            <i key={i} style={v({ height: `${h}%`, "--n": i })} />
          ))}
        </span>
      </Win>
      <div className="hx-pw hx-pw2">
        <span className="hx-notch" />
        <span className="hx-blk hx-blk-hero" />
        <span className="hx-blk" />
        <span className="hx-blk hx-blk-s" />
        <span className="hx-blk hx-blk-btn" />
      </div>
      <Win title="assistant" className="hx-pw hx-pw3">
        <span className="hx-bub hx-bub-q" />
        <span className="hx-bub hx-bub-a" />
        <span className="gs-typing hx-dots"><i /> <i /> <i /></span>
      </Win>
      <span className="hx-badge">
        <LayoutDashboard className="size-3" /> In development
      </span>
      <Toast className="hx-pd-t">
        <span className="live-dot size-1.5 rounded-full bg-accent" /> First products on the way
      </Toast>
    </Scene>
  );
}
