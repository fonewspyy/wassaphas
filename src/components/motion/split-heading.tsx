"use client";

import { useRef, type ReactNode } from "react";
import { MOTION_OK, SplitText, gsap, useGSAP } from "./gsap";

/**
 * Heading whose lines slide up from behind a mask when it scrolls into view.
 * Splits by LINE only: splitting Thai into characters detaches vowels and tone marks
 * from their consonants, and Thai has no spaces for a word split to use.
 */
export function SplitHeading({
  as: Tag = "h2",
  id,
  className,
  children,
}: {
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        SplitText.create(root.current, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.1,
              scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
            });
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <Tag ref={root} id={id} className={className}>
      {children}
    </Tag>
  );
}
