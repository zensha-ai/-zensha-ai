import type { CSSProperties, ReactNode } from "react";
import {
  BarChart3,
  Bot,
  BookOpen,
  Check,
  Cpu,
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

/* ── Student projects: a board lighting up while its code types ────────── */
export function StudentHeroScene() {
  const code = [
    ["kw", "void "],
    ["fn", "setup"],
    ["", "() {"],
  ];
  return (
    <Scene name="student">
      <div className="hx-board">
        <svg viewBox="0 0 300 220" className="hx-traces">
          {["M40 40 H120 V90", "M40 180 H110 V130", "M260 40 H190 V90", "M260 180 H200 V130", "M150 20 V70", "M150 200 V150"].map((d, i) => (
            <g key={d}>
              <path d={d} stroke="var(--line-strong)" strokeWidth="3" fill="none" />
              <path className="hx-trace" d={d} pathLength={1} stroke="var(--accent)" strokeWidth="3" fill="none" style={v({ animationDelay: `${i * 0.35}s` })} />
            </g>
          ))}
        </svg>
        <div className="hx-chip">
          <Cpu className="size-6" />
          <small>ESP32</small>
        </div>
        <span className="hx-led" />
        <span className="hx-led hx-led-2" />
        <span className="hx-sensor">DHT22</span>
      </div>
      <Win title="sketch.ino" className="hx-editor">
        <code>
          <span className="hx-ln hx-ln1">
            {code.map(([c, t]) => (
              <span key={t} className={c ? `hx-${c}` : undefined}>{t}</span>
            ))}
          </span>
          <span className="hx-ln hx-ln2">
            &nbsp;&nbsp;<span className="hx-fn">Serial</span>.begin(<span className="hx-num">115200</span>);
          </span>
          <span className="hx-ln hx-ln3">
            &nbsp;&nbsp;<span className="hx-fn">dht</span>.begin();
          </span>
          <span className="hx-ln hx-ln4">{"}"}</span>
        </code>
      </Win>
      <div className="hx-serial">
        <span className="hx-sl hx-sl1">&gt; temp: 28.4 °C</span>
        <span className="hx-sl hx-sl2">&gt; humidity: 61 %</span>
        <span className="hx-sl hx-sl3">&gt; LED on ✓</span>
      </div>
      <Toast className="hx-st-t">
        <Check className="size-3 text-accent" strokeWidth={3} /> Demo · parts list · code
      </Toast>
    </Scene>
  );
}

/* ── Resources: an article composing itself, tabs switching ─────────────── */
export function ResourcesHeroScene() {
  const tabs = ["Blog", "Guides", "Case studies", "FAQs"];
  return (
    <Scene name="resources">
      <div className="hx-paper hx-paper-b" />
      <div className="hx-paper hx-paper-c" />
      <Win title="resources / guides" className="hx-article">
        <div className="hx-tabs">
          {tabs.map((t) => (
            <span key={t}>{t}</span>
          ))}
          <i className="hx-tab-ink" />
        </div>
        <span className="hx-art-meta">
          <BookOpen className="size-3" /> Guide · 6 min read
        </span>
        <p className="hx-art-title">Choosing the right website for your business</p>
        <span className="hx-bar hx-bar1" />
        <span className="hx-bar hx-bar2" />
        <span className="hx-bar hx-bar3" />
        <ul className="hx-checks">
          {["Define your goal", "List must-have pages", "Plan your budget"].map((c, i) => (
            <li key={c} style={v({ "--n": i })}>
              <span className="hx-box"><Check className="size-2.5" strokeWidth={4} /></span>
              {c}
            </li>
          ))}
        </ul>
      </Win>
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
