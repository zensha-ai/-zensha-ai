import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate, formatINR } from "@/lib/format";
import { ButtonLink } from "@/components/ui";
import { OrderStatusBadge } from "@/components/commerce/order-status";

export const metadata = { title: "Order details" };

const UUID = /^[0-9a-f-]{36}$/i;

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const user = await requireUser(`/account/orders/${id}`);
  const supabase = await createSupabaseServerClient();
  const { data: order } = await supabase!
    .from("orders")
    .select("id, status, amount_paise, created_at, paid_at, billing_name, billing_email, shipping_address, order_items(id, title_snapshot, package, unit_price_paise, quantity)")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!order) notFound();

  const items = order.order_items as { id: string; title_snapshot: string; package: string; unit_price_paise: number; quantity: number }[];
  return (
    <div>
      <Link href="/account/orders" className="font-mono text-xs text-muted hover:text-ink">
        ← All orders
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <h2 className="display-3">Order #{order.id.slice(0, 8).toUpperCase()}</h2>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-2 text-sm text-muted">
        Placed {formatDate(order.created_at)}
        {order.paid_at && ` · Paid ${formatDate(order.paid_at)}`}
      </p>

      <table className="mt-8 w-full text-left text-sm">
        <caption className="sr-only">Order items</caption>
        <thead className="border-b border-line text-muted">
          <tr>
            <th scope="col" className="py-3 font-normal">Item</th>
            <th scope="col" className="py-3 font-normal">Package</th>
            <th scope="col" className="py-3 text-right font-normal">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {items.map((i) => (
            <tr key={i.id}>
              <td className="py-4 pr-4">{i.title_snapshot}</td>
              <td className="py-4 pr-4">{i.package === "kit" ? "Physical kit" : "Digital download"}</td>
              <td className="py-4 text-right">{formatINR(i.unit_price_paise * i.quantity)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t border-line-strong">
          <tr>
            <th scope="row" colSpan={2} className="py-4 font-medium">Total</th>
            <td className="py-4 text-right font-medium">{formatINR(order.amount_paise)}</td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-8 grid gap-2 text-sm text-ink-2">
        <p>Billing: {order.billing_name} · {order.billing_email}</p>
        {order.shipping_address && (
          <p>Physical kit shipping is handled separately under the stated shipping terms for each kit.</p>
        )}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {order.status === "paid" && <ButtonLink href="/account/downloads">Go to My Downloads</ButtonLink>}
        <ButtonLink href={`/support?order=${order.id.slice(0, 8).toUpperCase()}`} variant="secondary">
          Get help with this order
        </ButtonLink>
      </div>
    </div>
  );
}
