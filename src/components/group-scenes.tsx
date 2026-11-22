import type { CSSProperties } from "react";
import { Bot, Check, Database, MessageCircle, UserPlus } from "lucide-react";

/**
 * Animated mini product scenes for the four capability areas (pure CSS).
 * Each loops on its own timeline. The static styles are the "finished" frame,
 * so with reduced motion every scene simply shows its end state.
 * Figures shown are illustrative UI, not performance claims.
 */
export function GroupScene({ group }: { group: string }) {
  switch (group) {
    case "build":
      return <BuildScene />;
    case "ai":
      return <AiScene />;
    case "automate":
      return <AutomateScene />;
    default:
      return <GrowScene />;
  }
}

const count = (to: number) => ({ "--to": to }) as CSSProperties;

function BuildScene() {
  return (
    <div className="gs gs-build" aria-hidden>
      <div className="gs-laptop">
        <div className="gs-bar">
          <i /> <i /> <i />
          <span>yourbusiness.com</span>
        </div>
        <div className="gs-site">
          <div className="gs-nav">
            <b className="gs-b gs-b1" />
            <span className="gs-b gs-b2" />
            <span className="gs-b gs-b2" />
            <span className="gs-b gs-b3" />
          </div>
          <div className="gs-heroblk">
            <div>
              <p className="gs-b gs-b4">Grow with</p>
              <p className="gs-b gs-b5 text-accent">digital systems.</p>
              <span className="gs-b gs-b6" />
              <span className="gs-b gs-b7" />
            </div>
            <span className="gs-orb" />
          </div>
          <div className="gs-cards">
            <span className="gs-b gs-c1" />
            <span className="gs-b gs-c2" />
            <span className="gs-b gs-c3" />
          </div>
        </div>
      </div>
      <div className="gs-phone">
        <span className="gs-notch" />
        <span className="gs-b gs-p1" />
        <span className="gs-b gs-p2" />
        <span className="gs-b gs-p3" />
        <span className="gs-b gs-p4" />
      </div>
      <span className="gs-toast gs-build-t1">
        <span className="gs-ring" /> Performance <b className="gs-count" style={count(98)} />
      </span>
      <span className="gs-toast gs-build-t2">
        <span className="live-dot size-1.5 rounded-full bg-accent" /> Site live
      </span>
    </div>
  );
}

function AiScene() {
  return (
    <div className="gs gs-ai" aria-hidden>
      <div className="gs-chat">
        <div className="gs-chathead">
          <span className="grid size-7 place-items-center rounded-full bg-accent text-on-accent">
            <Bot className="size-4" />
          </span>
          <span>
            <b>Assistant</b>
            <small>
              <span className="live-dot inline-block size-1.5 rounded-full bg-accent" /> online
            </small>
          </span>
        </div>
        <div className="gs-msgs">
          <p className="gs-q">Can I book a demo for Saturday?</p>
          <div className="gs-slot">
            <p className="gs-typing">
              <i /> <i /> <i />
            </p>
            <div className="gs-a">
              <span className="gs-l gs-l1">Yes! Saturday has 11:00 and 15:30 free.</span>
              <span className="gs-l gs-l2">Shall I reserve 11:00 for you and send</span>
              <span className="gs-l gs-l3">a WhatsApp reminder?</span>
            </div>
          </div>
        </div>
        <div className="gs-input">
          Type a message… <span className="gs-send">↑</span>
        </div>
      </div>
      <span className="gs-toast gs-ai-t">
        <Check className="size-3 text-accent" strokeWidth={3} /> Answered in 1.2s
      </span>
    </div>
  );
}

function AutomateScene() {
  return (
    <div className="gs gs-auto" aria-hidden>
      <div className="gs-board">
        <p className="gs-boardhead">
          <i /> Lead engine · Automation <span>live</span>
        </p>
        <svg className="gs-wires" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M17 38 H50 H83 V72" fill="none" stroke="var(--line-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path className="gs-wireflow" d="M17 38 H50 H83 V72" fill="none" stroke="var(--accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="gs-node gs-n1" style={{ left: "17%", top: "38%" }}>
          <UserPlus className="size-3.5" /> Lead
        </span>
        <span className="gs-node gs-n2" style={{ left: "50%", top: "38%" }}>
          <Bot className="size-3.5" /> AI
        </span>
        <span className="gs-node gs-n3" style={{ left: "83%", top: "38%" }}>
          <Database className="size-3.5" /> CRM
        </span>
        <span className="gs-node gs-n4" style={{ left: "83%", top: "72%" }}>
          <MessageCircle className="size-3.5" /> WhatsApp
        </span>
        <span className="gs-packet" />
      </div>
      <span className="gs-toast gs-auto-t1">
        <span className="live-dot size-1.5 rounded-full bg-accent" /> New lead captured
      </span>
      <span className="gs-toast gs-auto-t2">
        <MessageCircle className="size-3 text-accent" /> Reply sent in 4s
      </span>
    </div>
  );
}

function GrowScene() {
  const bars = [38, 52, 44, 66, 58, 78, 92];
  return (
    <div className="gs gs-grow" aria-hidden>
      <div className="gs-dash">
        <div className="gs-kpis">
          <span>
            <small>Visitors</small>
            <b className="gs-count" style={count(8420)} />
          </span>
          <span>
            <small>Enquiries</small>
            <b className="gs-count" style={count(342)} />
          </span>
          <span>
            <small>Keywords top 10</small>
            <b className="gs-count" style={count(27)} />
          </span>
        </div>
        <div className="gs-chart">
          <svg viewBox="0 0 300 110" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gs-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--accent)" stopOpacity="0.35" />
                <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className="gs-area" d="M0 92 C40 88 60 70 100 74 S160 48 200 52 S260 20 300 14 V110 H0 Z" fill="url(#gs-area)" />
            <path className="gs-line" pathLength={1} d="M0 92 C40 88 60 70 100 74 S160 48 200 52 S260 20 300 14" fill="none" stroke="var(--accent)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="gs-bars">
            {bars.map((h, i) => (
              <i key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        </div>
      </div>
      <span className="gs-toast gs-grow-t">
        <span className="live-dot size-1.5 rounded-full bg-accent" /> Report updated
      </span>
    </div>
  );
}
