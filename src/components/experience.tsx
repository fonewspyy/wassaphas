import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getExperiences } from "@/lib/portfolio";
import { Stamp } from "./motion/stamp";
import { Skeleton } from "./section";

// Period text is free-form per language, so "current" is read from it.
const isCurrent = (period: string) => /present|ปัจจุบัน/i.test(period);

// A manifest: one row per role, period on the left, a stamped status on the right,
// and the line items underneath.
export async function Experience({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const items = await getExperiences(lang);
  return (
    <ol>
      {items.map((e) => (
        <li
          key={e.id}
          className="grid gap-x-10 gap-y-4 border-b border-hair py-10 first:pt-2 md:grid-cols-[10rem_minmax(0,1fr)_auto]"
        >
          <p className="text-sm font-medium text-ink-3 tabular-nums md:pt-2">{e.period}</p>

          <div className="min-w-0">
            <h3 className="text-2xl font-bold tracking-[-0.015em] sm:text-3xl">{e.company}</h3>
            <p className="mt-1 text-base font-medium text-ink-2">{e.title}</p>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty">{e.summary}</p>
            {e.highlights.length > 0 && (
              <ol className="mt-6 max-w-3xl space-y-4">
                {e.highlights.map((h, i) => (
                  <li key={h} className="grid grid-cols-[2rem_minmax(0,1fr)] text-[15px] leading-relaxed text-ink-2">
                    <span className="pt-px font-mono text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-pretty">{h}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="row-start-1 md:row-auto md:pt-2 md:text-right">
            {isCurrent(e.period) ? (
              <Stamp text={dict.status.current} tone="current" />
            ) : (
              <Stamp text={dict.status.done} tone="done" />
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
      <Skeleton className="h-48" />
      <Skeleton className="h-32" />
    </div>
  );
}
