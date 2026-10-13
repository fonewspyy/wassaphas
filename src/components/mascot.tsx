"use client";

import { useRef, useState } from "react";
import type { FrameName } from "./mascot-sprite";
import { Sprite } from "./sprite";
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from "./motion/gsap";

/**
 * The mascot walks along the bottom of the screen as you scroll: its position is the read
 * progress. It walks while the page moves, turns around when you scroll back up, blinks
 * when you stop, and waves once you reach the end. With reduced motion it just stands in
 * the corner.
 */
export function Mascot() {
  const wrap = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<FrameName>("idle");
  const state = useRef({ moving: false, step: false, atEnd: false });

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const el = wrap.current!;
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power2.out" });
      let stopTimer: ReturnType<typeof setTimeout> | undefined;

      const travel = () => window.innerWidth - el.offsetWidth - 32;

      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          xTo(self.progress * travel());
          gsap.set(body.current, { scaleX: self.direction < 0 ? -1 : 1 });
          gsap.to(el, { autoAlpha: self.progress > 0.03 ? 1 : 0, duration: 0.3, overwrite: "auto" });
          state.current.atEnd = self.progress > 0.97;
          state.current.moving = true;
          clearTimeout(stopTimer);
          stopTimer = setTimeout(() => (state.current.moving = false), 180);
        },
      });

      // Animation clock at 8 fps: step while moving, otherwise idle / blink / wave.
      let tick = 0;
      const clock = setInterval(() => {
        tick++;
        const s = state.current;
        if (s.moving) {
          s.step = !s.step;
          setFrame(s.step ? "walkA" : "walkB");
        } else if (s.atEnd) {
          setFrame(tick % 16 < 12 ? "wave" : "idle");
        } else {
          setFrame(tick % 24 === 0 ? "blink" : "idle");
        }
      }, 125);

      return () => {
        st.kill();
        clearInterval(clock);
        clearTimeout(stopTimer);
      };
    });
  });

  return (
    <div
      ref={wrap}
      aria-hidden
      // Hidden until scrolling starts; with reduced motion it simply stands in the corner.
      className="pointer-events-none invisible fixed bottom-3 left-4 z-40 opacity-0 motion-reduce:visible motion-reduce:opacity-100"
    >
      <div ref={body} className="origin-center drop-shadow-[0_0_6px_rgb(60_240_208/0.35)]">
        <Sprite frame={frame} className="w-[56px] sm:w-[72px]" />
      </div>
    </div>
  );
}
