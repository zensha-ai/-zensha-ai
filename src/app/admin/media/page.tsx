/* eslint-disable @next/next/no-img-element -- admin thumbnails of arbitrary uploads */
import { getAdminContext } from "@/lib/admin/guard";
import { deleteMedia } from "@/lib/admin/actions";
import { EmptyState } from "@/components/ui";
import { AdminHeader, Notice } from "../_components/shell";
import { NotConnected } from "../_components/not-connected";
import { ConfirmButton } from "../_components/confirm-button";
import { CopyButton, Uploader } from "../_components/uploader";

export default async function MediaPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const ctx = await getAdminContext();
  if (!ctx) return <NotConnected />;
  const { data: items } = await ctx.db.from("media").select("id, path, alt, created_at").order("created_at", { ascending: false }).limit(300);

  return (
    <div className="space-y-8">
      <AdminHeader
        eyebrow="Content"
        title="Media library"
        description="Public images for products, projects, articles and work. Copy the URL into an image field. Never upload paid files here — this bucket is public."
      />
      <Notice searchParams={sp} />
      <Uploader kind="media" />
      {!items?.length ? (
        <EmptyState title="No images yet" text="Uploaded images appear here with a copyable public URL." />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((m) => {
            const url = ctx.db.storage.from("media").getPublicUrl(m.path).data.publicUrl;
            return (
              <li key={m.id} className="overflow-hidden rounded-xl border border-line bg-surface">
                <div className="aspect-[4/3] bg-paper-2">
                  <img src={url} alt={m.alt || ""} loading="lazy" className="size-full object-cover" />
                </div>
                <div className="space-y-3 p-4">
                  <p className="text-sm">{m.alt || <span className="text-danger">Missing alt text</span>}</p>
                  <p className="break-all font-mono text-[0.68rem] text-muted">{url}</p>
                  <div className="flex gap-2">
                    <CopyButton value={url} />
                    <form action={deleteMedia}>
                      <input type="hidden" name="id" value={m.id} />
                      <ConfirmButton confirm="Delete this image? Pages that use its URL will show a broken image.">Delete</ConfirmButton>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
