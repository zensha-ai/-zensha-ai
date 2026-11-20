import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Notice } from "@/components/commerce/fields";
import { ProfileForm } from "./profile-form";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ error?: string; updated?: string }> }) {
  const user = await requireUser("/account");
  const { error, updated } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const [{ data: profile }, { count: orderCount }, { count: downloadCount }] = await Promise.all([
    supabase!.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle(),
    supabase!.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase!.from("entitlements").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("revoked", false),
  ]);

  return (
    <div className="grid gap-12">
      {error === "forbidden" && <Notice tone="error">You don&rsquo;t have permission to view that page.</Notice>}
      {updated === "password" && <Notice tone="success">Your password has been updated.</Notice>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/account/orders" className="rounded-2xl border border-line bg-surface p-6 hover:border-ink">
          <p className="eyebrow">Orders</p>
          <p className="display-3 mt-3">{orderCount ?? 0}</p>
          <p className="mt-2 text-sm text-muted">View purchase details and status.</p>
        </Link>
        <Link href="/account/downloads" className="rounded-2xl border border-line bg-surface p-6 hover:border-ink">
          <p className="eyebrow">My downloads</p>
          <p className="display-3 mt-3">{downloadCount ?? 0}</p>
          <p className="mt-2 text-sm text-muted">Projects with available files.</p>
        </Link>
      </div>

      <section aria-labelledby="profile-h">
        <h2 id="profile-h" className="display-3 mb-6">
          Profile
        </h2>
        <ProfileForm fullName={profile?.full_name ?? ""} phone={profile?.phone ?? ""} email={user.email} />
      </section>
    </div>
  );
}
