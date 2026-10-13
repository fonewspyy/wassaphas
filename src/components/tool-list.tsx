import Link from "next/link";
import { tools } from "@/content/tools";
import { localePath, type Locale } from "@/i18n/config";

// Smaller entries under the featured project: same manifest-row layout as experience.
export function ToolList({ lang, title, detailLabel }: { lang: Locale; title: string; detailLabel: string }) {
  return (
    <div className="mt-14">
      <h3 className="border-b-2 border-rule pb-3 text-2xl font-bold tracking-[-0.01em]">{title}</h3>
      {tools.map((tool) => (
        <article key={tool.name} className="grid gap-x-10 gap-y-3 border-b border-hair py-8 md:grid-cols-[10rem_minmax(0,1fr)]">
          <div className="space-y-1 text-sm">
            <p className="font-medium tabular-nums text-ink-3">{tool.period[lang]}</p>
            <p className="text-ink-2">{tool.kind[lang]}</p>
          </div>
          <div className="min-w-0">
            <h4 className="text-2xl font-bold tracking-[-0.015em]">
              {tool.page ? (
                <Link href={localePath(lang, tool.page)} className="hover:text-scan">
                  {tool.name}
                </Link>
              ) : tool.url ? (
                <a href={tool.url} target="_blank" rel="noreferrer" className="hover:text-scan">
                  {tool.name} <span aria-hidden className="text-base">↗</span>
                </a>
              ) : (
                tool.name
              )}
            </h4>
            <p className="mt-3 max-w-3xl text-lg leading-relaxed text-pretty">{tool.summary[lang]}</p>
            {tool.points.length > 0 && (
              <ol className="mt-5 max-w-3xl space-y-4">
                {tool.points.map((p, i) => (
                  <li key={p.en} className="grid grid-cols-[2rem_minmax(0,1fr)] text-[15px] leading-relaxed text-ink-2">
                    <span className="pt-px font-mono text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-pretty">{p[lang]}</span>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-5 font-mono text-xs text-ink-3">{tool.facts}</p>
            {tool.page && (
              <Link
                href={localePath(lang, tool.page)}
                className="group mt-6 inline-flex items-center gap-2 border-2 border-rule px-4 py-2 text-sm font-semibold transition-colors hover:bg-ink hover:text-label"
              >
                {detailLabel}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
