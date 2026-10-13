"use client";

import { useEffect, useState } from "react";
import type { FrameName } from "./mascot-sprite";
import { Sprite } from "./sprite";

/**
 * The mascot standing next to the label in the hero: blinks now and then, waves when you
 * point at it. Below the hero the small one at the bottom of the screen takes over.
 */
export function HeroMascot({ label }: { label: string }) {
  const [frame, setFrame] = useState<FrameName>("idle");
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tick = 0;
    const clock = setInterval(() => {
      tick++;
      if (hover) setFrame(tick % 4 < 3 ? "wave" : "idle");
      else setFrame(tick % 22 === 0 || tick % 22 === 2 ? "blink" : "idle");
    }, 125);
    return () => clearInterval(clock);
  }, [hover]);

  return (
    <figure
      className="relative w-fit"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Sprite frame={frame} className="w-[208px] drop-shadow-[0_0_16px_rgb(60_240_208/0.3)] xl:w-[240px]" />
      {/* the shadow it stands on */}
      <span aria-hidden className="mx-auto mt-1 block h-2 w-3/4 bg-ink/15" />
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
