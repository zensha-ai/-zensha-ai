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
  MapPin,
  MessageCircle,
  Rocket,
  Send,
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
    { k: "build", icon: Rocket, label: "Build", body: <span className="hx-progress"><i /></span>, note: "Deploying…" },
    { k: "ai", icon: Bot, label: "AI", body: <span className="gs-typing hx-dots"><i /> <i /> <i /></span>, note: "Answering" },
    { k: "auto", icon: Workflow, label: "Automate", body: <span className="hx-mini-flow"><b /><b /><b /><em /></span>, note: "Lead → CRM" },
    { k: "grow", icon: BarChart3, label: "Grow", body: <span className="hx-spark"><i /><i /><i /><i /><i /><i /></span>, note: "Report ready" },
  ];
  return (
    <Scene name="services">
      <div className="hx-ellipse" />
      <div className="hx-ellipse hx-ellipse-2" />
      <div className="hx-core">
        <span className="hx-core-ring" />
        <span className="hx-core-ring hx-core-ring-2" />
        <div className="hx-core-orb">
          <b className="gs-count hx-count" style={v({ "--to": count })} />
          <small>services</small>
        </div>
      </div>
      {cards.map((c, i) => (
        <div key={c.k} className={`hx-orbit-card hx-oc-${c.k}`} style={v({ "--d": `${i * 25}%` })}>
          <span className="hx-oc-icon">
            <c.icon className="size-3.5" />
          </span>
          <b>{c.label}</b>
          <span className="hx-oc-body">{c.body}</span>
          <small>{c.note}</small>
        </div>
      ))}
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

/* ── About: Bengaluru on the map and the five principles cycling ────────── */
export function AboutHeroScene({ values }: { values: { title: string; text: string }[] }) {
  return (
    <Scene name="about">
      <div className="hx-map">
        {Array.from({ length: 140 }).map((_, i) => (
          <i key={i} />
        ))}
        <span className="hx-pin">
          <span className="hx-ripple" />
          <span className="hx-ripple hx-ripple-2" />
          <MapPin className="size-5" />
        </span>
        <span className="hx-pin-label">{brand.brandName} · Bengaluru</span>
      </div>
      <div className="hx-values">
        {values.slice(0, 5).map((val, i) => (
          <div key={val.title} className="hx-value" style={v({ "--n": i })}>
            <small>Principle {String(i + 1).padStart(2, "0")}</small>
            <b>{val.title}</b>
            <p>{val.text}</p>
          </div>
        ))}
        <div className="hx-value-dots">
          {values.slice(0, 5).map((val, i) => (
            <i key={val.title} style={v({ "--n": i })} />
          ))}
        </div>
      </div>
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
