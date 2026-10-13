import { featured } from "@/content/featured";
import type { Locale } from "@/i18n/config";

// Shown as a parcel: one heavy-ruled box.
export function FeaturedProject({ lang, visitLabel }: { lang: Locale; visitLabel: string }) {
  return (
    <div>
      <article className="border-2 border-rule bg-label">
        <div className="p-6 sm:p-8">
          <p className="text-sm font-medium tabular-nums text-ink-3">{featured.since[lang]}</p>
          <h3 className="mt-2 text-5xl font-bold tracking-[-0.03em] sm:text-7xl">{featured.name}</h3>
          <p className="mt-4 max-w-xl text-xl font-medium leading-snug text-pretty">{featured.tagline[lang]}</p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-2 text-pretty">{featured.body[lang]}</p>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-2 text-pretty">
            {featured.client.label[lang]}{" "}
            <a href={featured.client.url} target="_blank" rel="noreferrer" className="link font-semibold text-ink">
              {featured.client.name}
            </a>{" "}
            · {featured.client.note[lang]}
          </p>
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
      </article>
    </div>
  );
}
