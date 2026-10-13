"use client";

import { useRef } from "react";
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from "./gsap";

/**
 * Thin bar under the header that fills as the page scrolls. Rendered once per page, so it
 * also owns the page-wide refresh: database sections stream in after first paint and change
 * the page height, which ScrollTrigger doesn't notice on its own (it only watches resize).
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastHeight = document.documentElement.scrollHeight;
    const observer = new ResizeObserver(() => {
      const height = document.documentElement.scrollHeight;
      if (height === lastHeight) return;
      lastHeight = height;
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    observer.observe(document.body);

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
        },
      );
    });

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  });

  return (
    <div
      ref={bar}
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent motion-reduce:hidden"
    />
  );
}
