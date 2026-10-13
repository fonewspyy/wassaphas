"use client";

import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "./gsap";

/** A rubber-stamped status on a manifest row. Thunks down once when the row comes into view. */
export function Stamp({ text, tone }: { text: string; tone: "current" | "done" }) {
  const el = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(el.current, {
        scale: 1.8,
        rotate: -14,
        autoAlpha: 0,
        duration: 0.45,
        ease: "back.out(2.2)",
        scrollTrigger: { trigger: el.current, start: "top 85%", once: true },
      });
    });
  });

  return (
    <span
      ref={el}
      className={`inline-block -rotate-[5deg] whitespace-nowrap border-2 px-2.5 py-1 text-sm font-semibold tracking-wide ${
        tone === "current" ? "border-scan text-scan" : "border-ink text-ink"
      }`}
    >
      {text}
    </span>
  );
}
