import type { CSSProperties } from "react";
import {
  BarChart3,
  Calendar,
  ClipboardCheck,
  Files,
  Gauge,
  Globe,
  Headset,
  IndianRupee,
  LayoutDashboard,
  LayoutTemplate,
  LifeBuoy,
  MessageCircle,
  Palette,
  Plug,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  "indian-rupee": IndianRupee,
  smartphone: Smartphone,
  search: Search,
  "trending-up": TrendingUp,
  layout: LayoutTemplate,
  gauge: Gauge,
  shield: ShieldCheck,
  message: MessageCircle,
  chart: BarChart3,
  "life-buoy": LifeBuoy,
  files: Files,
  wrench: Wrench,
  palette: Palette,
  "layout-dashboard": LayoutDashboard,
  plug: Plug,
  wallet: Wallet,
  clipboard: ClipboardCheck,
  calendar: Calendar,
  refresh: RefreshCw,
  globe: Globe,
  headset: Headset,
};

/** Rounded, softly tinted icon tile — the site's "emoji" treatment. */
export function IconTile({ name, tint = "#8b9cff", size = "md" }: { name: string; tint?: string; size?: "sm" | "md" }) {
  const Icon = map[name] ?? Sparkles;
  const dims = size === "sm" ? "size-9 rounded-xl" : "size-12 rounded-2xl";
  return (
    <span
      className={`grid shrink-0 place-items-center border ${dims}`}
      style={{ color: tint, borderColor: `color-mix(in oklab, ${tint} 40%, transparent)`, background: `color-mix(in oklab, ${tint} 13%, transparent)` } as CSSProperties}
    >
      <Icon aria-hidden className={size === "sm" ? "size-4" : "size-5"} strokeWidth={1.75} />
    </span>
  );
}

export const tileTints = ["#8b9cff", "#5eead4", "#f0abfc", "#fcd34d", "#7dd3fc", "#86efac", "#fdba74", "#c4b5fd"];
