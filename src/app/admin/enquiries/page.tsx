import Link from "next/link";
import { getAdminContext } from "@/lib/admin/guard";
import { Badge, EmptyState } from "@/components/ui";
import { AdminHeader, FilterTabs, Notice, Table, fmtDateTime } from "../_components/shell";
import { NotConnected } from "../_components/not-connected";

const STATUSES = ["new", "in_progress", "closed", "spam"] as const;

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const ctx = await getAdminContext();
  if (!ctx) return <NotConnected />;
  const status = typeof sp.status === "string" && (STATUSES as readonly string[]).includes(sp.status) ? sp.status : "";
  const kind = sp.kind === "student_support" || sp.kind === "business" ? sp.kind : "";

  let q = ctx.db
    .from("enquiries")
    .select("id, kind, name, email, company, service, status, created_at")
    .order("created_at", { ascending: false })
    .limit(300);
  if (status) q = q.eq("status", status);
  else q = q.neq("status", "spam");
  if (kind) q = q.eq("kind", kind);
  const { data, error } = await q;

  return (
    <div>
      <AdminHeader eyebrow="Inbox" title="Enquiries" description="Business enquiries and student project support requests. Enquiries are never deleted; mark unwanted ones as spam." />
      <Notice searchParams={sp} />
      <FilterTabs
        base="/admin/enquiries"
        param="status"
        current={status}
        options={[
          { value: "", label: "All (excl. spam)" },
          { value: "new", label: "New" },
          { value: "in_progress", label: "In progress" },
          { value: "closed", label: "Closed" },
          { value: "spam", label: "Spam" },
        ]}
      />
      {error ? (
        <p role="alert" className="text-sm text-danger">Could not load enquiries.</p>
      ) : !data?.length ? (
        <EmptyState title="No enquiries here" text="Submissions from the contact and support forms will appear here." />
      ) : (
        <Table caption="Enquiries" head={["Received", "Name", "Type", "Service", "Status"]}>
          {data.map((e) => (
            <tr key={e.id} className="hover:bg-paper-2/60">
              <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{fmtDateTime(e.created_at)}</td>
              <td className="px-4 py-3">
                <Link href={`/admin/enquiries/${e.id}`} className="font-medium underline-offset-4 hover:underline">
                  {e.name}
                </Link>
                <span className="block text-xs text-muted">{e.company || e.email}</span>
              </td>
              <td className="px-4 py-3">
                <Badge>{e.kind === "student_support" ? "Student support" : "Business"}</Badge>
              </td>
              <td className="px-4 py-3 text-ink-2">{e.service || "—"}</td>
              <td className="px-4 py-3">
                <Badge tone={e.status === "new" ? "warn" : e.status === "closed" ? "success" : "neutral"}>{String(e.status).replace("_", " ")}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
