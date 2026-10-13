import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@/components/icons";
import { Skeleton, Tag } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedProject } from "@/lib/portfolio";

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = await getPublishedProject((await params).slug);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.summary };
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link href="/#projects" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
          <ArrowLeftIcon width={14} height={14} /> All projects
        </Link>
        <Suspense fallback={<DetailSkeleton />}>
          <ProjectDetail params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function ProjectDetail({ params }: { params: PageProps<"/projects/[slug]">["params"] }) {
  const project = await getPublishedProject((await params).slug);
  if (!project) notFound();

  return (
    <article className="mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{project.title}</h1>
        {project.year && <span className="font-mono text-sm text-muted">{project.year}</span>}
      </div>
      {project.role && <p className="mt-2 text-muted">{project.role}</p>}

      <p className="mt-6 text-lg leading-relaxed text-pretty">{project.summary}</p>
      {project.description && (
        <p className="mt-4 leading-relaxed text-pretty text-muted">{project.description}</p>
      )}

      {project.highlights.length > 0 && (
        <section className="mt-10">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent">Highlights</h2>
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
        <h2 className="font-mono text-xs uppercase tracking-widest text-accent">Stack</h2>
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
              Visit live site <ArrowUpRightIcon />
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium hover:bg-surface-2">
              View source <ArrowUpRightIcon />
            </a>
          )}
        </div>
      )}
      {!project.liveUrl && !project.repoUrl && (
        <p className="mt-10 text-sm text-muted">Source is private (client or company work). Happy to walk through it in an interview.</p>
      )}
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
