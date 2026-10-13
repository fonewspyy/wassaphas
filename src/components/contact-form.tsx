"use client";

import { useState, type FormEvent } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string; fieldErrors?: Record<string, string> };

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-accent";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus({ kind: "sending" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        form.reset();
        setStatus({ kind: "sent" });
        return;
      }
      setStatus({
        kind: "error",
        message: body.error ?? "Something went wrong. Please try again.",
        fieldErrors: body.fieldErrors,
      });
    } catch {
      setStatus({ kind: "error", message: "Network error. Please try again." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-accent/30 bg-accent-soft p-6">
        <p className="font-semibold">Thanks — your message is in.</p>
        <p className="mt-1 text-sm text-muted">I&apos;ll get back to you soon.</p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-4 text-sm font-medium text-accent"
        >
          Send another message
        </button>
      </div>
    );
  }

  const fieldErrors = status.kind === "error" ? status.fieldErrors ?? {} : {};

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" error={fieldErrors.name}>
          <input id="name" name="name" required maxLength={120} autoComplete="name" className={inputClass} />
        </Field>
        <Field label="Email" name="email" error={fieldErrors.email}>
          <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" className={inputClass} />
        </Field>
      </div>
      <Field label="Message" name="message" error={fieldErrors.message}>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder="A role you're hiring for, a project, or just hello."
          className={`${inputClass} resize-y`}
        />
      </Field>

      {/* Honeypot — hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {status.kind === "error" && Object.keys(fieldErrors).length === 0 && (
        <p role="alert" className="text-sm text-danger">
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-text transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status.kind === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
