import Link from "next/link";
import { Fragment } from "react";
import { papers, type Paper } from "@/content/research";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// Papers as documents in a file: meta on the left, the document on the right.
export function Research({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const r = dict.research;
  return (
    <div>
      {papers.map((paper) => (
        <PaperRow key={paper.slug} paper={paper} lang={lang} dict={dict} />
      ))}
      <div className="grid gap-x-10 gap-y-2 py-8 sm:grid-cols-[10rem_minmax(0,1fr)]">
        <p className="text-sm font-semibold">{r.educationLabel}</p>
        <div>
          <p className="text-xl font-bold tracking-[-0.01em]">{r.degree}</p>
          <p className="mt-1 text-ink-2">{r.school}</p>
          <p className="mt-1 text-sm text-ink-3 tabular-nums">{r.graduated}</p>
          <p className="mt-3 text-sm text-ink-2">{r.languages}</p>
        </div>
      </div>
    </div>
  );
}

function PaperRow({ paper, lang, dict }: { paper: Paper; lang: Locale; dict: Dictionary }) {
  const r = dict.research;
  const year = paper.venue.match(/(20\d\d)/)?.[1];
  const headline = paper.stats[0];
  return (
    <article className="grid gap-x-10 gap-y-3 border-b border-hair py-8 first:pt-0 sm:grid-cols-[10rem_minmax(0,1fr)]">
      <div className="space-y-1 text-sm">
        <p className="font-semibold">{paper.kind === "journal" ? r.publicationLabel : r.conferenceLabel}</p>
        {year && <p className="font-mono text-ink-3">{year}</p>}
        {paper.award && (
          <p className="mt-2 inline-block -rotate-[4deg] border-2 border-scan px-2 py-0.5 text-xs font-semibold text-scan">
            {paper.award[lang]}
          </p>
        )}
      </div>
      <div className="min-w-0">
        <h3 lang="en" className="max-w-3xl text-xl font-bold leading-snug tracking-[-0.01em] text-balance sm:text-2xl">
          <Link href={localePath(lang, `/research/${paper.slug}`)} className="hover:text-scan">
            {paper.title}
          </Link>
        </h3>
        <p lang="en" className="mt-2 text-sm text-ink-3">
          {paper.authors.map((a, i) => (
            <Fragment key={a}>
              {i > 0 && ", "}
              {a === paper.me ? <span className="font-semibold text-ink">{a}</span> : a}
            </Fragment>
          ))}
          <span className="italic"> · {paper.venue}</span>
        </p>
        <p className="mt-4 text-base text-ink-2">
          <span className="font-mono font-semibold text-ink">
            {headline.prefix}
            {headline.value.toFixed(headline.decimals ?? 0)}
            {headline.suffix}
          </span>{" "}
          {headline.label[lang]}
        </p>
        <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          <Link href={localePath(lang, `/research/${paper.slug}`)} className="link">
            {r.previewPaper} →
          </Link>
          {paper.articleUrl && (
            <a href={paper.articleUrl} target="_blank" rel="noreferrer" className="text-ink-2 hover:text-ink">
              {r.readPaper} ↗
            </a>
          )}
        </p>
      </div>
    </article>
  );
}
