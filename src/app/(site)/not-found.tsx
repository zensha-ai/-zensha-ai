import { systemMessages } from "@/content/site";
import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="container-z grid min-h-[60vh] place-content-center py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="display-2 mt-6">Page not found.</h1>
      <p className="lede mx-auto mt-6 max-w-xl">{systemMessages.notFound}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Return Home</ButtonLink>
        <ButtonLink href="/contact" variant="secondary">
          Contact us
        </ButtonLink>
      </div>
    </section>
  );
}
