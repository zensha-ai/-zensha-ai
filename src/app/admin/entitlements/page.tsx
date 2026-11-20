import { getAdminContext } from "@/lib/admin/guard";
import { setEntitlementExpiry, toggleEntitlement } from "@/lib/admin/actions";
import { Badge, EmptyState } from "@/components/ui";
import { AdminHeader, ExampleBadge, Notice, Table, fmtDateTime } from "../_components/shell";
import { NotConnected } from "../_components/not-connected";
import { ConfirmButton, SubmitButton } from "../_components/confirm-button";
import { GrantForm } from "../_components/forms";

type Row = {
  id: string;
  user_id: string;
  source: string;
  revoked: boolean;
  expires_at: string | null;
  created_at: string;
  student_projects: { title: string; is_example: boolean } | null;
};

/** Server-only check, evaluated per request. */
function isExpired(iso: string | null) {
  return iso ? new Date(iso).getTime() < Date.now() : false;
}

export default async function EntitlementsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const ctx = await getAdminContext();
  if (!ctx) return <NotConnected />;

  const [{ data, error }, { data: projects }, { data: usersPage }] = await Promise.all([
    ctx.db
      .from("entitlements")
      .select("id, user_id, source, revoked, expires_at, created_at, student_projects(title, is_example)")
      .order("created_at", { ascending: false })
      .limit(500),
    ctx.db.from("student_projects").select("id, title, is_example").order("title"),
    ctx.db.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);
  const emails = new Map((usersPage?.users ?? []).map((u) => [u.id, u.email ?? ""]));
  const rows = (data ?? []) as unknown as Row[];
  return (
    <div className="space-y-8">
      <AdminHeader
        eyebrow="Commerce"
        title="Download permissions"
        description="Who can download which project’s protected files. Purchases and free claims create these automatically; you can grant, revoke or set an expiry."
      />
      <Notice searchParams={sp} />
      <section aria-labelledby="grant-h">
        <h2 id="grant-h" className="eyebrow mb-3">Grant access</h2>
        <GrantForm projects={(projects ?? []) as { id: string; title: string; is_example: boolean }[]} />
      </section>

      {error ? (
        <p role="alert" className="text-sm text-danger">Could not load permissions.</p>
      ) : !rows.length ? (
        <EmptyState title="No download permissions yet" text="They appear after purchases, free claims or manual grants." />
      ) : (
        <Table caption="Download permissions" head={["Customer", "Project", "Source", "Status", "Expiry", ""]}>
          {rows.map((r) => {
            const expired = isExpired(r.expires_at);
            return (
              <tr key={r.id}>
                <td className="px-4 py-3 text-ink-2">{emails.get(r.user_id) || r.user_id.slice(0, 8)}</td>
                <td className="px-4 py-3">
                  <span className="flex flex-wrap items-center gap-2">
                    {r.student_projects?.title ?? "—"}
                    {r.student_projects?.is_example && <ExampleBadge />}
                  </span>
                  <span className="block text-xs text-muted">since {fmtDateTime(r.created_at)}</span>
                </td>
                <td className="px-4 py-3"><Badge>{r.source.replace("_", " ")}</Badge></td>
                <td className="px-4 py-3">
                  {r.revoked ? <Badge tone="warn">Revoked</Badge> : expired ? <Badge>Expired</Badge> : <Badge tone="success">Active</Badge>}
                </td>
                <td className="px-4 py-3">
                  <form action={setEntitlementExpiry} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={r.id} />
                    <label htmlFor={`exp-${r.id}`} className="sr-only">Expiry date</label>
                    <input id={`exp-${r.id}`} type="date" name="expires_at" defaultValue={r.expires_at?.slice(0, 10) ?? ""} className="rounded-md border border-line-strong bg-surface px-2 py-1 text-xs" />
                    <SubmitButton>Set</SubmitButton>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={toggleEntitlement}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="revoked" value={r.revoked ? "false" : "true"} />
                    {r.revoked ? (
                      <ConfirmButton tone="neutral" confirm="Restore download access?">Restore</ConfirmButton>
                    ) : (
                      <ConfirmButton confirm="Revoke download access for this customer?">Revoke</ConfirmButton>
                    )}
                  </form>
                </td>
              </tr>
            );
          })}
        </Table>
      )}
    </div>
  );
}
