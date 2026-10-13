"use client";

import Image from "next/image";
import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "./motion/gsap";
import { Sprite } from "./sprite";

/**
 * A staff ID badge on a lanyard, the kind his warehouse users clip on every shift.
 * Hangs in perspective, swings gently, and tilts toward the pointer. The photo is
 * pre-processed to black and white so it sits in the label palette.
 */
export function IdBadge({
  photo,
  name,
  role,
  idLabel,
  alt,
}: {
  photo: string;
  name: string;
  role: string;
  idLabel: string;
  alt: string;
}) {
  const scene = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // idle swing on the lanyard
        const swing = gsap.to(card.current, {
          rotateZ: 1.6,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        // tilt toward the pointer
        const rx = gsap.quickTo(card.current, "rotateX", { duration: 0.6, ease: "power3" });
        const ry = gsap.quickTo(card.current, "rotateY", { duration: 0.6, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          const r = scene.current!.getBoundingClientRect();
          const px = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
          const py = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
          ry(-16 + px * 22);
          rx(6 - py * 14);
        };
        window.addEventListener("pointermove", onMove);
        return () => {
          window.removeEventListener("pointermove", onMove);
          swing.kill();
        };
      });
    },
    { scope: scene },
  );

  return (
    <div ref={scene} className="relative mx-auto w-full max-w-[19rem] [perspective:1100px]">
      {/* lanyard */}
      <div aria-hidden className="mx-auto h-16 w-3 bg-[repeating-linear-gradient(180deg,#151515_0_6px,#2c2c2c_6px_12px)]" />
      <div aria-hidden className="mx-auto -mt-1 h-4 w-10 border-2 border-rule bg-[#c9ccd1]" />

      <div
        ref={card}
        className="relative origin-top border-2 border-rule bg-label shadow-[18px_28px_40px_-22px_rgb(0_0_0/0.55)] [transform-style:preserve-3d] [transform:rotateY(-16deg)_rotateX(6deg)]"
      >
        {/* punched slot */}
        <div aria-hidden className="mx-auto mt-3 h-2 w-14 rounded-full bg-bench ring-2 ring-rule" />
        <div className="relative mx-4 mt-3 aspect-[4/5] overflow-hidden border-2 border-rule bg-[#d9d9d6]">
          <Image src={photo} alt={alt} fill sizes="280px" className="object-cover object-top" priority />
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
      </div>
    </div>
  );
}
