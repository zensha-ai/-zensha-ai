import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const noStore = { "Cache-Control": "no-store, private" };

/**
 * Authenticated download. Checks the caller's entitlement, then redirects to a
 * 60-second signed URL from the PRIVATE 'project-files' bucket.
 */
export async function GET(request: NextRequest, ctx: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await ctx.params;
  if (!UUID.test(fileId)) return new NextResponse("Not found", { status: 404, headers: noStore });

  const user = await getCurrentUser();
  if (!user) {
    const login = new URL(`/login?next=${encodeURIComponent("/account/downloads")}`, request.nextUrl.origin);
    return NextResponse.redirect(login, { headers: noStore });
  }
  if (!(await rateLimit("download", 30, 600, user.id))) {
    return new NextResponse("Too many downloads. Please wait a few minutes.", { status: 429, headers: noStore });
  }

  const db = createSupabaseAdminClient();
  if (!db) return new NextResponse("Downloads are not available yet.", { status: 503, headers: noStore });

  const { data: file } = await db
    .from("project_files")
    .select("id, project_id, storage_path, is_free_preview, student_projects(published)")
    .eq("id", fileId)
    .maybeSingle();
  if (!file) return new NextResponse("Not found", { status: 404, headers: noStore });

  const project = file.student_projects as unknown as { published: boolean } | null;
  let allowed = user.role === "admin" || (file.is_free_preview && !!project?.published);
  if (!allowed) {
    const { data: ent } = await db
      .from("entitlements")
      .select("id, expires_at")
      .eq("user_id", user.id)
      .eq("project_id", file.project_id)
      .eq("revoked", false)
      .maybeSingle();
    allowed = !!ent && (!ent.expires_at || new Date(ent.expires_at).getTime() > Date.now());
  }
  if (!allowed) return new NextResponse("You don't have access to this file.", { status: 403, headers: noStore });

  const { data: signed, error } = await db.storage.from("project-files").createSignedUrl(file.storage_path, 60, { download: true });
  if (error || !signed?.signedUrl) return new NextResponse("File temporarily unavailable.", { status: 502, headers: noStore });

  await db.from("download_events").insert({ user_id: user.id, file_id: file.id });
  return NextResponse.redirect(signed.signedUrl, { status: 302, headers: noStore });
}
