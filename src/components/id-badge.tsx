"use client";

import Image from "next/image";
import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "./motion/gsap";
import { Sprite } from "./sprite";

/**
 * A staff ID badge on a lanyard, the kind his warehouse users clip on every shift.
 * It hangs straight: a constant tilt or swing makes the browser resample the photo and the
 * text, which reads as blur. The rig settles once on load; the card tilts a little and its
 * laminate catches a glare only while the pointer is over it, then goes flat again with its
 * transform cleared. Every few seconds the card is read at a gate: a teal line sweeps down
 * the photo and a "scanned" chip comes up, the way the building access system he built at
 * Bangkok Medical Software reads an ID card.
 */
export function IdBadge({
  photo,
  name,
  role,
  idLabel,
  scanLabel,
  alt,
}: {
  photo: string;
  name: string;
  role: string;
  idLabel: string;
  scanLabel: string;
  alt: string;
}) {
  const scene = useRef<HTMLDivElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // the rig swings once as the page opens, then hangs still
        gsap.from(rig.current, { rotateZ: 3, duration: 2.4, ease: "elastic.out(1, 0.3)", delay: 0.5, clearProps: "transform" });

        // while the pointer is over the card it tilts a few degrees and the glare follows
        const el = card.current!;
        const rx = gsap.quickTo(el, "rotateX", { duration: 0.5, ease: "power3" });
        const ry = gsap.quickTo(el, "rotateY", { duration: 0.5, ease: "power3" });
        const gx = gsap.quickTo("[data-glare]", "xPercent", { duration: 0.6, ease: "power3" });
        const go = gsap.quickTo("[data-glare]", "opacity", { duration: 0.4, ease: "power2" });
        let settle: gsap.core.Tween | undefined;
        const onMove = (e: PointerEvent) => {
          settle?.kill();
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          ry(px * 10);
          rx(-py * 8);
          gx(-px * 50);
          go(1);
        };
        const onLeave = () => {
          rx(0);
          ry(0);
          go(0);
          // once flat, drop the transform so the card renders as a plain, sharp layer
          settle = gsap.delayedCall(0.6, () => gsap.set(el, { clearProps: "transform" }));
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);

        // read at the gate: the beam runs down the photo, then the chip confirms
        gsap
          .timeline({ repeat: -1, repeatDelay: 4.5, delay: 2.4 })
          .set("[data-scanbar]", { autoAlpha: 1, yPercent: -100, top: "0%" })
          .to("[data-scanbar]", { top: "100%", duration: 1.15, ease: "power1.inOut" })
          .to("[data-scanbar]", { autoAlpha: 0, duration: 0.2 })
          .fromTo("[data-scanchip]", { autoAlpha: 0, scale: 1.5 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2.4)" }, "-=0.15")
          .to("[data-scanchip]", { autoAlpha: 0, duration: 0.4 }, "+=1.6");

        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          settle?.kill();
        };
      });
    },
    { scope: scene },
  );

  return (
    <div ref={scene} className="relative mx-auto w-full max-w-[19rem] [perspective:1100px]">
      <div ref={rig} className="origin-top">
        {/* lanyard */}
        <div aria-hidden className="mx-auto h-16 w-3 bg-[repeating-linear-gradient(180deg,#151515_0_6px,#2c2c2c_6px_12px)]" />
        <div aria-hidden className="mx-auto -mt-1 h-4 w-10 border-2 border-rule bg-[#c9ccd1]" />

        <div
          ref={card}
          className="relative overflow-hidden border-2 border-rule bg-label shadow-[12px_24px_40px_-22px_rgb(0_0_0/0.5)]"
        >
          {/* punched slot */}
          <div aria-hidden className="mx-auto mt-3 h-2 w-14 rounded-full bg-bench ring-2 ring-rule" />
          <div className="relative mx-4 mt-3 aspect-[4/5] overflow-hidden border-2 border-rule bg-[#d9d9d6]">
            {/* served as is: a 600x750 JPEG at quality 90, sharper than a re-encode at the default 75 */}
            <Image src={photo} alt={alt} fill unoptimized className="object-cover object-top" priority />
            {/* gate scan: a teal line with a trailing glow, run by the timeline above */}
            <div
              data-scanbar
              aria-hidden
              className="invisible absolute inset-x-0 h-16 bg-[linear-gradient(to_bottom,transparent,rgb(60_240_208/0.28)_80%,rgb(60_240_208/0.9)_97%,#fff_100%)] shadow-[0_2px_14px_2px_rgb(60_240_208/0.6)]"
            />
            <span
              data-scanchip
              aria-hidden
              className="invisible absolute right-2 top-2 border-2 border-scan bg-label/95 px-1.5 py-0.5 text-[11px] font-semibold text-scan"
            >
              ✓ {scanLabel}
            </span>
          </div>
          <div className="flex items-end justify-between gap-3 px-4 pb-4 pt-3">
            <div className="min-w-0">
              <p className="text-[11px] text-ink-3">{idLabel}</p>
              <p className="text-xl font-bold leading-tight tracking-[-0.01em]">{name}</p>
              <p className="mt-0.5 text-sm text-ink-2">{role}</p>
            </div>
            {/* the mascot as the badge's company logo, kept inside the card */}
            <Sprite frame="wave" className="w-[44px] shrink-0 drop-shadow-[0_0_8px_rgb(60_240_208/0.35)]" />
          </div>
          {/* laminate glare, slid by the pointer */}
          <div
            data-glare
            aria-hidden
            className="pointer-events-none absolute -inset-y-4 -left-1/2 w-[200%] bg-[linear-gradient(110deg,transparent_40%,rgb(255_255_255/0.32)_48%,rgb(255_255_255/0.08)_53%,transparent_58%)] opacity-0 mix-blend-screen"
          />
        </div>
      </div>
    </div>
  );
}
