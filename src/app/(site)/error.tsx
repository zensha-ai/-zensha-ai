"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="container-z grid min-h-[60vh] place-content-center py-24 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="display-2 mt-6">We couldn&rsquo;t load this page.</h1>
      <p className="lede mx-auto mt-6 max-w-xl">Please try again. If the problem continues, contact us and include the reference below.</p>
      {error.digest && <p className="mt-4 font-mono text-xs text-muted">Reference: {error.digest}</p>}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/" variant="secondary">
          Return Home
        </ButtonLink>
      </div>
    </section>
  );
}
