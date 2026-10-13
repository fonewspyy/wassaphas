"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import type { Project } from "@/lib/types";
import { saveProject } from "../actions";

const input =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent";

export function ProjectForm({ project }: { project?: Project }) {
  const [state, action, pending] = useActionState(
    saveProject.bind(null, project?.id ?? null),
    undefined,
  );

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title">
          <input name="title" required defaultValue={project?.title} className={input} />
        </Field>
        <Field label="Slug" hint="URL: /projects/your-slug">
          <input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={project?.slug} className={`${input} font-mono`} />
        </Field>
      </div>
      <p className="text-xs text-muted">
        Thai fields are optional. When one is empty, the Thai site shows the English text.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Summary (EN)" hint="One or two sentences for the card (max 300).">
          <textarea name="summary" required maxLength={300} rows={3} defaultValue={project?.summary} className={input} />
        </Field>
        <Field label="Summary (TH)">
          <textarea name="summaryTh" maxLength={400} rows={3} defaultValue={project?.summaryTh ?? ""} className={input} />
        </Field>
        <Field label="Description (EN)" hint="Longer write-up for the detail page.">
          <textarea name="description" rows={6} defaultValue={project?.description ?? ""} className={input} />
        </Field>
        <Field label="Description (TH)">
          <textarea name="descriptionTh" rows={6} defaultValue={project?.descriptionTh ?? ""} className={input} />
        </Field>
        <Field label="Your role (EN)">
          <input name="role" defaultValue={project?.role ?? ""} className={input} />
        </Field>
        <Field label="Your role (TH)">
          <input name="roleTh" defaultValue={project?.roleTh ?? ""} className={input} />
        </Field>
        <Field label="Highlights (EN)" hint="One per line.">
          <textarea name="highlights" rows={4} defaultValue={project?.highlights.join("\n")} className={input} />
        </Field>
        <Field label="Highlights (TH)" hint="One per line.">
          <textarea name="highlightsTh" rows={4} defaultValue={project?.highlightsTh?.join("\n") ?? ""} className={input} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
        <Field label="Tech" hint="Comma-separated.">
          <input name="tech" defaultValue={project?.tech.join(", ")} className={input} />
        </Field>
        <Field label="Year">
          <input name="year" inputMode="numeric" defaultValue={project?.year ?? ""} className={input} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Live URL">
          <input name="liveUrl" type="url" defaultValue={project?.liveUrl ?? ""} className={input} />
        </Field>
        <Field label="Repository URL">
          <input name="repoUrl" type="url" defaultValue={project?.repoUrl ?? ""} className={input} />
        </Field>
      </div>
      <div className="flex flex-wrap items-end gap-6">
        <Field label="Sort order" hint="Lower comes first.">
          <input name="sortOrder" type="number" defaultValue={project?.sortOrder ?? 100} className={`${input} w-28`} />
        </Field>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={project?.published ?? false} className="h-4 w-4 accent-[var(--accent)]" />
          Published
        </label>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} className="h-4 w-4 accent-[var(--accent)]" />
          Featured
        </label>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-text hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save project"}
        </button>
        <Link href="/admin" className="text-sm text-muted hover:text-text">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}
