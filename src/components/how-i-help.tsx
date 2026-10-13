import type { Dictionary } from "@/i18n/dictionaries";

// Three short notes right after About, one per kind of team, so a reader can find the part
// that fits them. Same ruled, two-column frame as the About block above it.
export function HowIHelp({ dict }: { dict: Dictionary }) {
  return (
    <section id="help" aria-labelledby="help-title" className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:px-6">
      <div className="grid gap-x-10 gap-y-6 border-t-2 border-rule pt-10 sm:grid-cols-[10rem_minmax(0,1fr)]">
        <h2 id="help-title" className="text-sm font-semibold">
          {dict.sections.help.title}
        </h2>
        <ul className="grid gap-x-8 gap-y-8 lg:grid-cols-3">
          {dict.help.map((item) => (
            <li key={item.title}>
              <h3 className="text-lg font-bold leading-snug tracking-[-0.01em] text-balance">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-2 text-pretty">{item.body}</p>
              <ul className="mt-4 space-y-2 border-l-2 border-rule pl-4 text-sm leading-relaxed text-ink-2">
                {item.points.map((point) => (
                  <li key={point} className="text-pretty">
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
