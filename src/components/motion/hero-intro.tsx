"use client";

import { useRef, type ReactNode } from "react";
import { MOTION_OK, SplitText, gsap, useGSAP } from "./gsap";

/**
 * Opening sequence for the hero. Children marked [data-hero-item] start hidden by CSS
 * (only when <html> has the "motion" class, set by an inline script before paint) so the
 * first frame doesn't flash the final state. [data-hero-split] reveals line by line.
 */
export function HeroIntro({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-hero-item]");
        const heading = root.current!.querySelector<HTMLElement>("[data-hero-split]");
        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });

        tl.set(items, { autoAlpha: 1 });
        if (heading) {
          const split = SplitText.create(heading, { type: "lines", mask: "lines" });
          tl.from(split.lines, { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.12 }, 0);
        }
        tl.from(
          items.filter((el) => el !== heading),
          { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.07 },
          0.35,
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
