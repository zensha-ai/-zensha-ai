import Link from "next/link";
import { Download } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { ButtonLink, EmptyState } from "@/components/ui";

export const metadata = { title: "My downloads" };

type Row = {
  id: string;
  source: string;
  created_at: string;
  expires_at: string | null;
  student_projects: { id: string; slug: string; title: string; license: string | null; project_files: { id: string; label: string; size_bytes: number | null }[] } | null;
};

const size = (b: number | null) => (b ? (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.ceil(b / 1024)} KB`) : "");

export default async function DownloadsPage() {
  const user = await requireUser("/account/downloads");
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase!
    .from("entitlements")
    .select("id, source, created_at, expires_at, student_projects(id, slug, title, license, project_files(id, label, size_bytes))")
    .eq("user_id", user.id)
    .eq("revoked", false)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("created_at", { ascending: false });
  const rows = ((data ?? []) as unknown as Row[]).filter((r) => r.student_projects);

  return (
    <div>
      <h2 className="display-3">My downloads</h2>
      <p className="mt-2 max-w-2xl text-muted">
        Find the digital project files available with your purchases. Download access follows the terms shown at checkout.
      </p>
      <div className="mt-8">
        {!rows.length ? (
          <EmptyState
            title="No downloads yet"
            text="Files for purchased or claimed projects will appear here."
            action={<ButtonLink href="/student-projects">Browse Projects</ButtonLink>}
          />
        ) : (
          <ul className="grid gap-4">
            {rows.map((r) => {
              const p = r.student_projects!;
              return (
                <li key={r.id} className="rounded-2xl border border-line bg-surface p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <Link href={`/student-projects/${p.slug}`} className="text-lg font-medium hover:underline">
                      {p.title}
                    </Link>
                    <span className="font-mono text-xs text-muted">
                      {r.source === "free" ? "Free" : r.source === "admin_grant" ? "Granted" : "Purchased"} · {formatDate(r.created_at)}
                    </span>
                  </div>
                  {p.project_files.length ? (
                    <ul className="mt-4 divide-y divide-line border-t border-line">
                      {p.project_files.map((f) => (
                        <li key={f.id} className="flex items-center justify-between gap-4 py-3">
                          <span className="text-sm">
                            {f.label} <span className="text-muted">{size(f.size_bytes)}</span>
                          </span>
                          {/* Plain link: the route checks entitlement and redirects to a 60-second signed URL. */}
                          <a
                            href={`/api/downloads/${f.id}`}
                            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm hover:border-ink"
                            rel="nofollow"
                          >
                            <Download className="size-4" aria-hidden /> Download
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-muted">Files for this project are being prepared. Contact support if you need help.</p>
                  )}
                  <p className="mt-4 text-xs text-muted">
                    Use is governed by the <Link href="/legal/licensing" className="underline">Student Project License</Link>
                    {p.license ? ` (${p.license})` : ""}.
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
