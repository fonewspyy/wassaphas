"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { ContactErrorCode, Dictionary } from "@/i18n/dictionaries";

type Copy = Dictionary["contact"];

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; code: ContactErrorCode; fieldErrors: Record<string, ContactErrorCode> };

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-accent";

export function ContactForm({ copy }: { copy: Copy }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const t = (code: string) => copy.errors[code as ContactErrorCode] ?? copy.errors.generic;

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
      setStatus({ kind: "error", code: body.error ?? "generic", fieldErrors: body.fieldErrors ?? {} });
    } catch {
      setStatus({ kind: "error", code: "network", fieldErrors: {} });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-accent/30 bg-accent-soft p-6">
        <p className="font-semibold">{copy.sentTitle}</p>
        <p className="mt-1 text-sm text-muted">{copy.sentBody}</p>
        <button type="button" onClick={() => setStatus({ kind: "idle" })} className="mt-4 text-sm font-medium text-accent">
          {copy.sendAnother}
        </button>
      </div>
    );
  }

  const fieldErrors = status.kind === "error" ? status.fieldErrors : {};
  const fieldError = (name: string) => (fieldErrors[name] ? t(fieldErrors[name]) : undefined);

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={copy.name} name="name" error={fieldError("name")}>
          <input id="name" name="name" required maxLength={120} autoComplete="name" className={inputClass} />
        </Field>
        <Field label={copy.email} name="email" error={fieldError("email")}>
          <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" className={inputClass} />
        </Field>
      </div>
      <Field label={copy.message} name="message" error={fieldError("message")}>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder={copy.placeholder}
          className={`${inputClass} resize-y`}
        />
      </Field>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {status.kind === "error" && Object.keys(fieldErrors).length === 0 && (
        <p role="alert" className="text-sm text-danger">
          {t(status.code)}
        </p>
      )}

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-text transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status.kind === "sending" ? copy.sending : copy.send}
      </button>
    </form>
  );
}

function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: ReactNode }) {
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
