import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminContext } from "@/lib/admin/guard";
import { getResource } from "@/lib/admin/resources";
import { saveResource } from "@/lib/admin/actions";
import { toFormValue } from "@/lib/admin/fields";
import { DraftNotice } from "@/components/ui";
import { AdminHeader } from "../../_components/shell";
import { NotConnected } from "../../_components/not-connected";
import { ResourceForm } from "../../_components/resource-form";

export default async function NewResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();
  const ctx = await getAdminContext();
  if (!ctx) return <NotConnected />;

  const defaults = Object.fromEntries(resource.fields.map((f) => [f.name, toFormValue(f, undefined)]));

  return (
    <div className="max-w-4xl">
      <p className="mb-4 text-sm">
        <Link href={`/admin/${resource.key}`} className="text-muted hover:text-ink">
          ← {resource.label}
        </Link>
      </p>
      <AdminHeader eyebrow="Create" title={`New ${resource.singular}`} description="New records are saved as drafts unless you tick Published." />
      {resource.editorialNote && (
        <div className="mb-8">
          <DraftNotice>{resource.editorialNote}</DraftNotice>
        </div>
      )}
      <ResourceForm fields={resource.fields} defaults={defaults} action={saveResource.bind(null, resource.key, null)} submitLabel={`Create ${resource.singular}`} />
    </div>
  );
}
