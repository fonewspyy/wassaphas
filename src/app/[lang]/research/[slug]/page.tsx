import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang as rootLang } from "next/root-params";
import { Fragment, Suspense } from "react";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@/components/icons";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { PdfViewer } from "@/components/pdf-viewer";
import { ResultsChart } from "@/components/results-chart";
import { Skeleton } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPaper, papers, type Paper } from "@/content/research";
import { LOCALES, isLocale, localePath, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";

type Props = PageProps<"/[lang]/research/[slug]">;

// Papers are a fixed list in the repo, so every page is static.
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => papers.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const paper = getPaper(slug);
  if (!isLocale(lang) || !paper) return {};
  return {
    title: paper.title,
    description: paper.summary[lang],
    alternates: {
      canonical: localePath(lang, `/research/${slug}`),
      languages: { th: `/research/${slug}`, en: `/en/research/${slug}` },
    },
  };
}

// The frame (header, back link, footer) only needs the locale, a root param known at build
// time. Everything that depends on the slug sits behind Suspense so client navigations
// can show the frame instantly.
export default async function PaperPage({ params }: Props) {
  const lang = await rootLang();
  if (!lang || !isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <SiteHeader lang={lang} dict={dict} />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <Link href={`${localePath(lang, "/")}#research`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
          <ArrowLeftIcon width={14} height={14} /> {dict.research.viewer.back}
        </Link>
        <Suspense fallback={<PaperSkeleton />}>
          <PaperContent params={params} lang={lang} dict={dict} />
        </Suspense>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}

async function PaperContent({ params, lang, dict }: { params: Props["params"]; lang: Locale; dict: Dictionary }) {
  const paper = getPaper((await params).slug);
  if (!paper) notFound();
  const r = dict.research;

  return (
    <>
        <header className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
              {paper.kind === "journal" ? r.publicationLabel : r.conferenceLabel}
              {paper.award && (
                <span className="rounded-full bg-accent-soft px-2 py-0.5 normal-case tracking-normal">★ {paper.award[lang]}</span>
              )}
            </p>
            <h1 lang="en" className="mt-3 max-w-4xl text-2xl font-semibold leading-tight tracking-tight text-balance sm:text-3xl">
              {paper.title}
            </h1>
            <Authors paper={paper} />
            <p lang="en" className="mt-1 text-sm italic text-muted">
              {paper.venue}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-pretty sm:text-base">{paper.summary[lang]}</p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <a href={paper.pdf.path} download className="rounded-full bg-text px-4 py-2 text-sm font-medium text-bg hover:opacity-85">
              {r.viewer.download}
            </a>
            {paper.doiUrl && (
              <a
                href={paper.doiUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-text/30"
              >
                DOI <ArrowUpRightIcon width={14} height={14} />
              </a>
            )}
          </div>
        </header>

        <section aria-labelledby="results-title" className="mt-14">
          <h2 id="results-title" className="font-mono text-xs uppercase tracking-widest text-muted">
            {r.resultsTitle}
          </h2>
          <Reveal className="mt-5 grid gap-4 sm:grid-cols-3" stagger={0.06} y={16}>
            {paper.stats.map((s) => (
              <div key={s.label.en} className="rounded-2xl border border-border bg-surface p-5">
                <CountUp
                  value={s.value}
                  decimals={s.decimals}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  className="block text-3xl font-semibold tracking-tight"
                />
                <p className="mt-2 text-sm leading-snug text-muted text-pretty">{s.label[lang]}</p>
              </div>
            ))}
          </Reveal>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <ResultsChart data={paper.comparison} lang={lang} tableLabel={r.tableView} />
            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <p className="font-semibold tracking-tight">{r.findingsTitle}</p>
              <ul className="mt-4 space-y-4">
                {paper.findings.map((f) => (
                  <li key={f.en} className="relative pl-4 text-sm leading-relaxed text-pretty">
                    <span aria-hidden className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-accent" />
                    {f[lang]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <PdfViewer src={paper.pdf.path} copy={r.viewer} journalUrl={paper.articleUrl} />
        </section>

        <p className="mt-6 text-xs text-muted">
          {paper.pdf.credit[lang]}{" "}
          {paper.pdf.licenseUrl && (
            <a href={paper.pdf.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
              CC BY-NC 4.0
            </a>
          )}
        </p>
    </>
  );
}

function PaperSkeleton() {
  return (
    <div className="mt-8 space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-24" />
      <Skeleton className="h-64" />
    </div>
  );
}


function Authors({ paper }: { paper: Paper }) {
  return (
    <p lang="en" className="mt-3 text-sm text-muted">
      {paper.authors.map((a, i) => (
        <Fragment key={a}>
          {i > 0 && ", "}
          {a === paper.me ? <strong className="font-semibold text-text">{a}</strong> : a}
        </Fragment>
      ))}
    </p>
  );
}
