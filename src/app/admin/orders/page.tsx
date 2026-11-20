import Link from "next/link";
import { getAdminContext } from "@/lib/admin/guard";
import { formatINR } from "@/lib/format";
import { EmptyState } from "@/components/ui";
import { AdminHeader, FilterTabs, Notice, OrderStatusBadge, Table, fmtDateTime } from "../_components/shell";
import { NotConnected } from "../_components/not-connected";

const STATUSES = ["pending", "paid", "failed", "refunded", "cancelled"];

export default async function OrdersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const ctx = await getAdminContext();
  if (!ctx) return <NotConnected />;
  const status = typeof sp.status === "string" && STATUSES.includes(sp.status) ? sp.status : "";

  let q = ctx.db
    .from("orders")
    .select("id, status, amount_paise, billing_name, billing_email, created_at, razorpay_payment_id")
    .order("created_at", { ascending: false })
    .limit(300);
  if (status) q = q.eq("status", status);
  const { data, error } = await q;

  return (
    <div>
      <AdminHeader
        eyebrow="Commerce"
        title="Orders"
        description="Orders are marked paid only by verified Razorpay signatures and webhooks — never manually."
      />
      <Notice searchParams={sp} />
      <FilterTabs base="/admin/orders" param="status" current={status} options={[{ value: "", label: "All" }, ...STATUSES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))]} />
      {error ? (
        <p role="alert" className="text-sm text-danger">Could not load orders.</p>
      ) : !data?.length ? (
        <EmptyState title="No orders" text="Orders appear here once checkout is enabled and customers purchase projects." />
      ) : (
        <Table caption="Orders" head={["Created", "Order", "Customer", "Amount", "Status"]}>
          {data.map((o) => (
            <tr key={o.id} className="hover:bg-paper-2/60">
              <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{fmtDateTime(o.created_at)}</td>
              <td className="px-4 py-3">
                <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs underline-offset-4 hover:underline">
                  {String(o.id).slice(0, 8)}
                </Link>
              </td>
              <td className="px-4 py-3">
                {o.billing_name}
                <span className="block text-xs text-muted">{o.billing_email}</span>
              </td>
              <td className="px-4 py-3 font-mono text-xs">{formatINR(o.amount_paise)}</td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={o.status} />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
