import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getPublishedProjects } from "@/lib/portfolio";
import type { Project } from "@/lib/types";
import { ArrowRightIcon, ArrowUpRightIcon } from "./icons";
import { Skeleton, Tag } from "./section";

type Copy = Dictionary["projects"];

export async function Projects({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const projects = await getPublishedProjects(lang);
  if (projects.length === 0) {
    return <p className="text-muted">{dict.projects.empty}</p>;
  }
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {featured.map((p, i) => (
          <ProjectCard key={p.id} project={p} lang={lang} copy={dict.projects} wide={i === 0 && featured.length % 2 === 1} />
        ))}
      </div>
      {others.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((p) => (
            <ProjectCard key={p.id} project={p} lang={lang} copy={dict.projects} compact />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project: p,
  lang,
  copy,
  wide = false,
  compact = false,
}: {
  project: Project;
  lang: Locale;
  copy: Copy;
  wide?: boolean;
  compact?: boolean;
}) {
  return (
    <article
      className={`group relative flex flex-col rounded-2xl border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-300 hover:border-text/25 hover:shadow-[0_12px_32px_-16px_rgb(0_0_0/0.18)] ${
        wide ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {p.featured && (
            <p className="mb-1 font-mono text-xs uppercase tracking-widest text-accent">{copy.featured}</p>
          )}
          <h3 className={`font-semibold tracking-tight ${compact ? "text-base" : "text-lg"}`}>
            <Link href={localePath(lang, `/projects/${p.slug}`)} className="after:absolute after:inset-0">
              {p.title}
            </Link>
          </h3>
        </div>
        {p.year && <span className="shrink-0 font-mono text-xs text-muted">{p.year}</span>}
      </div>
      {p.role && <p className="mt-1 text-xs text-muted">{p.role}</p>}
      <p className="mt-3 text-sm leading-relaxed text-pretty">{p.summary}</p>

      {!compact && p.highlights.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-sm text-muted">
          {p.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex gap-2">
              <span aria-hidden className="text-accent">▸</span>
              {h}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-5">
        <ul className="flex flex-wrap gap-1.5">
          {p.tech.slice(0, compact ? 4 : 7).map((t) => (
            <li key={t}>
              <Tag>{t}</Tag>
            </li>
          ))}
        </ul>
        <div className="relative z-10 mt-4 flex flex-wrap items-center gap-4 text-sm">
          <Link
            href={localePath(lang, `/projects/${p.slug}`)}
            className="inline-flex items-center gap-1 font-medium text-accent"
          >
            {copy.details} <ArrowRightIcon width={14} height={14} />
          </Link>
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted hover:text-text">
              {copy.live} <ArrowUpRightIcon width={14} height={14} />
            </a>
          )}
          {p.repoUrl && (
            <a href={p.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted hover:text-text">
              {copy.code} <ArrowUpRightIcon width={14} height={14} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProjectsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-64" />
      ))}
    </div>
  );
}
