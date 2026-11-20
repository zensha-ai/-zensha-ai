import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminContext } from "@/lib/admin/guard";
import { getResource } from "@/lib/admin/resources";
import { deleteResource, saveResource } from "@/lib/admin/actions";
import { getPath, toFormValue } from "@/lib/admin/fields";
import { DraftNotice } from "@/components/ui";
import { AdminHeader, ExampleBadge, Notice, PublishedBadge } from "../../_components/shell";
import { NotConnected } from "../../_components/not-connected";
import { ResourceForm } from "../../_components/resource-form";
import { ConfirmButton } from "../../_components/confirm-button";

const publicPath: Record<string, (r: Record<string, unknown>) => string | null> = {
  services: (r) => `/services/${r.slug}`,
  products: (r) => `/products/${r.slug}`,
  student_projects: (r) => `/student-projects/${r.slug}`,
  work_items: (r) => `/our-work/${r.slug}`,
  articles: (r) => `/resources/${({ blog: "blog", guide: "guides", case_study: "case-studies" } as Record<string, string>)[String(r.kind)]}/${r.slug}`,
};

export default async function EditResourcePage({
  params,
  searchParams,
}: {
  params: Promise<{ resource: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { resource: key, id: rawId } = await params;
  const resource = getResource(key);
  if (!resource) notFound();
  const id = decodeURIComponent(rawId);
  if (resource.idColumn === "id" && !/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const sp = await searchParams;
  const ctx = await getAdminContext();
  if (!ctx) return <NotConnected />;

  const { data: row } = await ctx.db.from(resource.table).select("*").eq(resource.idColumn, id).maybeSingle();
  if (!row) notFound();

  const flat: Record<string, unknown> = resource.jsonbColumn ? { ...(row[resource.jsonbColumn] as Record<string, unknown>), ...row } : row;
  const defaults = Object.fromEntries(resource.fields.map((f) => [f.name, toFormValue(f, getPath(flat, f.name))]));
  const title = String(getPath(flat, resource.titleField) ?? resource.singular);
  const view = publicPath[resource.key]?.(flat);

  return (
    <div className="max-w-4xl">
      <p className="mb-4 text-sm">
        <Link href={`/admin/${resource.key}`} className="text-muted hover:text-ink">
          ← {resource.label}
        </Link>
      </p>
      <AdminHeader
        eyebrow={`Edit ${resource.singular}`}
        title={
          <span className="flex flex-wrap items-center gap-3">
            {title}
            {"published" in flat && <PublishedBadge value={flat.published} />}
            {resource.hasExampleFlag && Boolean(flat.is_example) && <ExampleBadge />}
          </span>
        }
        actions={
          <>
            {view && Boolean(flat.published) && (
              <Link href={view} target="_blank" rel="noopener" className="rounded-full border border-line-strong px-3.5 py-1.5 text-xs hover:border-ink">
                View on site ↗
              </Link>
            )}
            {resource.key === "student_projects" && (
              <Link href={`/admin/files?project=${flat.id}`} className="rounded-full border border-line-strong px-3.5 py-1.5 text-xs hover:border-ink">
                Protected files
              </Link>
            )}
            <form action={deleteResource.bind(null, resource.key, id)}>
              <ConfirmButton confirm={`Delete “${title}” permanently? This cannot be undone.`}>Delete</ConfirmButton>
            </form>
          </>
        }
      />
      <Notice searchParams={sp} />
      {resource.editorialNote && (
        <div className="mb-8">
          <DraftNotice>{resource.editorialNote}</DraftNotice>
        </div>
      )}
      <ResourceForm fields={resource.fields} defaults={defaults} action={saveResource.bind(null, resource.key, id)} />
    </div>
  );
}
