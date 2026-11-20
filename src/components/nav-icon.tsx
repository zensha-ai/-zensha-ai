import type { CSSProperties } from "react";
import {
  AppWindow,
  BookOpen,
  Bot,
  Boxes,
  BrainCircuit,
  Briefcase,
  Building2,
  Code2,
  Cpu,
  Database,
  FolderKanban,
  Gem,
  Gift,
  HelpCircle,
  LayoutGrid,
  LayoutTemplate,
  MessageCircle,
  Newspaper,
  Plug,
  Rocket,
  Search,
  Smartphone,
  Sparkles,
  Wifi,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  layout: LayoutTemplate,
  "app-window": AppWindow,
  smartphone: Smartphone,
  sparkles: Sparkles,
  boxes: Boxes,
  workflow: Workflow,
  plug: Plug,
  "message-circle": MessageCircle,
  search: Search,
  bot: Bot,
  database: Database,
  rocket: Rocket,
  briefcase: Briefcase,
  gem: Gem,
  building: Building2,
  code: Code2,
  cpu: Cpu,
  wifi: Wifi,
  brain: BrainCircuit,
  gift: Gift,
  grid: LayoutGrid,
  newspaper: Newspaper,
  book: BookOpen,
  folder: FolderKanban,
  help: HelpCircle,
};

/** Small tinted icon tile used in navigation menus. */
export function NavIcon({ name, tint = "#8b9cff" }: { name?: string; tint?: string }) {
  const Icon = (name && icons[name]) || Sparkles;
  return (
    <span
      className="grid size-10 shrink-0 place-items-center rounded-xl border transition-transform duration-300 group-hover/item:scale-110"
      style={{ color: tint, borderColor: `color-mix(in oklab, ${tint} 35%, transparent)`, background: `color-mix(in oklab, ${tint} 12%, transparent)` } as CSSProperties}
    >
      <Icon aria-hidden className="size-[1.1rem]" strokeWidth={1.75} />
    </span>
  );
}
