"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";

type HelpItem = { tab: string; title: string; body: string; points: string[] };

// One panel at a time, picked by the reader's own team, so the section reads as an answer
// to "what can he do for us" instead of three dense columns. Arrow keys follow the ARIA
// tabs pattern; every panel is in the HTML, only hidden, so nothing is lost without JS.
export function HelpTabs({ items, label }: { items: HelpItem[]; label: string }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = items.length - 1;
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <p className="text-sm text-ink-3">{label}</p>
      <div role="tablist" aria-label={label} className="mt-3 flex flex-wrap gap-2">
        {items.map((item, i) => {
          const selected = i === active;
          return (
            <button
              key={item.tab}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(event) => onKeyDown(event, i)}
              className={`border-2 border-rule px-3 py-1.5 text-sm font-semibold transition-colors ${
                selected ? "bg-ink text-label" : "hover:bg-ink hover:text-label"
              }`}
            >
              {item.tab}
            </button>
          );
        })}
      </div>

      {items.map((item, i) => (
        <div
          key={item.tab}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={i !== active}
          tabIndex={0}
          className="mt-7 max-w-3xl motion-safe:animate-[help-in_220ms_ease-out]"
        >
          <h3 className="text-xl font-bold leading-snug tracking-[-0.01em] text-balance sm:text-2xl">{item.title}</h3>
          <p className="mt-3 text-lg leading-relaxed text-ink-2 text-pretty">{item.body}</p>
          <ul className="mt-5 space-y-3">
            {item.points.map((point) => (
              <li key={point} className="grid grid-cols-[1.5rem_minmax(0,1fr)] leading-relaxed text-ink-2">
                <span aria-hidden className="font-mono text-scan">→</span>
                <span className="text-pretty">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
