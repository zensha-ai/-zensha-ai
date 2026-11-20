import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminContext } from "@/lib/admin/guard";
import { updateEnquiryStatus } from "@/lib/admin/actions";
import { Badge } from "@/components/ui";
import { AdminHeader, Notice, fmtDateTime } from "../../_components/shell";
import { NotConnected } from "../../_components/not-connected";
import { SubmitButton } from "../../_components/confirm-button";

export default async function EnquiryDetail({
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
  const { data: e } = await ctx.db.from("enquiries").select("*").eq("id", id).maybeSingle();
  if (!e) notFound();

  const rows: [string, string | null][] = [
    ["Received", fmtDateTime(e.created_at)],
    ["Type", e.kind === "student_support" ? "Student project support" : "Business enquiry"],
    ["Email", e.email],
    ["Phone / WhatsApp", e.phone],
    ["Company", e.company],
    ["Service of interest", e.service],
    ["Budget", e.budget],
    ["Timeline", e.timeline],
    ["Order reference", e.order_reference],
  ];

  return (
    <div className="max-w-3xl">
      <p className="mb-4 text-sm">
        <Link href="/admin/enquiries" className="text-muted hover:text-ink">← Enquiries</Link>
      </p>
      <AdminHeader eyebrow="Enquiry" title={<span className="flex flex-wrap items-center gap-3">{e.name}<Badge>{String(e.status).replace("_", " ")}</Badge></span>} />
      <Notice searchParams={sp} />
      <dl className="grid gap-x-6 gap-y-3 rounded-xl border border-line bg-surface p-6 sm:grid-cols-[12rem_1fr]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-sm text-muted">{k}</dt>
            <dd className="text-sm">
              {k === "Email" && v ? (
                <a href={`mailto:${v}`} className="underline underline-offset-4">{v}</a>
              ) : (
                v || "—"
              )}
            </dd>
          </div>
        ))}
      </dl>
      <section aria-labelledby="msg-h" className="mt-6 rounded-xl border border-line bg-surface p-6">
        <h2 id="msg-h" className="eyebrow">Message</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{e.message}</p>
      </section>
      <form action={updateEnquiryStatus} className="mt-6 flex flex-wrap items-end gap-3">
        <input type="hidden" name="id" value={e.id} />
        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm font-medium">Status</label>
          <select id="status" name="status" defaultValue={e.status} className="rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm">
            <option value="new">New</option>
            <option value="in_progress">In progress</option>
            <option value="closed">Closed</option>
            <option value="spam">Spam</option>
          </select>
        </div>
        <SubmitButton>Update status</SubmitButton>
      </form>
      <p className="mt-6 text-xs text-muted">Reply from your business inbox. Never ask customers to send passwords or payment card details.</p>
    </div>
  );
}
