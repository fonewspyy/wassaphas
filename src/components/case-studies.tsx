import Link from "next/link";
import { caseStudies, type CaseStudy } from "@/content/case-studies";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// "Analysis · Engineering": the kind of work a study shows, so readers can pick theirs.
export function caseTags(study: CaseStudy, dict: Dictionary) {
  return study.tags.map((t) => dict.caseStudies.tags[t]).join(" · ");
}

// Case studies as rows: where and when on the left, the story's headline on the right.
export function CaseStudies({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <div>
      {caseStudies.map((c) => (
        <CaseRow key={c.slug} study={c} lang={lang} dict={dict} />
      ))}
    </div>
  );
}

function CaseRow({ study, lang, dict }: { study: CaseStudy; lang: Locale; dict: Dictionary }) {
  const href = localePath(lang, `/case-studies/${study.slug}`);
  const headline = study.stats[0];
  return (
    <article className="grid gap-x-10 gap-y-3 border-b border-hair py-8 first:pt-0 sm:grid-cols-[10rem_minmax(0,1fr)]">
      <div className="space-y-1 text-sm">
        <p className="font-semibold">{study.org}</p>
        <p className="text-ink-3 tabular-nums">{study.period[lang]}</p>
        <p className="pt-1 font-mono text-xs text-ink-3">{caseTags(study, dict)}</p>
      </div>
      <div className="min-w-0">
        <h3 className="max-w-3xl text-xl font-bold leading-snug tracking-[-0.01em] text-balance sm:text-2xl">
          <Link href={href} className="hover:text-scan">
            {study.title[lang]}
          </Link>
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-2 text-pretty">{study.summary[lang]}</p>
        <p className="mt-4 text-base text-ink-2">
          <span className="font-mono font-semibold text-ink">{headline.value}</span> {headline.label[lang]}
        </p>
        <p className="mt-5 text-sm font-medium">
          <Link href={href} className="link">
            {dict.caseStudies.read} →
          </Link>
        </p>
      </div>
    </article>
  );
}
