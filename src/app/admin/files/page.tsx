import Link from "next/link";
import { getAdminContext } from "@/lib/admin/guard";
import { adminFileLink, deleteProjectFile, toggleFilePreview } from "@/lib/admin/actions";
import { Badge, EmptyState } from "@/components/ui";
import { AdminHeader, ExampleBadge, Notice, Table, fmtDateTime } from "../_components/shell";
import { NotConnected } from "../_components/not-connected";
import { ConfirmButton, SubmitButton } from "../_components/confirm-button";
import { Uploader } from "../_components/uploader";

export default async function FilesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const ctx = await getAdminContext();
  if (!ctx) return <NotConnected />;
  const { data: projects } = await ctx.db.from("student_projects").select("id, title, is_example, published").order("title");
  const projectId = typeof sp.project === "string" && /^[0-9a-f-]{36}$/i.test(sp.project) ? sp.project : "";
  const project = projects?.find((p) => p.id === projectId);
  const { data: files } = project
    ? await ctx.db.from("project_files").select("id, label, storage_path, size_bytes, is_free_preview, created_at").eq("project_id", project.id).order("created_at")
    : { data: null };

  return (
    <div className="space-y-8">
      <AdminHeader
        eyebrow="Catalogue"
        title="Protected files"
        description="Paid ZIPs live in the private project-files bucket. Customers can only download them through short-lived signed links after an entitlement check."
      />
      <Notice searchParams={sp} />

      <form className="flex max-w-xl flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <label htmlFor="project" className="mb-1.5 block text-sm font-medium">Student project</label>
          <select id="project" name="project" defaultValue={projectId} className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-sm">
            <option value="">Choose a project…</option>
            {(projects ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
                {p.is_example ? " (EXAMPLE)" : ""}
                {p.published ? "" : " — draft"}
              </option>
            ))}
          </select>
        </div>
        <SubmitButton>Show files</SubmitButton>
      </form>

      {!projects?.length ? (
        <EmptyState title="No student projects yet" text="Create a student project first, then upload its protected files here." />
      ) : !project ? (
        <p className="text-sm text-muted">Choose a project to manage its files.</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="display-3">{project.title}</h2>
            {project.is_example && <ExampleBadge />}
            <Link href={`/admin/student_projects/${project.id}`} className="text-sm underline underline-offset-4">Edit project</Link>
          </div>
          <Uploader kind="project-file" projectId={project.id} />
          {!files?.length ? (
            <EmptyState title="No files uploaded" text="Upload the source code, documentation and other package files listed on the project page." />
          ) : (
            <Table caption={`Files for ${project.title}`} head={["Label", "Size", "Access", "Uploaded", ""]}>
              {files.map((f) => (
                <tr key={f.id}>
                  <td className="px-4 py-3">
                    {f.label}
                    <span className="block break-all font-mono text-[0.68rem] text-muted">{f.storage_path}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{f.size_bytes ? `${(f.size_bytes / 1024 / 1024).toFixed(1)} MB` : "—"}</td>
                  <td className="px-4 py-3">
                    <form action={toggleFilePreview} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={f.id} />
                      <input type="hidden" name="value" value={f.is_free_preview ? "false" : "true"} />
                      {f.is_free_preview ? <Badge tone="accent">Free preview</Badge> : <Badge>Entitled only</Badge>}
                      <SubmitButton>{f.is_free_preview ? "Make protected" : "Make free preview"}</SubmitButton>
                    </form>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{fmtDateTime(f.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <form action={adminFileLink}>
                        <input type="hidden" name="id" value={f.id} />
                        <SubmitButton>Download</SubmitButton>
                      </form>
                      <form action={deleteProjectFile}>
                        <input type="hidden" name="id" value={f.id} />
                        <ConfirmButton confirm={`Delete “${f.label}” from storage? Customers will lose access to this file.`}>Delete</ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </>
      )}
    </div>
  );
}
