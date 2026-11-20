import Link from "next/link";
import { getAdminContext } from "@/lib/admin/guard";
import { launchChecklist } from "@/lib/admin/checklist";
import { Badge, ButtonLink } from "@/components/ui";
import { AdminHeader } from "./_components/shell";
import { NotConnected } from "./_components/not-connected";
import { SeedForm } from "./_components/forms";

export default async function AdminDashboard() {
  const ctx = await getAdminContext();
  const checklist = launchChecklist();
  if (!ctx) {
    return (
      <div className="space-y-10">
        <NotConnected />
        <Checklist items={checklist} />
      </div>
    );
  }
  const { db } = ctx;
  const head = (table: string) => db.from(table).select("*", { count: "exact", head: true });
  const n = async (q: PromiseLike<{ count: number | null }>) => (await q).count ?? 0;

  const [newEnquiries, pendingOrders, paidOrders, products, projects, articles, services] = await Promise.all([
    n(head("enquiries").eq("status", "new")),
    n(head("orders").eq("status", "pending")),
    n(head("orders").eq("status", "paid")),
    n(head("products").eq("published", true)),
    n(head("student_projects").eq("published", true)),
    n(head("articles").eq("published", true)),
    n(head("services")),
  ]);

  const stats = [
    { label: "New enquiries", value: newEnquiries, href: "/admin/enquiries?status=new" },
    { label: "Pending orders", value: pendingOrders, href: "/admin/orders?status=pending" },
    { label: "Paid orders", value: paidOrders, href: "/admin/orders?status=paid" },
    { label: "Published products", value: products, href: "/admin/products" },
    { label: "Published student projects", value: projects, href: "/admin/student_projects" },
    { label: "Published articles", value: articles, href: "/admin/articles" },
  ];

  return (
    <div className="space-y-12">
      <AdminHeader eyebrow="Overview" title="Dashboard" description="Content, catalogue, orders and enquiries at a glance." />

      <section aria-labelledby="stats-h">
        <h2 id="stats-h" className="sr-only">
          Key counts
        </h2>
        <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((s) => (
            <li key={s.label} className="bg-surface">
              <Link href={s.href} className="block p-5 hover:bg-paper-2">
                <span className="block font-mono text-3xl">{s.value}</span>
                <span className="mt-1 block text-sm text-muted">{s.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="quick-h" className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-6">
          <h2 id="quick-h" className="eyebrow">
            Quick actions
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink href="/admin/student_projects/new" variant="secondary">New student project</ButtonLink>
            <ButtonLink href="/admin/products/new" variant="secondary">New product</ButtonLink>
            <ButtonLink href="/admin/articles/new" variant="secondary">New article</ButtonLink>
            <ButtonLink href="/admin/files" variant="secondary">Upload protected file</ButtonLink>
            <ButtonLink href="/admin/settings" variant="secondary">Homepage & SEO</ButtonLink>
          </div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-6">
          <h2 className="eyebrow">Content source</h2>
          <p className="mt-3 text-sm text-muted">
            {services === 0
              ? "Services and general FAQs currently come from the code. Seed them into the database to edit them here."
              : `${services} services are stored in the database and override the code copy.`}
          </p>
          <div className="mt-4">
            <SeedForm />
          </div>
        </div>
      </section>

      <Checklist items={checklist} />
    </div>
  );
}

function Checklist({ items }: { items: ReturnType<typeof launchChecklist> }) {
  const outstanding = items.filter((i) => i.status !== "done").length;
  return (
    <section aria-labelledby="launch-h" className="rounded-xl border border-line bg-surface p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="launch-h" className="display-3">
          Launch checklist
        </h2>
        <p className="text-sm text-muted">
          {outstanding} of {items.length} need attention
        </p>
      </div>
      <ul className="mt-6 divide-y divide-line">
        {items.map((i) => (
          <li key={i.label} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:gap-6">
            <span className="w-28 shrink-0">
              {i.status === "done" ? <Badge tone="success">Done</Badge> : i.status === "manual" ? <Badge>Manual check</Badge> : <Badge tone="warn">Outstanding</Badge>}
            </span>
            <span>
              <span className="block text-sm font-medium">{i.label}</span>
              <span className="mt-0.5 block text-sm text-muted">{i.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
