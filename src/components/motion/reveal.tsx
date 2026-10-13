"use client";

import { useRef, type ReactNode } from "react";
import { MOTION_OK, gsap, useGSAP } from "./gsap";

/**
 * Fades its direct children up as they scroll into view, staggered.
 * Content is fully visible in the server HTML; GSAP only hides it once mounted and
 * below the fold, so there is nothing to see if JavaScript or motion is off.
 */
export function Reveal({
  children,
  className,
  stagger = 0.08,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = root.current?.children;
        if (!items?.length) return;
        gsap.from(items, {
          autoAlpha: 0,
          y,
          duration: 0.8,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
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
