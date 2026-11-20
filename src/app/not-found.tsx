import Link from "next/link";
import { brand } from "@/config/brand";
import { systemMessages } from "@/content/site";

export default function GlobalNotFound() {
  return (
    <main className="grid min-h-dvh place-content-center p-6 text-center">
      <p className="eyebrow">{brand.brandName} · 404</p>
      <h1 className="display-2 mt-6">Page not found.</h1>
      <p className="lede mx-auto mt-6 max-w-xl">{systemMessages.notFound}</p>
      <Link href="/" className="mx-auto mt-10 inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-paper">
        Return Home
      </Link>
    </main>
  );
}
