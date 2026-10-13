import { getExperiences } from "@/lib/portfolio";
import { Skeleton } from "./section";

export async function Experience() {
  const items = await getExperiences();
  return (
    <ol className="relative space-y-8 border-l border-border pl-6">
      {items.map((e) => (
        <li key={e.id} className="relative">
          <span aria-hidden className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-bg" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-semibold">
              {e.title} <span className="font-normal text-muted">· {e.company}</span>
            </h3>
            <span className="font-mono text-xs text-muted">{e.period}</span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-pretty">{e.summary}</p>
        </li>
      ))}
    </ol>
  );
}

export function ExperienceSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
    </div>
  );
}
