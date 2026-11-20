import Link from "next/link";
import { getAdminContext } from "@/lib/admin/guard";
import { ButtonLink, EmptyState } from "@/components/ui";
import { AdminHeader, Notice, Table, fmtDateTime } from "../_components/shell";
import { NotConnected } from "../_components/not-connected";

const suggestions = [
  { key: "home", text: "Homepage copy overrides (headline, intro, section text). Shape mirrors src/content/site.ts → home." },
  { key: "contact", text: "Verified contact details: { email, whatsapp (digits incl. country code), location, hours }." },
  { key: "seo:/about", text: "Page-level SEO override: { title, description, noindex }. Use any public path." },
];

export default async function SettingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const ctx = await getAdminContext();
  if (!ctx) return <NotConnected />;
  const { data, error } = await ctx.db.from("site_settings").select("key, updated_at").order("key");
  const existing = new Set((data ?? []).map((d) => d.key));

  return (
    <div className="space-y-8">
      <AdminHeader
        eyebrow="Content"
        title="Homepage, contact & SEO"
        description="Structured JSON settings that override the defaults in code. Values are validated before saving."
        actions={<ButtonLink href="/admin/settings/edit">New setting</ButtonLink>}
      />
      <Notice searchParams={sp} />
      {error ? (
        <p role="alert" className="text-sm text-danger">Could not load settings.</p>
      ) : !data?.length ? (
        <EmptyState title="No overrides yet" text="The site is using the default copy from the code." />
      ) : (
        <Table caption="Site settings" head={["Key", "Updated", ""]}>
          {data.map((s) => (
            <tr key={s.key}>
              <td className="px-4 py-3 font-mono text-sm">{s.key}</td>
              <td className="px-4 py-3 text-xs text-muted">{fmtDateTime(s.updated_at)}</td>
              <td className="px-4 py-3 text-right">
                <Link href={`/admin/settings/edit?key=${encodeURIComponent(s.key)}`} className="text-xs underline-offset-4 hover:underline">
                  Edit<span className="sr-only"> {s.key}</span>
                </Link>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <section aria-labelledby="sugg-h" className="rounded-xl border border-line bg-surface p-6">
        <h2 id="sugg-h" className="eyebrow">Common keys</h2>
        <ul className="mt-4 space-y-3">
          {suggestions.map((s) => (
            <li key={s.key} className="text-sm">
              <Link href={`/admin/settings/edit?key=${encodeURIComponent(s.key)}`} className="font-mono underline underline-offset-4">
                {s.key}
              </Link>
              {existing.has(s.key) && <span className="ml-2 text-xs text-success">set</span>}
              <span className="block text-muted">{s.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
