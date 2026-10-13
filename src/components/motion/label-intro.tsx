"use client";

import { useRef, type ReactNode } from "react";
import { MOTION_OK, gsap, useGSAP } from "./gsap";

/**
 * The hero's one piece of choreography, taken from the work itself:
 * the label feeds out of a thermal printer line by line (stepped reveal), then a
 * scanner beam sweeps the barcode and the status flips to "scanned".
 *
 * The label starts clipped by CSS only when <html> has the "motion" class (set before
 * paint), so there's no flash; with reduced motion nothing is hidden or animated.
 */
export function LabelIntro({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const label = root.current!.querySelector<HTMLElement>("[data-print]");
        const beam = root.current!.querySelector<HTMLElement>("[data-beam]");
        const status = root.current!.querySelector<HTMLElement>("[data-status]");
        if (!label) return;

        const tl = gsap.timeline({ delay: 0.15 });
        tl.fromTo(
          label,
          { clipPath: "inset(0% 0% 100% 0%)", y: -10 },
          { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.1, ease: "steps(18)" },
        );
        if (beam) {
          tl.fromTo(beam, { left: "0%", autoAlpha: 1 }, { left: "100%", duration: 0.75, ease: "power1.inOut" }, "+=0.15");
          tl.to(beam, { autoAlpha: 0, duration: 0.15 });
        }
        if (status) {
          tl.fromTo(status, { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2.5)" }, "-=0.1");
        }
        tl.set(label, { clearProps: "clipPath,transform" });
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
