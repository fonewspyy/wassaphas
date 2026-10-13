import Link from "next/link";
import { Fragment } from "react";
import { papers, type Paper } from "@/content/research";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ArrowRightIcon, ArrowUpRightIcon } from "./icons";
import { Reveal } from "./motion/reveal";

export function Research({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const r = dict.research;
  return (
    <Reveal className="grid gap-4 lg:grid-cols-3">
      {papers.map((paper) => (
        <PaperCard key={paper.slug} paper={paper} lang={lang} dict={dict} />
      ))}
      <article className="rounded-2xl border border-border bg-surface p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">{r.educationLabel}</p>
        <h3 className="mt-3 font-semibold tracking-tight">{r.degree}</h3>
        <p className="mt-1 text-sm text-muted">{r.school}</p>
        <p className="mt-1 font-mono text-xs text-muted">{r.graduated}</p>
        <p className="mt-4 text-sm">{r.languages}</p>
      </article>
    </Reveal>
  );
}

function PaperCard({ paper, lang, dict }: { paper: Paper; lang: Locale; dict: Dictionary }) {
  const r = dict.research;
  const headline = paper.stats[0];
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-6">
      <p className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
        {paper.kind === "journal" ? r.publicationLabel : r.conferenceLabel}
        {paper.award && (
          <span className="rounded-full bg-accent-soft px-2 py-0.5 normal-case tracking-normal">★ {paper.award[lang]}</span>
        )}
      </p>
      <h3 lang="en" className="mt-3 font-semibold leading-snug tracking-tight text-balance">
        {paper.title}
      </h3>
      <p lang="en" className="mt-2 text-xs text-muted">
        {paper.authors.map((a, i) => (
          <Fragment key={a}>
            {i > 0 && ", "}
            {a === paper.me ? <strong className="font-semibold text-text">{a}</strong> : a}
          </Fragment>
        ))}
      </p>
      <p lang="en" className="mt-1 text-xs italic text-muted">
        {paper.venue}
      </p>
      <p className="mt-4 border-l-2 border-accent pl-3 text-sm">
        <span className="font-semibold tabular-nums">
          {headline.prefix}
          {headline.value.toFixed(headline.decimals ?? 0)}
          {headline.suffix}
        </span>{" "}
        <span className="text-muted">{headline.label[lang]}</span>
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6 text-sm font-medium">
        <Link
          href={localePath(lang, `/research/${paper.slug}`)}
          className="inline-flex items-center gap-2 rounded-full bg-text px-4 py-2 text-bg transition-opacity hover:opacity-85"
        >
          {r.previewPaper} <ArrowRightIcon width={14} height={14} />
        </Link>
        {paper.articleUrl && (
          <a href={paper.articleUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent">
            {r.readPaper} <ArrowUpRightIcon width={14} height={14} />
          </a>
        )}
      </div>
    </article>
  );
}
