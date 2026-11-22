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

/* ── Student projects: a space mission — rocket, CubeSat, rover, ground station ── */
const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: (i * 83.7) % 400,
  y: (i * 47.3) % 270,
  r: i % 5 === 0 ? 1.6 : 0.9,
  d: (i % 7) * 0.45,
}));
const ORBIT = "M 236 82 A 96 30 -14 1 1 424 34 A 96 30 -14 1 1 236 82";

export function StudentHeroScene() {
  return (
    <Scene name="student">
      <div className="hx-space">
        <svg viewBox="0 0 400 400" className="hx-space-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="hx-planet" cx="35%" cy="30%" r="75%">
              <stop offset="0" stopColor="#fffbd4" />
              <stop offset="0.45" stopColor="#e8582f" />
              <stop offset="1" stopColor="#2a0703" />
            </radialGradient>
            <linearGradient id="hx-ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a120a" />
              <stop offset="1" stopColor="#080505" />
            </linearGradient>
            <linearGradient id="hx-flame" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fffbd4" />
              <stop offset="0.35" stopColor="#ffb347" />
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {STARS.map((st, i) => (
            <circle key={i} cx={st.x} cy={st.y} r={st.r} className="hx-star" style={v({ animationDelay: `${st.d}s` })} />
          ))}

          {/* planet + orbit + CubeSat */}
          <path d={ORBIT} className="hx-orbit-path" />
          <circle cx="330" cy="58" r="44" fill="url(#hx-planet)" className="hx-planet" />
          <circle cx="316" cy="48" r="6" className="hx-crater" />
          <circle cx="344" cy="72" r="4" className="hx-crater" />
          <circle cx="338" cy="40" r="3" className="hx-crater" />
          <g className="hx-sat">
            <rect x="-6" y="-6" width="12" height="12" rx="1.5" className="hx-sat-body" />
            <rect x="-22" y="-3.5" width="14" height="7" className="hx-sat-panel" />
            <rect x="8" y="-3.5" width="14" height="7" className="hx-sat-panel" />
            <line x1="0" y1="-6" x2="0" y2="-12" className="hx-sat-ant" />
            <circle cx="0" cy="-13" r="1.8" className="hx-sat-led" />
            <animateMotion dur="9s" repeatCount="indefinite" path={ORBIT} />
          </g>

          {/* ground */}
          <path d="M0 318 Q 200 292 400 318 L400 400 L0 400 Z" fill="url(#hx-ground)" />
          <path d="M0 318 Q 200 292 400 318" className="hx-horizon" />
          <ellipse cx="150" cy="350" rx="18" ry="4" className="hx-crater-g" />
          <ellipse cx="290" cy="370" rx="26" ry="5" className="hx-crater-g" />
          <ellipse cx="60" cy="380" rx="14" ry="3" className="hx-crater-g" />

          {/* launch pad + rocket */}
          <g className="hx-pad">
            <rect x="40" y="250" width="5" height="62" className="hx-tower" />
            {[258, 272, 286, 300].map((y) => (
              <line key={y} x1="45" y1={y} x2="58" y2={y} className="hx-tower-arm" />
            ))}
            <rect x="36" y="310" width="54" height="6" rx="2" className="hx-tower" />
          </g>
          <g className="hx-smoke">
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx={58 + i * 9} cy="312" r="7" style={v({ animationDelay: `${i * 0.12}s` })} />
            ))}
          </g>
          <g className="hx-rocket">
            <path d="M64 262 Q 70 236 76 262 Z" className="hx-rk-nose" />
            <rect x="64" y="262" width="12" height="40" rx="2" className="hx-rk-body" />
            <rect x="64" y="276" width="12" height="4" className="hx-rk-band" />
            <circle cx="70" cy="270" r="2.4" className="hx-rk-window" />
            <path d="M64 290 L56 306 L64 302 Z" className="hx-rk-fin" />
            <path d="M76 290 L84 306 L76 302 Z" className="hx-rk-fin" />
            <path d="M65 304 Q 70 336 75 304 Z" fill="url(#hx-flame)" className="hx-rk-flame" />
          </g>

          {/* ground station */}
          <g className="hx-station">
            <rect x="338" y="296" width="4" height="18" className="hx-tower" />
            <path d="M322 296 Q 340 312 358 290" className="hx-dish" />
            <line x1="340" y1="300" x2="331" y2="285" className="hx-tower-arm" />
            {[0, 1, 2].map((i) => (
              <path key={i} d="M322 276 Q 326 266 336 264" className="hx-signal" style={v({ animationDelay: `${i * 0.5}s` })} />
            ))}
          </g>

          {/* rover */}
          <g className="hx-rover">
            <rect x="0" y="0" width="34" height="11" rx="3" className="hx-rv-body" />
            <rect x="2" y="-5" width="30" height="4" rx="1" className="hx-rv-panel" />
            <line x1="26" y1="-5" x2="26" y2="-15" className="hx-tower-arm" />
            <rect x="23" y="-20" width="8" height="6" rx="1.5" className="hx-rv-cam" />
            <circle cx="30" cy="-17" r="1.3" className="hx-sat-led" />
            {[5, 17, 29].map((x) => (
              <g key={x} className="hx-wheel" style={v({ transformOrigin: `${x}px 14px` })}>
                <circle cx={x} cy="14" r="5.5" className="hx-rv-wheel" />
                <line x1={x - 5} y1="14" x2={x + 5} y2="14" className="hx-rv-spoke" />
              </g>
            ))}
          </g>
        </svg>

        <div className="hx-mission">
          <span className="hx-mission-head">
            <i /> Mission log <b className="hx-tminus" />
          </span>
          <span className="hx-mission-row">ALT <b className="gs-count hx-alt" style={v({ "--to": 124 })} /> km</span>
          <span className="hx-mission-row">VEL <b>7.6</b> km/s</span>
          <span className="hx-mission-row">
            LINK
            <span className="hx-bars-sig">
              <i /><i /><i /><i />
            </span>
          </span>
        </div>
        <div className="hx-legend">
          <span>Rocket</span>
          <span>CubeSat</span>
          <span>Rover</span>
          <span>Ground station</span>
        </div>
      </div>
      <Toast className="hx-st-t">
        <Check className="size-3 text-accent" strokeWidth={3} /> Demo · parts list · code
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
