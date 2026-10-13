import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang as rootLang } from "next/root-params";
import { Suspense } from "react";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@/components/icons";
import { Skeleton, Tag } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isLocale, localePath, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { getPublishedProject } from "@/lib/portfolio";

type Props = PageProps<"/[lang]/projects/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const project = await getPublishedProject(slug, lang);
  if (!project) return { title: getDictionary(lang).projects.notFoundTitle };
  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: localePath(lang, `/projects/${slug}`),
      languages: { th: `/projects/${slug}`, en: `/en/projects/${slug}` },
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  // Read only the locale here (known at build time). Awaiting `params` would also wait
  // for the slug, which is request-time data, and block the static shell.
  const lang = await rootLang();
  if (!lang || !isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <SiteHeader lang={lang} dict={dict} />
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link href={`${localePath(lang, "/")}#projects`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
          <ArrowLeftIcon width={14} height={14} /> {dict.projects.allProjects}
        </Link>
        <Suspense fallback={<DetailSkeleton />}>
          <ProjectDetail params={params} lang={lang} copy={dict.projects} />
        </Suspense>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}

async function ProjectDetail({
  params,
  lang,
  copy,
}: {
  params: Props["params"];
  lang: Locale;
  copy: Dictionary["projects"];
}) {
  const project = await getPublishedProject((await params).slug, lang);
  if (!project) notFound();

  return (
    <article className="mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{project.title}</h1>
        {project.year && <span className="font-mono text-sm text-muted">{project.year}</span>}
      </div>
      {project.role && <p className="mt-2 text-muted">{project.role}</p>}

      <p className="mt-6 text-lg leading-relaxed text-pretty">{project.summary}</p>
      {project.description && <p className="mt-4 leading-relaxed text-pretty text-muted">{project.description}</p>}

      {project.highlights.length > 0 && (
        <section className="mt-10">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent">{copy.highlights}</h2>
          <ul className="mt-4 space-y-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-2 leading-relaxed">
                <span aria-hidden className="text-accent">▸</span>
                {h}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-accent">{copy.stack}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li key={t}>
              <Tag>{t}</Tag>
            </li>
          ))}
        </ul>
      </section>

      {(project.liveUrl || project.repoUrl) && (
        <div className="mt-10 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-text hover:opacity-90">
              {copy.visitLive} <ArrowUpRightIcon />
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium hover:bg-surface-2">
              {copy.viewSource} <ArrowUpRightIcon />
            </a>
          )}
        </div>
      )}
      {!project.liveUrl && !project.repoUrl && <p className="mt-10 text-sm text-muted">{copy.privateSource}</p>}
    </article>
  );
}

function DetailSkeleton() {
  return (
    <div className="mt-8 space-y-4">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-24" />
      <Skeleton className="h-32" />
    </div>
  );
}
