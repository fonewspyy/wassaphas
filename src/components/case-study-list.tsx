"use client";

import Link from "next/link";
import { useState } from "react";
import type { CaseTag } from "@/content/case-studies";

export type CaseRowData = {
  slug: string;
  href: string;
  org: string;
  period: string;
  tags: CaseTag[];
  title: string;
  summary: string;
  stat: { value: string; label: string };
};

type Props = {
  rows: CaseRowData[];
  tagLabels: Record<CaseTag, string>;
  allLabel: string;
  filterLabel: string;
  readLabel: string;
};

// Case studies as rows, with chips to narrow them to the kind of work a reader cares about.
// Only tags that some study carries get a chip.
export function CaseStudyList({ rows, tagLabels, allLabel, filterLabel, readLabel }: Props) {
  const [tag, setTag] = useState<CaseTag | null>(null);
  const present = (Object.keys(tagLabels) as CaseTag[]).filter((t) => rows.some((r) => r.tags.includes(t)));
  const shown = tag ? rows.filter((r) => r.tags.includes(tag)) : rows;

  const chip = (selected: boolean) =>
    `border-2 border-rule px-3 py-1 text-sm font-semibold transition-colors ${
      selected ? "bg-ink text-label" : "hover:bg-ink hover:text-label"
    }`;

  return (
    <div>
      <div role="group" aria-label={filterLabel} className="mb-8 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-ink-3">{filterLabel}</span>
        <button type="button" aria-pressed={tag === null} onClick={() => setTag(null)} className={chip(tag === null)}>
          {allLabel}
        </button>
        {present.map((t) => (
          <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(t)} className={chip(tag === t)}>
            {tagLabels[t]}
          </button>
        ))}
      </div>

      <div key={tag ?? "all"} className="motion-safe:animate-[help-in_220ms_ease-out]">
        {shown.map((row) => (
          <CaseRow key={row.slug} row={row} tagLabels={tagLabels} readLabel={readLabel} />
        ))}
      </div>
    </div>
  );
}

function CaseRow({ row, tagLabels, readLabel }: { row: CaseRowData; tagLabels: Record<CaseTag, string>; readLabel: string }) {
  return (
    <article className="group grid gap-x-10 gap-y-3 border-b border-hair py-8 first:pt-0 sm:grid-cols-[10rem_minmax(0,1fr)]">
      <div className="space-y-1 text-sm">
        <p className="font-semibold">{row.org}</p>
        <p className="text-ink-3 tabular-nums">{row.period}</p>
        <p className="pt-1 font-mono text-xs text-ink-3">{row.tags.map((t) => tagLabels[t]).join(" · ")}</p>
      </div>
      <div className="min-w-0">
        <h3 className="max-w-3xl text-xl font-bold leading-snug tracking-[-0.01em] text-balance sm:text-2xl">
          <Link href={row.href} className="group-hover:text-scan">
            {row.title}
          </Link>
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-2 text-pretty">{row.summary}</p>
        <p className="mt-5 flex max-w-3xl flex-wrap items-baseline gap-x-3 gap-y-1 border-l-2 border-scan pl-4">
          <span className="font-mono text-2xl font-bold text-ink">{row.stat.value}</span>
          <span className="text-sm text-ink-2">{row.stat.label}</span>
        </p>
        <p className="mt-5 text-sm font-medium">
          <Link href={row.href} className="link">
            {readLabel} <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </p>
      </div>
    </article>
  );
}
