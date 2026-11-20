import Link from "next/link";
import { getAdminContext } from "@/lib/admin/guard";
import { deleteSetting } from "@/lib/admin/actions";
import { home } from "@/content/site";
import { AdminHeader, Notice } from "../../_components/shell";
import { NotConnected } from "../../_components/not-connected";
import { ConfirmButton } from "../../_components/confirm-button";
import { SettingForm } from "../../_components/forms";

const templates: Record<string, unknown> = {
  home,
  contact: { email: "", whatsapp: "", location: "", hours: "" },
};

export default async function EditSettingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const ctx = await getAdminContext();
  if (!ctx) return <NotConnected />;
  const key = typeof sp.key === "string" ? sp.key.slice(0, 140) : "";
  const { data } = key ? await ctx.db.from("site_settings").select("value").eq("key", key).maybeSingle() : { data: null };
  const exists = Boolean(data);
  const template = templates[key] ?? (key.startsWith("seo:") ? { title: "", description: "" } : {});
  const initialValue = JSON.stringify(data?.value ?? template, null, 2);

  return (
    <div className="max-w-4xl">
      <p className="mb-4 text-sm">
        <Link href="/admin/settings" className="text-muted hover:text-ink">← Settings</Link>
      </p>
      <AdminHeader
        eyebrow={exists ? "Edit setting" : "New setting"}
        title={key ? <span className="font-mono">{key}</span> : "New setting"}
        description={exists ? undefined : "Pre-filled with the current default from code where available. Remove anything you don’t want to override."}
        actions={
          exists ? (
            <form action={deleteSetting}>
              <input type="hidden" name="key" value={key} />
              <ConfirmButton confirm={`Delete the “${key}” override? The site will fall back to the default.`}>Delete</ConfirmButton>
            </form>
          ) : undefined
        }
      />
      <Notice searchParams={sp} />
      <SettingForm initialKey={key} initialValue={initialValue} />
    </div>
  );
}
