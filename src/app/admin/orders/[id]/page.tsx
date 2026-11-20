import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminContext } from "@/lib/admin/guard";
import { updateOrderStatus } from "@/lib/admin/actions";
import { formatINR } from "@/lib/format";
import { DraftNotice } from "@/components/ui";
import { AdminHeader, Notice, OrderStatusBadge, Table, fmtDateTime } from "../../_components/shell";
import { NotConnected } from "../../_components/not-connected";
import { ConfirmButton } from "../../_components/confirm-button";

type Item = { id: string; title_snapshot: string; package: string; unit_price_paise: number; quantity: number; project_id: string };

export default async function OrderDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const sp = await searchParams;
  const ctx = await getAdminContext();
  if (!ctx) return <NotConnected />;
  const { data: o } = await ctx.db.from("orders").select("*, order_items(*)").eq("id", id).maybeSingle();
  if (!o) notFound();
  const items = (o.order_items ?? []) as Item[];
  const { data: ents } = await ctx.db.from("entitlements").select("id, project_id, revoked, source").eq("order_id", id);

  const facts: [string, string][] = [
    ["Created", fmtDateTime(o.created_at)],
    ["Paid at", fmtDateTime(o.paid_at)],
    ["Customer", `${o.billing_name} · ${o.billing_email}`],
    ["Phone", o.billing_phone || "—"],
    ["Razorpay order", o.razorpay_order_id || "—"],
    ["Razorpay payment", o.razorpay_payment_id || "—"],
    ["Download entitlements", ents?.length ? `${ents.filter((e) => !e.revoked).length} active of ${ents.length}` : "None"],
  ];
  const address = o.shipping_address as Record<string, string> | null;

  return (
    <div className="max-w-4xl">
      <p className="mb-4 text-sm">
        <Link href="/admin/orders" className="text-muted hover:text-ink">← Orders</Link>
      </p>
      <AdminHeader
        eyebrow="Order"
        title={
          <span className="flex flex-wrap items-center gap-3">
            <span className="font-mono">{String(o.id).slice(0, 8)}</span>
            <OrderStatusBadge status={o.status} />
          </span>
        }
        description={`Total ${formatINR(o.amount_paise)} ${o.currency}`}
      />
      <Notice searchParams={sp} />

      <dl className="mb-8 grid gap-x-6 gap-y-3 rounded-xl border border-line bg-surface p-6 sm:grid-cols-[12rem_1fr]">
        {facts.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-sm text-muted">{k}</dt>
            <dd className="break-all text-sm">{v}</dd>
          </div>
        ))}
        {address && (
          <div className="contents">
            <dt className="text-sm text-muted">Shipping address</dt>
            <dd className="whitespace-pre-line text-sm">{Object.values(address).filter(Boolean).join("\n")}</dd>
          </div>
        )}
      </dl>

      <Table caption="Order items" head={["Item", "Package", "Unit price", "Qty"]}>
        {items.map((i) => (
          <tr key={i.id}>
            <td className="px-4 py-3">{i.title_snapshot}</td>
            <td className="px-4 py-3">{i.package === "kit" ? "Physical kit" : "Digital download"}</td>
            <td className="px-4 py-3 font-mono text-xs">{formatINR(i.unit_price_paise)}</td>
            <td className="px-4 py-3">{i.quantity}</td>
          </tr>
        ))}
      </Table>

      <section aria-labelledby="actions-h" className="mt-8 space-y-4">
        <h2 id="actions-h" className="eyebrow">Status actions</h2>
        <DraftNotice>
          These only record the status in this system. Issue refunds in the Razorpay dashboard first. Marking an order refunded revokes the
          download access it granted. Orders can never be marked paid manually.
        </DraftNotice>
        <div className="flex flex-wrap gap-3">
          {o.status === "paid" && (
            <form action={updateOrderStatus}>
              <input type="hidden" name="id" value={o.id} />
              <input type="hidden" name="status" value="refunded" />
              <ConfirmButton confirm="Mark this order as refunded and revoke its download access? Make sure the refund was issued in Razorpay.">
                Mark refunded
              </ConfirmButton>
            </form>
          )}
          {(o.status === "pending" || o.status === "failed") && (
            <form action={updateOrderStatus}>
              <input type="hidden" name="id" value={o.id} />
              <input type="hidden" name="status" value="cancelled" />
              <ConfirmButton confirm="Cancel this unpaid order?">Cancel order</ConfirmButton>
            </form>
          )}
          {!["paid", "pending", "failed"].includes(o.status) && <p className="text-sm text-muted">No further actions for a {o.status} order.</p>}
        </div>
      </section>
    </div>
  );
}
