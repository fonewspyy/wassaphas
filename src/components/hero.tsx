import { profile } from "@/content/profile";
import type { Dictionary } from "@/i18n/dictionaries";
import { ArrowRightIcon, FileIcon, GitHubIcon, MapPinIcon } from "./icons";

const LAYERS = [
  { key: "FE", detail: "React · Next.js · Tailwind" },
  { key: "BE", detail: "Node.js · NestJS · tRPC · FastAPI" },
  { key: "DB", detail: "MariaDB · PostgreSQL · SQL Server" },
] as const;

const secondaryButton =
  "inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-2";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="mx-auto grid max-w-5xl gap-12 px-4 pb-16 pt-16 sm:px-6 sm:pt-24 md:grid-cols-[1.4fr_1fr] md:items-center">
      <div>
        <p className="cursor font-mono text-sm text-accent">$ whoami</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{dict.profile.name}</h1>
        {/* Keep the English name visible on the Thai page: it's the one on the résumé. */}
        {dict.profile.name !== profile.name && (
          <p lang="en" className="mt-2 font-mono text-sm text-muted">{profile.name}</p>
        )}
        <p className="mt-3 text-lg font-medium text-muted">{dict.profile.role}</p>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-pretty">{dict.profile.tagline}</p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted">
          <MapPinIcon width={14} height={14} />
          {dict.profile.location}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-text transition-opacity hover:opacity-90"
          >
            {dict.hero.viewProjects} <ArrowRightIcon />
          </a>
          <a href="#contact" className={secondaryButton}>
            {dict.hero.contact}
          </a>
          <a href={profile.links.github} target="_blank" rel="noreferrer" className={secondaryButton}>
            <GitHubIcon /> GitHub
          </a>
          {profile.resumeUrl && (
            <a href={profile.resumeUrl} className={secondaryButton}>
              <FileIcon /> {dict.hero.resume}
            </a>
          )}
        </div>
      </div>

      {/* The three layers I work across, drawn as a request travelling down the stack. */}
      <figure aria-label="Frontend, Backend, Database" className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <figcaption className="mb-4 font-mono text-xs text-muted">{dict.hero.layersCaption}</figcaption>
        <ol className="space-y-2">
          {LAYERS.map((layer, i) => (
            <li key={layer.key}>
              <div className="flex items-center gap-4 rounded-xl border border-border bg-surface-2 px-4 py-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent-soft font-mono text-sm font-semibold text-accent">
                  {layer.key}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{dict.hero.layers[layer.key]}</p>
                  <p className="truncate text-xs text-muted">{layer.detail}</p>
                </div>
              </div>
              {i < LAYERS.length - 1 && <div aria-hidden className="ml-9 h-3 w-px bg-border" />}
            </li>
          ))}
        </ol>
      </figure>
    </section>
  );
}
