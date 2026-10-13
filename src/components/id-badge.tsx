"use client";

import Image from "next/image";
import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "./motion/gsap";
import { Sprite } from "./sprite";

/**
 * A staff ID badge on a lanyard, the kind his warehouse users clip on every shift.
 * The whole rig (strap, clip, card) swings from the top; the card tilts toward the pointer
 * and its laminate catches a moving glare. Every few seconds the card is read at a gate:
 * a teal line sweeps down the photo and a "scanned" chip comes up, the way the building
 * access system he built at Bangkok Medical Software reads an ID card.
 * Swing and tilt live on different elements so the two tweens never fight over one transform.
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
      gsap.set(card.current, { rotateY: -16, rotateX: 6 });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // idle swing of the whole rig on the lanyard
        gsap.fromTo(rig.current, { rotateZ: -1.4 }, { rotateZ: 1.4, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });

        // the card tilts toward the pointer; the glare slides the opposite way
        const rx = gsap.quickTo(card.current, "rotateX", { duration: 0.6, ease: "power3" });
        const ry = gsap.quickTo(card.current, "rotateY", { duration: 0.6, ease: "power3" });
        const gx = gsap.quickTo("[data-glare]", "xPercent", { duration: 0.8, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          const r = scene.current!.getBoundingClientRect();
          const px = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
          const py = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
          ry(-16 + px * 22);
          rx(6 - py * 14);
          gx(-px * 60);
        };
        window.addEventListener("pointermove", onMove, { passive: true });

        // read at the gate: the beam runs down the photo, then the chip confirms
        gsap
          .timeline({ repeat: -1, repeatDelay: 4.5, delay: 2.4 })
          .set("[data-scanbar]", { autoAlpha: 1, yPercent: -100, top: "0%" })
          .to("[data-scanbar]", { top: "100%", duration: 1.15, ease: "power1.inOut" })
          .to("[data-scanbar]", { autoAlpha: 0, duration: 0.2 })
          .fromTo("[data-scanchip]", { autoAlpha: 0, scale: 1.5 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2.4)" }, "-=0.15")
          .to("[data-scanchip]", { autoAlpha: 0, duration: 0.4 }, "+=1.6");

        return () => window.removeEventListener("pointermove", onMove);
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
          className="relative origin-top overflow-hidden border-2 border-rule bg-label shadow-[18px_28px_40px_-22px_rgb(0_0_0/0.55)] [transform-style:preserve-3d]"
          style={{ transform: "rotateY(-16deg) rotateX(6deg)" }}
        >
          {/* punched slot */}
          <div aria-hidden className="mx-auto mt-3 h-2 w-14 rounded-full bg-bench ring-2 ring-rule" />
          <div className="relative mx-4 mt-3 aspect-[4/5] overflow-hidden border-2 border-rule bg-[#d9d9d6]">
            <Image src={photo} alt={alt} fill sizes="280px" className="object-cover object-top" priority />
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
            className="pointer-events-none absolute -inset-y-4 -left-1/2 w-[200%] bg-[linear-gradient(110deg,transparent_38%,rgb(255_255_255/0.5)_47%,rgb(255_255_255/0.12)_53%,transparent_60%)] mix-blend-screen"
          />
        </div>
      </div>
    </div>
  );
}
