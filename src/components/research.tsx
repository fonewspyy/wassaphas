import { Fragment } from "react";
import { awardPaper, publication } from "@/content/research";
import type { Dictionary } from "@/i18n/dictionaries";
import { ArrowUpRightIcon } from "./icons";
import { Reveal } from "./motion/reveal";

export function Research({ dict }: { dict: Dictionary }) {
  const r = dict.research;
  return (
    <Reveal className="grid gap-4 md:grid-cols-3">
      <article className="flex flex-col rounded-2xl border border-border bg-surface p-6 md:col-span-2">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">{r.publicationLabel}</p>
        <h3 lang="en" className="mt-3 text-lg font-semibold leading-snug tracking-tight text-balance">
          {publication.title}
        </h3>
        <p lang="en" className="mt-2 text-sm text-muted">
          {publication.authors.map((a, i) => (
            <Fragment key={a}>
              {i > 0 && ", "}
              {a === publication.me ? <strong className="font-semibold text-text">{a}</strong> : a}
            </Fragment>
          ))}
        </p>
        <p lang="en" className="mt-1 text-sm italic text-muted">
          {publication.venue}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-pretty">{r.publicationNote}</p>
        <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-6 text-sm font-medium">
          <a href={publication.articleUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent">
            {r.readPaper} <ArrowUpRightIcon width={14} height={14} />
          </a>
          <a href={publication.doiUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-xs text-muted hover:text-text">
            {r.doi} 10.46604/peti.2026.15705
          </a>
        </div>
      </article>

      <div className="grid gap-4">
        <article className="rounded-2xl border border-border bg-surface p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">{r.awardLabel}</p>
          <h3 className="mt-3 font-semibold tracking-tight">{r.awardTitle}</h3>
          <p lang="en" className="mt-2 text-sm leading-snug">
            {awardPaper.title}
          </p>
          <p className="mt-2 text-xs text-muted">{r.awardNote}</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">{r.educationLabel}</p>
          <h3 className="mt-3 font-semibold tracking-tight">{r.degree}</h3>
          <p className="mt-1 text-sm text-muted">{r.school}</p>
          <p className="mt-1 font-mono text-xs text-muted">{r.graduated}</p>
          <p className="mt-4 text-sm">{r.languages}</p>
        </article>
      </div>
    </Reveal>
  );
}
