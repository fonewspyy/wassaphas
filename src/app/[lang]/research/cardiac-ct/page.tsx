import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang as rootLang } from "next/root-params";
import { Fragment } from "react";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@/components/icons";
import { PdfViewer } from "@/components/pdf-viewer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { publication } from "@/content/research";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await rootLang();
  if (!lang || !isLocale(lang)) return {};
  return {
    title: publication.title,
    description: getDictionary(lang).research.publicationNote,
    alternates: {
      canonical: localePath(lang, "/research/cardiac-ct"),
      languages: { th: "/research/cardiac-ct", en: "/en/research/cardiac-ct" },
    },
  };
}

export default async function PaperPage() {
  const lang = await rootLang();
  if (!lang || !isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const r = dict.research;

  return (
    <>
      <SiteHeader lang={lang} dict={dict} />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <Link href={`${localePath(lang, "/")}#research`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
          <ArrowLeftIcon width={14} height={14} /> {r.viewer.back}
        </Link>

        <header className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">{r.publicationLabel}</p>
            <h1 lang="en" className="mt-3 max-w-4xl text-2xl font-semibold leading-tight tracking-tight text-balance sm:text-3xl">
              {publication.title}
            </h1>
            <p lang="en" className="mt-3 text-sm text-muted">
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
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-pretty">{r.publicationNote}</p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <a
              href={publication.pdfPath}
              download
              className="rounded-full bg-text px-4 py-2 text-sm font-medium text-bg hover:opacity-85"
            >
              {r.viewer.download}
            </a>
            <a
              href={publication.doiUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-text/30"
            >
              DOI <ArrowUpRightIcon width={14} height={14} />
            </a>
          </div>
        </header>

        <div className="mt-10">
          <PdfViewer src={publication.pdfPath} copy={r.viewer} journalUrl={publication.articleUrl} />
        </div>

        <p className="mt-6 text-xs text-muted">
          {r.viewer.license}{" "}
          <a href={publication.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
            CC BY-NC 4.0
          </a>
        </p>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
