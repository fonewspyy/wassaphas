"use client";

import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "./gsap";

function format(n: number, decimals: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/** Renders the final number on the server; counts up to it once in view. */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const root = useRef<HTMLSpanElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (value === 0) return; // nothing to count
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const counter = { n: 0 };
        gsap.to(counter, {
          n: value,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 90%", once: true },
          onUpdate: () => {
            if (num.current) num.current.textContent = format(counter.n, decimals);
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <span ref={root} className={`tabular-nums ${className ?? ""}`}>
      {prefix}
      <span ref={num}>{format(value, decimals)}</span>
      {suffix}
    </span>
  );
}
