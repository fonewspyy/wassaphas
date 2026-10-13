import { profile } from "@/content/profile";
import type { Dictionary } from "@/i18n/dictionaries";
import { ArrowRightIcon, FileIcon, GitHubIcon, MapPinIcon } from "./icons";
import { CountUp } from "./motion/count-up";
import { HeroIntro } from "./motion/hero-intro";
import { Reveal } from "./motion/reveal";
import { StackDiagram } from "./motion/stack-diagram";

const LAYER_DETAILS = {
  FE: "Next.js · React · Flutter",
  BE: ".NET · Node.js · NestJS",
  DB: "SQL Server · MariaDB · PostgreSQL",
} as const;

const secondaryButton =
  "inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:border-text/30";

export function Hero({ dict }: { dict: Dictionary }) {
  const layers = (Object.keys(LAYER_DETAILS) as (keyof typeof LAYER_DETAILS)[]).map((key) => ({
    key,
    label: dict.hero.layers[key],
    detail: LAYER_DETAILS[key],
  }));
  const showEnglishName = dict.profile.name !== profile.name;

  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-14 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.35fr_1fr] lg:items-center">
        <HeroIntro>
          <p data-hero-item className="cursor font-mono text-sm text-accent">
            $ whoami
          </p>
          <h1
            data-hero-item
            data-hero-split
            className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            {dict.profile.name}
          </h1>
          {/* Keep the English name visible on the Thai page: it's the one on the résumé. */}
          {showEnglishName && (
            <p data-hero-item lang="en" className="mt-3 font-mono text-sm text-muted">
              {profile.name}
            </p>
          )}
          <p data-hero-item className="mt-5 text-lg font-medium">
            {dict.profile.role}
          </p>
          <p data-hero-item className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty sm:text-lg">
            {dict.profile.tagline}
          </p>
          <p data-hero-item className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted">
            <MapPinIcon width={14} height={14} />
            {dict.profile.location}
          </p>
          <div data-hero-item className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-text px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-85"
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
        </HeroIntro>

        <StackDiagram layers={layers} caption={dict.hero.layersCaption} />
      </section>

      <ImpactStrip dict={dict} />
    </>
  );
}

function ImpactStrip({ dict }: { dict: Dictionary }) {
  return (
    <section aria-label={dict.sections.impact.title} className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">{dict.sections.impact.eyebrow}</p>
        <Reveal className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-5" stagger={0.06} y={16}>
          {dict.impact.map((stat) => (
            <div key={stat.label} className="border-l border-border pl-4">
              <CountUp
                value={stat.value}
                decimals={stat.decimals}
                prefix={stat.prefix}
                suffix={stat.suffix}
                className="block text-3xl font-semibold tracking-tight sm:text-4xl"
              />
              <p className="mt-2 text-sm leading-snug text-muted text-pretty">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
