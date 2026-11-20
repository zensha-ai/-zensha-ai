"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { createUploadTarget, finalizeUpload } from "@/lib/admin/actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button, cx } from "@/components/ui";

const inputCls = "w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-sm";

/**
 * Two-step upload: the server validates the request and issues a one-time
 * signed upload URL for a server-generated path; the browser uploads straight
 * to Supabase Storage; the server then re-checks the stored object and records it.
 */
export function Uploader({ kind, projectId }: { kind: "project-file" | "media"; projectId?: string }) {
  const router = useRouter();
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ tone: "idle" | "busy" | "ok" | "error"; text: string }>({ tone: "idle", text: "" });

  const accept = kind === "project-file" ? ".zip,.pdf,.7z" : "image/png,image/jpeg,image/webp,image/avif,image/gif";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const file = fileRef.current?.files?.[0];
    if (!file) return setStatus({ tone: "error", text: "Choose a file first." });
    const fd = new FormData(form);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return setStatus({ tone: "error", text: "Supabase is not configured in this environment." });

    setStatus({ tone: "busy", text: "Requesting a secure upload slot…" });
    const target = await createUploadTarget({ kind, projectId, fileName: file.name, size: file.size });
    if (!target.ok) return setStatus({ tone: "error", text: target.message });

    setStatus({ tone: "busy", text: `Uploading ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)…` });
    const { error } = await supabase.storage.from(target.bucket).uploadToSignedUrl(target.path, target.token, file, {
      contentType: file.type || undefined,
      upsert: false,
    });
    if (error) return setStatus({ tone: "error", text: `Upload failed: ${error.message}` });

    setStatus({ tone: "busy", text: "Verifying the stored file…" });
    const result = await finalizeUpload({
      kind,
      path: target.path,
      projectId,
      label: String(fd.get("label") ?? ""),
      alt: String(fd.get("alt") ?? ""),
      isFreePreview: fd.get("is_free_preview") === "on",
    });
    setStatus({ tone: result.ok ? "ok" : "error", text: result.message });
    if (result.ok) {
      form.reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-xl border border-line bg-surface p-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <label htmlFor={`${id}-file`} className="mb-1.5 block text-sm font-medium">
          {kind === "project-file" ? "Protected file (.zip, .pdf, .7z — up to 500 MB)" : "Image (PNG, JPG, WebP, AVIF, GIF — up to 10 MB)"}
        </label>
        <input id={`${id}-file`} ref={fileRef} type="file" accept={accept} required className={cx(inputCls, "file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-1 file:text-paper")} />
      </div>
      {kind === "project-file" ? (
        <>
          <div>
            <label htmlFor={`${id}-label`} className="mb-1.5 block text-sm font-medium">
              Label shown to customers <span className="text-accent">*</span>
            </label>
            <input id={`${id}-label`} name="label" required maxLength={200} placeholder="Source code (ZIP)" className={inputCls} />
          </div>
          <label className="flex items-center gap-3 self-end pb-2 text-sm">
            <input type="checkbox" name="is_free_preview" className="size-4 accent-[var(--ink)]" />
            Free preview (any signed-in user may download)
          </label>
        </>
      ) : (
        <div className="md:col-span-2">
          <label htmlFor={`${id}-alt`} className="mb-1.5 block text-sm font-medium">
            Alt text (describe the image for screen readers)
          </label>
          <input id={`${id}-alt`} name="alt" maxLength={300} className={inputCls} />
        </div>
      )}
      <div className="flex items-center gap-4 md:col-span-2">
        <Button type="submit" disabled={status.tone === "busy"}>
          {status.tone === "busy" ? "Uploading…" : "Upload"}
        </Button>
        <p
          role={status.tone === "error" ? "alert" : "status"}
          className={cx("text-sm", status.tone === "error" ? "text-danger" : status.tone === "ok" ? "text-success" : "text-muted")}
        >
          {status.text}
        </p>
      </div>
    </form>
  );
}

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="rounded-full border border-line-strong px-3 py-1 text-xs hover:border-ink"
    >
      {copied ? "Copied" : "Copy URL"}
    </button>
  );
}
