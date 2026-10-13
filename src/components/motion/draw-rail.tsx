"use client";

import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "./gsap";

/**
 * Vertical line that draws itself as its parent scrolls through the viewport.
 * Place inside a `relative` container; the static track underneath shows when motion is off.
 */
export function DrawRail({ className = "left-0" }: { className?: string }) {
  const line = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: line.current?.parentElement,
            start: "top 70%",
            end: "bottom 70%",
            scrub: 0.5,
          },
        },
      );
    });
  });

  return (
    <div aria-hidden className={`pointer-events-none absolute top-0 bottom-0 w-px ${className}`}>
      <div className="absolute inset-0 bg-border" />
      <div ref={line} className="absolute inset-0 origin-top bg-accent motion-reduce:hidden" />
    </div>
  );
}
