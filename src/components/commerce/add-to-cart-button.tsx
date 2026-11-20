"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { cart, useCart } from "@/lib/cart";
import { Button } from "@/components/ui";
import { claimFreeProject } from "@/app/(site)/student-projects/actions";
import type { DeliveryType } from "@/content/types";

export function AddToCartButton({
  projectId,
  slug,
  title,
  isFree,
  isExample,
  deliveryType,
  hasKit,
}: {
  projectId: string;
  slug: string;
  title: string;
  isFree: boolean;
  isExample: boolean;
  deliveryType: DeliveryType;
  hasKit: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const lines = useCart();
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();

  if (isExample) {
    return (
      <Button disabled aria-disabled className="w-full">
        Example listing — not for sale
      </Button>
    );
  }

  if (isFree) {
    return (
      <div className="grid gap-3">
        <Button
          className="w-full"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await claimFreeProject(projectId);
              if (r.ok) setMsg({ tone: "ok", text: "Added to My Downloads." });
              else if (r.reason === "auth") router.push(`/login?next=${encodeURIComponent(pathname)}`);
              else setMsg({ tone: "err", text: r.message });
            })
          }
        >
          {pending ? "Adding…" : "Download Free Version"}
        </Button>
        {msg && (
          <p role="status" className={msg.tone === "ok" ? "text-sm text-success" : "text-sm text-danger"}>
            {msg.text}{" "}
            {msg.tone === "ok" && (
              <Link href="/account/downloads" className="underline">
                Open My Downloads
              </Link>
            )}
          </p>
        )}
      </div>
    );
  }

  const offerDigital = deliveryType !== "physical_kit";
  const offerKit = deliveryType !== "digital" && hasKit;
  const inCart = (pkg: "digital" | "kit") => lines.some((l) => l.projectId === projectId && l.package === pkg);

  const add = (pkg: "digital" | "kit") => {
    cart.add({ projectId, slug, title, package: pkg });
    setMsg({ tone: "ok", text: pkg === "kit" ? "Physical kit added to cart." : "Digital package added to cart." });
  };

  return (
    <div className="grid gap-3">
      {offerDigital && (
        <Button className="w-full" onClick={() => add("digital")} disabled={inCart("digital")}>
          {inCart("digital") ? "Digital package in cart" : "Buy Project — digital download"}
        </Button>
      )}
      {offerKit && (
        <Button variant="secondary" className="w-full" onClick={() => add("kit")} disabled={inCart("kit")}>
          {inCart("kit") ? "Kit in cart" : "Add physical kit"}
        </Button>
      )}
      {!offerDigital && !offerKit && <p className="text-sm text-muted">Purchase options for this project are not available yet.</p>}
      {msg && (
        <p role="status" className="text-sm text-success">
          {msg.text}{" "}
          <Link href="/cart" className="underline">
            View cart
          </Link>
        </p>
      )}
    </div>
  );
}
