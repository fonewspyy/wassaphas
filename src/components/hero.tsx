import { profile } from "@/content/profile";
import { ArrowRightIcon, FileIcon, GitHubIcon, MapPinIcon } from "./icons";

const LAYERS = [
  { key: "FE", label: "Frontend", detail: "React · Next.js · Tailwind" },
  { key: "BE", label: "Backend", detail: "Node.js · tRPC · FastAPI" },
  { key: "DB", label: "Database", detail: "MariaDB · PostgreSQL · SQL Server" },
];

export function Hero() {
  return (
    <section className="mx-auto grid max-w-5xl gap-12 px-4 pb-16 pt-16 sm:px-6 sm:pt-24 md:grid-cols-[1.4fr_1fr] md:items-center">
      <div>
        <p className="cursor font-mono text-sm text-accent">$ whoami</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-3 text-lg font-medium text-muted">{profile.role}</p>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-pretty">{profile.tagline}</p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted">
          <MapPinIcon width={14} height={14} />
          {profile.location}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-text transition-opacity hover:opacity-90"
          >
            View projects <ArrowRightIcon />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-2"
          >
            Get in touch
          </a>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-2"
          >
            <GitHubIcon /> GitHub
          </a>
          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-2"
            >
              <FileIcon /> Résumé
            </a>
          )}
        </div>
      </div>

      {/* The three layers I work across, drawn as a request travelling down the stack. */}
      <figure aria-label="Full-stack layers" className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <figcaption className="mb-4 font-mono text-xs text-muted">request → response</figcaption>
        <ol className="space-y-2">
          {LAYERS.map((layer, i) => (
            <li key={layer.key}>
              <div className="flex items-center gap-4 rounded-xl border border-border bg-surface-2 px-4 py-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent-soft font-mono text-sm font-semibold text-accent">
                  {layer.key}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{layer.label}</p>
                  <p className="truncate text-xs text-muted">{layer.detail}</p>
                </div>
              </div>
              {i < LAYERS.length - 1 && (
                <div aria-hidden className="ml-9 h-3 w-px bg-border" />
              )}
            </li>
          ))}
        </ol>
      </figure>
    </section>
  );
}
