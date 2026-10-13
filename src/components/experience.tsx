import type { Locale } from "@/i18n/config";
import { getExperiences } from "@/lib/portfolio";
import { DrawRail } from "./motion/draw-rail";
import { Reveal } from "./motion/reveal";
import { Skeleton } from "./section";

// Each role: company and period stick on the left while its highlights scroll on the right.
export async function Experience({ lang }: { lang: Locale }) {
  const items = await getExperiences(lang);
  return (
    <ol className="space-y-20">
      {items.map((e) => (
        <li key={e.id} className="relative grid gap-6 md:grid-cols-[14rem_1fr] md:gap-10">
          <div className="md:sticky md:top-24 md:self-start">
            <p className="font-mono text-xs text-muted">{e.period}</p>
            <p className="mt-2 text-lg font-semibold tracking-tight">{e.company}</p>
            <p className="mt-1 text-sm text-accent">{e.title}</p>
          </div>

          <div className="relative pl-6">
            <DrawRail />
            <p className="max-w-2xl text-base leading-relaxed text-pretty">{e.summary}</p>
            {e.highlights.length > 0 && (
              <Reveal className="mt-6 space-y-4" stagger={0.05} y={18}>
                {e.highlights.map((h) => (
                  <p key={h} className="relative max-w-2xl text-sm leading-relaxed text-muted text-pretty">
                    <span aria-hidden className="absolute -left-[1.6rem] top-[0.55em] h-1.5 w-1.5 rounded-full bg-accent" />
                    {h}
                  </p>
                ))}
              </Reveal>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ExperienceSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40" />
      <Skeleton className="h-28" />
    </div>
  );
}
