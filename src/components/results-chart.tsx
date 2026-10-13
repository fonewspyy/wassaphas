import type { Comparison } from "@/content/research";
import type { Locale } from "@/i18n/config";

// Dumbbell chart: one row per class, baseline dot → proposed dot on a shared DSC axis.
// Before/after of the same measure = one hue, two shades (validated: #4fbf7a / #0b6b39 on white,
// CVD ΔE 25.8). The light shade is under 3:1 contrast, so every row also carries its numbers
// and a table view sits underneath.
const BEFORE = "#4fbf7a";
const AFTER = "#0b6b39";
const MIN = 60;
const MAX = 100;
const TICKS = [60, 70, 80, 90, 100];

const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100;
const fmt = (v: number) => v.toFixed(2);
const delta = (r: { baseline: number; proposed: number }) => {
  const d = r.proposed - r.baseline;
  return `${d >= 0 ? "+" : "−"}${Math.abs(d).toFixed(2)}`;
};

export function ResultsChart({ data, lang, tableLabel }: { data: Comparison; lang: Locale; tableLabel: string }) {
  const baselineLabel = data.baselineLabel[lang];
  const proposedLabel = data.proposedLabel[lang];

  return (
    <figure className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <figcaption>
        <p className="font-semibold tracking-tight text-pretty">{data.title[lang]}</p>
        <p className="mt-1 text-xs text-muted">{data.note[lang]}</p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
          <li className="inline-flex items-center gap-2">
            <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: BEFORE }} />
            {baselineLabel}
          </li>
          <li className="inline-flex items-center gap-2">
            <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: AFTER }} />
            {proposedLabel}
          </li>
        </ul>
      </figcaption>

      <div className="mt-6" role="img" aria-label={`${data.title[lang]}. ${data.rows.map((r) => `${r.label} ${fmt(r.baseline)} → ${fmt(r.proposed)}`).join(", ")}`}>
        {/* Axis header aligned with the plot column */}
        <div className="grid grid-cols-[2.75rem_1fr_3.5rem] gap-3 text-[10px] text-muted sm:grid-cols-[3.5rem_1fr_4rem]">
          <span className="font-mono">DSC %</span>
          <div className="relative h-4">
            {TICKS.map((t) => (
              <span key={t} className="absolute -translate-x-1/2 font-mono tabular-nums" style={{ left: `${pct(t)}%` }}>
                {t}
              </span>
            ))}
          </div>
          <span className="text-right font-mono">Δ</span>
        </div>

        <ul className="mt-1">
          {data.rows.map((r) => {
            const lo = Math.min(r.baseline, r.proposed);
            const hi = Math.max(r.baseline, r.proposed);
            const isAvg = r.label === "AVG";
            return (
              <li
                key={r.label}
                tabIndex={0}
                className={`group relative grid grid-cols-[2.75rem_1fr_3.5rem] items-center gap-3 rounded-md py-2 outline-none hover:bg-surface-2 focus-visible:bg-surface-2 sm:grid-cols-[3.5rem_1fr_4rem] ${isAvg ? "mt-1 border-t border-border pt-3" : ""}`}
              >
                <span className={`pl-1 font-mono text-xs ${isAvg ? "font-semibold" : ""}`}>{r.label}</span>
                <div className="relative h-4">
                  {/* recessive gridlines */}
                  {TICKS.map((t) => (
                    <span key={t} aria-hidden className="absolute top-0 h-full w-px bg-border/60" style={{ left: `${pct(t)}%` }} />
                  ))}
                  <span
                    aria-hidden
                    className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-border"
                    style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }}
                  />
                  <span
                    aria-hidden
                    className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface"
                    style={{ left: `${pct(r.baseline)}%`, background: BEFORE }}
                  />
                  <span
                    aria-hidden
                    className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface"
                    style={{ left: `${pct(r.proposed)}%`, background: AFTER }}
                  />
                  {/* hover / focus tooltip */}
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-2.5 py-1.5 font-mono text-[11px] shadow-md group-hover:block group-focus-visible:block"
                    style={{ left: `${(pct(lo) + pct(hi)) / 2}%` }}
                  >
                    {r.label}: {fmt(r.baseline)} → {fmt(r.proposed)} ({delta(r)})
                  </span>
                </div>
                <span
                  className={`text-right font-mono text-xs tabular-nums ${r.proposed >= r.baseline ? "text-text" : "text-muted"} ${isAvg ? "font-semibold" : ""}`}
                >
                  {delta(r)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <details className="mt-5 text-xs">
        <summary className="cursor-pointer text-muted hover:text-text">{tableLabel}</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[20rem] text-left font-mono tabular-nums">
            <thead className="text-muted">
              <tr className="border-b border-border">
                <th className="py-1.5 pr-3 font-normal">Class</th>
                <th className="py-1.5 pr-3 font-normal">{baselineLabel}</th>
                <th className="py-1.5 pr-3 font-normal">{proposedLabel}</th>
                <th className="py-1.5 font-normal">Δ</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => (
                <tr key={r.label} className="border-b border-border/60 last:border-0">
                  <td className="py-1.5 pr-3">{r.label}</td>
                  <td className="py-1.5 pr-3">{fmt(r.baseline)}</td>
                  <td className="py-1.5 pr-3">{fmt(r.proposed)}</td>
                  <td className="py-1.5">{delta(r)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
