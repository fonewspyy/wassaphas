import type { CSSProperties } from "react";
import { stackIcons } from "@/content/stack";

// The tools I use most, as a strip of marks under the hero card. Monochrome to match the
// label; each mark takes its brand colour on hover.
export function TechStack({ title }: { title: string }) {
  return (
    <div>
      <p className="text-xs text-ink-3">{title}</p>
      <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {stackIcons.map((icon) => (
          <li
            key={icon.name}
            className="group flex flex-col items-center gap-1.5 border-2 border-rule bg-label px-1 py-3"
            style={{ "--brand": icon.hex } as CSSProperties}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-7 w-7 fill-current text-ink transition-colors group-hover:text-[var(--brand)]"
            >
              <path d={icon.path} />
            </svg>
            <span className="text-center text-[11px] leading-tight text-ink-2">{icon.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
