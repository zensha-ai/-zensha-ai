import { AppWindow, Bot, Boxes, Database, Layout, MessageCircle, Plug, Search, Smartphone, Sparkles, Workflow, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  layout: Layout,
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
};

export function ServiceIcon({ name, className = "size-5" }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Sparkles;
  return <Icon aria-hidden className={className} strokeWidth={1.5} />;
}
