import type { ReactNode } from "react";

// A manifest section: heavy rule, big plain title, and on the right a piece of real data
// about the section (a count, a date range) when there is one. No eyebrow labels.
export function Section({
  id,
  title,
  meta,
  children,
}: {
  id: string;
  title: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="flex items-end justify-between gap-6 border-b-2 border-rule pb-4">
        <h2 id={`${id}-title`} className="text-3xl font-bold tracking-[-0.02em] sm:text-5xl">
          {title}
        </h2>
        {meta && <p className="shrink-0 pb-1 font-mono text-sm text-ink-3">{meta}</p>}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse bg-hair/60 ${className}`} />;
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="border border-hair bg-label px-2 py-0.5 font-mono text-xs text-ink-2">{children}</span>;
}
