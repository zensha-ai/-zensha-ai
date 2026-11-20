import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminContext } from "@/lib/admin/guard";
import { getResource, type ListColumn } from "@/lib/admin/resources";
import { getPath } from "@/lib/admin/fields";
import { formatDate, formatINR } from "@/lib/format";
import { Badge, ButtonLink, EmptyState } from "@/components/ui";
import { AdminHeader, ExampleBadge, Notice, PublishedBadge, Table } from "../_components/shell";
import { NotConnected } from "../_components/not-connected";

type Props = {
  params: Promise<{ resource: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResourceListPage({ params, searchParams }: Props) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();
  const sp = await searchParams;
  const ctx = await getAdminContext();
  if (!ctx) return <NotConnected />;

  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  let query = ctx.db.from(resource.table).select("*").order(resource.orderBy.column, { ascending: resource.orderBy.ascending }).limit(500);
  if (q && !resource.jsonbColumn) query = query.ilike(resource.titleField, `%${q.replace(/[%_,()]/g, " ")}%`);
  const { data, error } = await query;

  const rows = (data ?? []).map((r: Record<string, unknown>) =>
    resource.jsonbColumn ? { ...(r[resource.jsonbColumn] as Record<string, unknown>), ...r } : r,
  );

  return (
    <div>
      <AdminHeader
        eyebrow="Manage"
        title={resource.label}
        description={resource.description}
        actions={<ButtonLink href={`/admin/${resource.key}/new`}>New {resource.singular}</ButtonLink>}
      />
      <Notice searchParams={sp} />

      {!resource.jsonbColumn && (
        <form role="search" className="mb-6 flex max-w-md gap-2">
          <label htmlFor="q" className="sr-only">
            Search {resource.label}
          </label>
          <input id="q" name="q" defaultValue={q} placeholder={`Search by ${resource.titleField}…`} className="w-full rounded-full border border-line-strong bg-surface px-4 py-2 text-sm" />
          <button type="submit" className="rounded-full border border-line-strong px-4 text-sm hover:border-ink">
            Search
          </button>
        </form>
      )}

      {error ? (
        <p role="alert" className="text-sm text-danger">
          Could not load records. Check that the migrations have been applied.
        </p>
      ) : rows.length === 0 ? (
        <EmptyState
          title={q ? "No matching records" : `No ${resource.label.toLowerCase()} yet`}
          text={q ? "Try another search term." : `Create the first ${resource.singular}. Only real, verified content should be published.`}
          action={<ButtonLink href={`/admin/${resource.key}/new`}>New {resource.singular}</ButtonLink>}
        />
      ) : (
        <Table caption={`${resource.label} list`} head={[...resource.listColumns.map((c) => c.label), "Updated", ""]}>
          {rows.map((row) => {
            const id = String(row[resource.idColumn]);
            const href = `/admin/${resource.key}/${encodeURIComponent(id)}`;
            return (
              <tr key={id} className="hover:bg-paper-2/60">
                {resource.listColumns.map((c, i) => (
                  <td key={c.key} className="px-4 py-3 align-top">
                    {i === 0 ? (
                      <span className="flex flex-wrap items-center gap-2">
                        <Link href={href} className="font-medium underline-offset-4 hover:underline">
                          {String(getPath(row, c.key) ?? "—")}
                        </Link>
                        {resource.hasExampleFlag && Boolean(row.is_example) && <ExampleBadge />}
                      </span>
                    ) : (
                      <Cell column={c} value={getPath(row, c.key)} />
                    )}
                  </td>
                ))}
                <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{formatDate(row.updated_at as string | null)}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={href} className="text-xs underline-offset-4 hover:underline">
                    Edit<span className="sr-only"> {String(getPath(row, resource.listColumns[0].key) ?? "")}</span>
                  </Link>
                </td>
              </tr>
            );
          })}
        </Table>
      )}
    </div>
  );
}

function Cell({ column, value }: { column: ListColumn; value: unknown }) {
  switch (column.kind) {
    case "published":
      return <PublishedBadge value={value} />;
    case "money":
      return <span className="font-mono text-xs">{typeof value === "number" ? (value === 0 ? "Free" : formatINR(value)) : "—"}</span>;
    case "date":
      return <span className="text-xs">{formatDate(value as string | null) || "—"}</span>;
    case "badge":
      return value ? <Badge>{String(value).replace(/_/g, " ")}</Badge> : <span>—</span>;
    case "bool":
      return <span>{value ? "Yes" : "No"}</span>;
    default:
      return <span className="text-ink-2">{value == null || value === "" ? "—" : String(value)}</span>;
  }
}
