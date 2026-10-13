import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang as rootLang } from "next/root-params";
import { Suspense } from "react";
import { caseTags } from "@/components/case-studies";
import { ArrowLeftIcon } from "@/components/icons";
import { OcrDemo } from "@/components/ocr-demo";
import { Skeleton, Tag } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { caseStudies, getCaseStudy } from "@/content/case-studies";
import { LOCALES, isLocale, localePath, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";

type Props = PageProps<"/[lang]/case-studies/[slug]">;

// Case studies are a fixed list in the repo, so every page is static.
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => caseStudies.map((c) => ({ lang, slug: c.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const study = getCaseStudy(slug);
  if (!isLocale(lang) || !study) return {};
  return {
    title: study.title[lang],
    description: study.summary[lang],
    alternates: {
      canonical: localePath(lang, `/case-studies/${slug}`),
      languages: { th: `/case-studies/${slug}`, en: `/en/case-studies/${slug}` },
    },
  };
}

// The frame only needs the locale (a root param known at build time); the slug-dependent
// body sits behind Suspense, as on the research pages.
export default async function CaseStudyPage({ params }: Props) {
  const lang = await rootLang();
  if (!lang || !isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <SiteHeader lang={lang} dict={dict} />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <Link href={`${localePath(lang, "/")}#case-studies`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
          <ArrowLeftIcon width={14} height={14} /> {dict.caseStudies.back}
        </Link>
        <Suspense fallback={<CaseSkeleton />}>
          <CaseContent params={params} lang={lang} dict={dict} />
        </Suspense>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}

async function CaseContent({ params, lang, dict }: { params: Props["params"]; lang: Locale; dict: Dictionary }) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();
  const c = dict.caseStudies;

  return (
    <article>
      <header className="mt-8">
        <p className="text-sm font-semibold">
          {study.org} <span className="font-normal text-ink-3">· {study.period[lang]}</span>
        </p>
        <p className="mt-1 font-mono text-xs text-ink-3">{caseTags(study, dict)}</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.02em] text-balance sm:text-4xl">{study.title[lang]}</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-2 text-pretty">{study.summary[lang]}</p>
        <p className="mt-3 text-sm text-ink-3">
          {c.roleLabel}: {study.role[lang]}
        </p>
      </header>

      {study.demo === "thai-id-ocr" && (
        <section aria-labelledby="demo-title" className="mt-12">
          <h2 id="demo-title" className="border-b-2 border-rule pb-3 text-2xl font-bold tracking-[-0.01em]">
            {c.demoTitle}
          </h2>
          <div className="mt-5">
            <OcrDemo lang={lang} />
          </div>
        </section>
      )}

      <section aria-labelledby="results-title" className="mt-12">
        <h2 id="results-title" className="border-b-2 border-rule pb-3 text-2xl font-bold tracking-[-0.01em]">
          {c.resultsTitle}
        </h2>
        <dl className={`mt-5 grid border-2 border-rule bg-label ${study.stats.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"}`}>
          {study.stats.map((s, i) => (
            <div key={s.label.en} className={`p-5 ${i > 0 ? "border-t-2 border-rule sm:border-l-2 sm:border-t-0" : ""}`}>
              <dt className="sr-only">{s.label[lang]}</dt>
              <dd>
                <span className="block font-mono text-3xl font-semibold tracking-tight">{s.value}</span>
                <span className="mt-2 block text-sm leading-snug text-ink-2 text-pretty">{s.label[lang]}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-muted">{study.statsNote[lang]}</p>
      </section>

      <section aria-labelledby="problem-title" className="mt-12">
        <h2 id="problem-title" className="border-b-2 border-rule pb-3 text-2xl font-bold tracking-[-0.01em]">
          {c.problemTitle}
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-pretty">{study.problem[lang]}</p>
      </section>

      <section aria-labelledby="decisions-title" className="mt-12">
        <h2 id="decisions-title" className="border-b-2 border-rule pb-3 text-2xl font-bold tracking-[-0.01em]">
          {c.decisionsTitle}
        </h2>
        <ol className="mt-2">
          {study.decisions.map((d, i) => (
            <li key={d.title.en} className="grid gap-x-6 gap-y-1 border-b border-hair py-6 sm:grid-cols-[3rem_minmax(0,1fr)]">
              <span aria-hidden className="font-mono text-sm text-ink-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-[-0.01em]">{d.title[lang]}</h3>
                <p className="mt-2 leading-relaxed text-ink-2 text-pretty">{d.body[lang]}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="tradeoff-title" className="mt-12 grid gap-4 sm:grid-cols-2">
        <div className="border-2 border-rule bg-label p-5 sm:p-6">
          <h2 id="tradeoff-title" className="font-semibold">
            {c.tradeoffTitle}
          </h2>
          <p className="mt-3 leading-relaxed text-ink-2 text-pretty">{study.tradeoff[lang]}</p>
        </div>
        <div className="border-2 border-rule bg-label p-5 sm:p-6">
          <h2 className="font-semibold">{c.lessonTitle}</h2>
          <p className="mt-3 leading-relaxed text-ink-2 text-pretty">{study.lesson[lang]}</p>
        </div>
      </section>

      <section aria-labelledby="stack-title" className="mt-12">
        <h2 id="stack-title" className="border-b-2 border-rule pb-3 text-2xl font-bold tracking-[-0.01em]">
          {c.stackTitle}
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {study.stack.map((t) => (
            <li key={t}>
              <Tag>{t}</Tag>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function CaseSkeleton() {
  return (
    <div className="mt-8 space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-24" />
      <Skeleton className="h-64" />
    </div>
  );
}
