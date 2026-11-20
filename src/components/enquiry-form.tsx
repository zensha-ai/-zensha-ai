"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/(site)/contact/actions";
import { Field, FormMessage, Honeypot } from "@/components/forms";
import { Button } from "@/components/ui";
import { budgetOptions, timelineOptions } from "@/lib/validation/enquiry";

export function EnquiryForm({
  kind,
  serviceOptions = [],
  defaultService,
  defaultMessage,
}: {
  kind: "business" | "student_support";
  serviceOptions?: { value: string; label: string }[];
  defaultService?: string;
  defaultMessage?: string;
}) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, { status: "idle" });
  const [startedAt] = useState(() => String(Date.now()));

  if (state.status === "success") {
    return (
      <FormMessage tone="success">
        Thank you for reaching out. Your enquiry has been received. We will review the details and respond using the contact information provided.
      </FormMessage>
    );
  }

  const err = state.status === "error" ? state.fieldErrors ?? {} : {};
  const v = state.status === "error" ? state.values ?? {} : {};

  return (
    <form action={action} className="relative grid gap-6" noValidate>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="started_at" value={startedAt} />
      <Honeypot />
      {state.status === "error" && <FormMessage tone="error">{state.message}</FormMessage>}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name" name="name" required autoComplete="name" defaultValue={v.name} error={err.name} maxLength={120} />
        <Field label={kind === "business" ? "Work email" : "Email"} name="email" type="email" required autoComplete="email" defaultValue={v.email} error={err.email} />
      </div>

      {kind === "business" ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Phone / WhatsApp" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} error={err.phone} />
            <Field label="Company or organization" name="company" autoComplete="organization" defaultValue={v.company} error={err.company} />
          </div>
          <Field
            label="Service of interest"
            name="service"
            as="select"
            required
            options={[...serviceOptions, { value: "other", label: "Something else / not sure" }]}
            defaultValue={v.service ?? defaultService}
            error={err.service}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Project budget range" name="budget" as="select" options={budgetOptions.map((o) => ({ value: o, label: o }))} defaultValue={v.budget} />
            <Field label="Preferred timeline" name="timeline" as="select" options={timelineOptions.map((o) => ({ value: o, label: o }))} defaultValue={v.timeline} />
          </div>
          <Field
            label="Tell us about your project"
            name="message"
            as="textarea"
            required
            rows={6}
            maxLength={5000}
            defaultValue={v.message ?? defaultMessage}
            error={err.message}
            hint="Goals, users, current tools and anything you already know about scope."
          />
        </>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Project name" name="service" required defaultValue={v.service ?? defaultService} error={err.service} />
            <Field label="Order reference" name="order_reference" defaultValue={v.order_reference} error={err.order_reference} />
          </div>
          <Field
            label="Describe the problem"
            name="message"
            as="textarea"
            required
            rows={6}
            maxLength={5000}
            defaultValue={v.message}
            error={err.message}
            hint="Never submit passwords or payment card details."
          />
        </>
      )}

      <div>
        <label className="flex items-start gap-3 text-sm text-ink-2">
          <input type="checkbox" name="consent" required className="mt-1 size-4 accent-[var(--ink)]" aria-invalid={err.consent ? true : undefined} />
          <span>
            I have read the{" "}
            <Link href="/legal/privacy" className="underline underline-offset-4">
              Privacy Policy
            </Link>{" "}
            and agree to be contacted about this enquiry. <span className="text-accent">*</span>
          </span>
        </label>
        {err.consent && <p className="mt-1.5 text-sm text-danger">{err.consent}</p>}
      </div>

      <div>
        <Button type="submit" disabled={pending} aria-busy={pending}>
          {pending ? "Sending…" : kind === "business" ? "Send Enquiry" : "Get Project Support"}
        </Button>
      </div>
    </form>
  );
}
