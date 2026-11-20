import { getAdminContext } from "@/lib/admin/guard";
import { setUserRole } from "@/lib/admin/actions";
import { Badge, EmptyState } from "@/components/ui";
import { AdminHeader, Notice, Table, fmtDateTime } from "../_components/shell";
import { NotConnected } from "../_components/not-connected";
import { ConfirmButton } from "../_components/confirm-button";

export default async function CustomersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const ctx = await getAdminContext();
  if (!ctx) return <NotConnected />;

  const [{ data: profiles, error }, { data: usersPage }, { data: orders }] = await Promise.all([
    ctx.db.from("profiles").select("id, full_name, role, created_at").order("created_at", { ascending: false }).limit(500),
    ctx.db.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ctx.db.from("orders").select("user_id").eq("status", "paid").limit(5000),
  ]);
  const emails = new Map((usersPage?.users ?? []).map((u) => [u.id, u.email ?? ""]));
  const paidCounts = new Map<string, number>();
  (orders ?? []).forEach((o) => paidCounts.set(o.user_id, (paidCounts.get(o.user_id) ?? 0) + 1));

  return (
    <div>
      <AdminHeader eyebrow="Commerce" title="Customers" description="Registered accounts. Grant the admin role only to trusted people; you cannot change your own role." />
      <Notice searchParams={sp} />
      {error ? (
        <p role="alert" className="text-sm text-danger">Could not load customers.</p>
      ) : !profiles?.length ? (
        <EmptyState title="No accounts yet" text="Customers appear here after they register." />
      ) : (
        <Table caption="Customer accounts" head={["Name", "Email", "Joined", "Paid orders", "Role", ""]}>
          {profiles.map((p) => {
            const isMe = p.id === ctx.user.id;
            const nextRole = p.role === "admin" ? "customer" : "admin";
            return (
              <tr key={p.id}>
                <td className="px-4 py-3">{p.full_name || "—"}{isMe && <span className="ml-2 text-xs text-muted">(you)</span>}</td>
                <td className="px-4 py-3 text-ink-2">{emails.get(p.id) || "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{fmtDateTime(p.created_at)}</td>
                <td className="px-4 py-3 font-mono text-xs">{paidCounts.get(p.id) ?? 0}</td>
                <td className="px-4 py-3">
                  <Badge tone={p.role === "admin" ? "accent" : "neutral"}>{p.role}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  {!isMe && (
                    <form action={setUserRole}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="role" value={nextRole} />
                      <ConfirmButton
                        tone={nextRole === "admin" ? "danger" : "neutral"}
                        confirm={
                          nextRole === "admin"
                            ? `Give ${emails.get(p.id) || "this user"} full admin access (orders, customers, files, content)?`
                            : `Remove admin access from ${emails.get(p.id) || "this user"}?`
                        }
                      >
                        {nextRole === "admin" ? "Make admin" : "Remove admin"}
                      </ConfirmButton>
                    </form>
                  )}
                </td>
              </tr>
            );
          })}
        </Table>
      )}
    </div>
  );
}
