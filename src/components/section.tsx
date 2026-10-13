import type { ReactNode } from "react";
import { SplitHeading } from "./motion/split-heading";

export function Section({
  id,
  index,
  eyebrow,
  title,
  children,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid gap-x-10 gap-y-3 border-t border-border pt-6 md:grid-cols-[10rem_1fr]">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          <span className="text-accent">{index}</span> / {eyebrow}
        </p>
        <SplitHeading id={`${id}-title`} className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </SplitHeading>
      </div>
      <div className="mt-12">{children}</div>
    </section>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-xl bg-surface-2 ${className}`} />;
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-xs text-muted">
      {children}
    </span>
  );
}
