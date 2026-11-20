import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate, formatINR } from "@/lib/format";
import { EmptyState, ButtonLink } from "@/components/ui";
import { OrderStatusBadge } from "@/components/commerce/order-status";

export const metadata = { title: "Order history" };

export default async function OrdersPage() {
  const user = await requireUser("/account/orders");
  const supabase = await createSupabaseServerClient();
  const { data: orders } = await supabase!
    .from("orders")
    .select("id, status, amount_paise, created_at, order_items(title_snapshot)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h2 className="display-3">Order history</h2>
      <p className="mt-2 text-muted">Order history displays purchase details and available files.</p>
      <div className="mt-8">
        {!orders?.length ? (
          <EmptyState
            title="No orders yet"
            text="When you purchase a project, its details will appear here."
            action={<ButtonLink href="/student-projects">Browse Projects</ButtonLink>}
          />
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/account/orders/${o.id}`} className="flex flex-col gap-2 py-5 hover:bg-surface sm:flex-row sm:items-center sm:justify-between sm:px-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted">#{o.id.slice(0, 8).toUpperCase()} · {formatDate(o.created_at)}</p>
                    <p className="mt-1 truncate font-medium">
                      {(o.order_items as { title_snapshot: string }[]).map((i) => i.title_snapshot).join(", ") || "Order"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <OrderStatusBadge status={o.status} />
                    <span className="font-medium">{formatINR(o.amount_paise)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
