"use client";

import { useRef } from "react";
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from "./gsap";

type Layer = { key: string; label: string; detail: string };

/**
 * The three layers I work across. A packet travels down as the request (FE → BE → DB)
 * and back up as the response, lighting each layer as it passes. Pauses off-screen.
 */
export function StackDiagram({ layers, caption }: { layers: Layer[]; caption: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const packet = root.current!.querySelector<HTMLElement>("[data-packet]")!;
        const boxes = gsap.utils.toArray<HTMLElement>("[data-layer]");
        const label = root.current!.querySelector<HTMLElement>("[data-status]")!;
        // Centre of each layer's badge, relative to the rail the packet rides on.
        const yOf = (i: number) => () => boxes[i].offsetTop + boxes[i].offsetHeight / 2 - packet.offsetHeight / 2;

        const light = { borderColor: "var(--accent)", backgroundColor: "var(--accent-soft)", duration: 0.25 };
        const dim = { borderColor: "var(--border)", backgroundColor: "var(--surface-2)", duration: 0.4 };

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8, defaults: { ease: "power2.inOut" } });
        tl.set(packet, { y: yOf(0), autoAlpha: 0 })
          .set(label, { textContent: "GET /projects" })
          .to(packet, { autoAlpha: 1, duration: 0.2 })
          .to(boxes[0], light, "<");
        for (let i = 1; i < boxes.length; i++) {
          tl.to(packet, { y: yOf(i), duration: 0.55 }).to(boxes[i - 1], dim, "<").to(boxes[i], light, ">-0.1");
        }
        tl.set(label, { textContent: "200 OK" }, "+=0.3");
        for (let i = boxes.length - 2; i >= 0; i--) {
          tl.to(packet, { y: yOf(i), duration: 0.45 }).to(boxes[i + 1], dim, "<").to(boxes[i], light, ">-0.1");
        }
        tl.to(boxes[0], dim, "+=0.3").to(packet, { autoAlpha: 0, duration: 0.2 }, "<");

        // Recompute positions after resizes; don't burn frames while scrolled away.
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
          onRefresh: () => tl.invalidate(),
        });
      });
    },
    { scope: root },
  );

  return (
    <figure ref={root} aria-label={layers.map((l) => l.label).join(", ")} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <figcaption className="mb-4 flex items-center justify-between font-mono text-xs text-muted">
        <span>{caption}</span>
        <span data-status aria-hidden className="text-accent" />
      </figcaption>
      <div className="relative">
        {/* Rail beside the layers; the packet rides it. */}
        <span aria-hidden className="absolute bottom-6 left-[0.3125rem] top-6 w-px border-l border-dashed border-border" />
        <span
          data-packet
          aria-hidden
          className="invisible absolute left-0 top-0 z-10 h-3 w-3 rounded-full bg-accent shadow-[0_0_0_4px_var(--accent-soft)] will-change-transform"
        />
        <ol className="space-y-3 pl-6">
          {layers.map((layer) => (
            <li
              key={layer.key}
              data-layer
              className="flex items-center gap-4 rounded-xl border border-border bg-surface-2 px-4 py-3"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface font-mono text-sm font-semibold text-accent">
                {layer.key}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{layer.label}</p>
                <p className="truncate text-xs text-muted">{layer.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
