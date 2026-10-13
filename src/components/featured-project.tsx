import { featured } from "@/content/featured";
import { RatchetFigure } from "@/components/metrics";
import type { Locale } from "@/i18n/config";

// Shown as a parcel: a heavy-ruled box with the measured scale down one side, then the
// write-up as manifest rows underneath.
export function FeaturedProject({ lang, visitLabel }: { lang: Locale; visitLabel: string }) {
  return (
    <div>
      <article className="grid border-2 border-rule bg-label lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="p-6 sm:p-8">
          <p className="text-sm font-medium tabular-nums text-ink-3">{featured.since[lang]}</p>
          <h3 className="mt-2 text-5xl font-bold tracking-[-0.03em] sm:text-7xl">{featured.name}</h3>
          <p className="mt-4 max-w-xl text-xl font-medium leading-snug text-pretty">{featured.tagline[lang]}</p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-2 text-pretty">{featured.body[lang]}</p>
          <p className="mt-6 font-mono text-xs leading-relaxed text-ink-3">{featured.stack.join("  ·  ")}</p>
          <a
            href={featured.url}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-base font-semibold text-label transition-colors hover:bg-scan"
          >
            {visitLabel} kobnub.io <span aria-hidden>↗</span>
          </a>
        </div>
        <dl className="grid grid-cols-2 border-t-2 border-rule lg:grid-cols-1 lg:border-l-2 lg:border-t-0">
          {featured.scale.map((f, i) => (
            <div
              key={f.value}
              className={`p-5 sm:p-6 ${i % 2 === 1 ? "border-l-2 border-rule lg:border-l-0" : ""} ${i >= 2 ? "border-t-2 border-rule" : ""} ${i === 1 ? "lg:border-t-2" : ""}`}
            >
              <dt className="sr-only">{f.label[lang]}</dt>
              <dd>
                <span className="block font-mono text-3xl font-semibold tracking-tight">{f.value}</span>
                <span className="mt-1 block text-sm text-ink-2">{f.label[lang]}</span>
              </dd>
            </div>
          ))}
        </dl>
      </article>

      <div className="mt-4">
        {featured.sections.map((s) => (
          <div key={s.title.en} className="grid gap-x-10 gap-y-2 border-b border-hair py-7 sm:grid-cols-[10rem_minmax(0,1fr)]">
            <h4 className="font-semibold">{s.title[lang]}</h4>
            <div className="min-w-0">
              <p className="max-w-3xl text-[17px] leading-relaxed text-ink-2 text-pretty">{s.body[lang]}</p>
              {"figure" in s && s.figure && (
                <div className="mt-5">
                  <RatchetFigure lang={lang} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
