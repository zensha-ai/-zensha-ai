import { Badge } from "@/components/ui";

const map: Record<string, { label: string; tone: "neutral" | "accent" | "success" | "warn" }> = {
  pending: { label: "Awaiting payment", tone: "neutral" },
  paid: { label: "Paid", tone: "success" },
  failed: { label: "Payment failed", tone: "warn" },
  refunded: { label: "Refunded", tone: "neutral" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const s = map[status] ?? { label: status, tone: "neutral" as const };
  return <Badge tone={s.tone}>{s.label}</Badge>;
}
