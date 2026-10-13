"use client";

import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from "./gsap";

// Page-wide scroll motion, kept in one place so the server components stay plain markup.
// Section headings print in left to right with their rule, as the hero label does; rows and
// cards rise into place in small batches; the hero's figures count up once the label has
// printed. Nothing is hidden ahead of time: an item only gets its starting state as it
// reaches the bottom edge of the screen, so content on screen at load never blinks out and
// streamed sections (experience, skills) are never touched before React hydrates them.

const HEADS = ["experience", "case-studies", "work", "skills", "research", "contact"]
  .map((id) => `#${id} > div:first-child`)
  .join(",");

const ITEMS = [
  "main section[aria-label] p", // about
  "#help > div > ul > li",
  "#experience > div:last-child > ol > li",
  "#case-studies > div:last-child", // the list filters itself, so it moves as one block
  "#work article",
  "#skills dl > div",
  "#research article",
  "#contact > div:last-child > *",
].join(",");

const FIGURES = "article[data-print] dd > span:first-child";

export function ScrollMotion() {
  useGSAP((_, contextSafe) => {
    if (!window.matchMedia(MOTION_OK).matches || !contextSafe) return;

    const seen = new WeakSet<Element>();
    const fresh = (selector: string) =>
      gsap.utils.toArray<HTMLElement>(selector).filter((el) => {
        if (seen.has(el)) return false;
        seen.add(el);
        return true;
      });
    const belowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;

    const scan = contextSafe(() => {
      for (const head of fresh(HEADS).filter(belowFold)) {
        gsap.fromTo(
          head,
          { clipPath: "inset(-40% 100% -40% 0)" },
          {
            clipPath: "inset(-40% 0% -40% 0)",
            duration: 0.8,
            ease: "steps(16)",
            clearProps: "clipPath",
            scrollTrigger: { trigger: head, start: "top 88%", once: true },
          },
        );
      }

      const items = fresh(ITEMS).filter(belowFold);
      if (items.length) {
        ScrollTrigger.batch(items, {
          start: "top bottom",
          once: true,
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { autoAlpha: 0, y: 28 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.08,
                overwrite: true,
                clearProps: "transform,opacity,visibility",
              },
            ),
        });
      }
      ScrollTrigger.refresh();
    });

    // Hero figures: "5.3M", "100+", "~9,500" count up; anything without a number is left alone.
    for (const el of fresh(FIGURES)) {
      // keep the real figure on the element: an effect re-run must not read a half-counted one
      el.dataset.figure ??= el.textContent ?? "";
      const target = parseFigure(el.dataset.figure);
      if (!target) continue;
      const counter = { v: 0 };
      el.textContent = target.format(0);
      gsap.to(counter, {
        v: target.value,
        duration: 1.5,
        delay: 1.1,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = target.format(counter.v);
        },
        onComplete: () => {
          el.textContent = target.text;
        },
      });
    }

    scan();
    let pending = 0;
    const observer = new MutationObserver(() => {
      window.clearTimeout(pending);
      pending = window.setTimeout(scan, 120);
    });
    const main = document.querySelector("main");
    if (main) observer.observe(main, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(pending);
      observer.disconnect();
      for (const el of document.querySelectorAll<HTMLElement>("[data-figure]")) el.textContent = el.dataset.figure ?? "";
    };
  });

  return null;
}

function parseFigure(text: string) {
  const m = text.trim().match(/^(\D*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const [, prefix, digits, suffix] = m;
  const decimals = digits.split(".")[1]?.length ?? 0;
  const grouped = digits.includes(",");
  const value = Number.parseFloat(digits.replace(/,/g, ""));
  const format = (v: number) =>
    prefix +
    (grouped
      ? v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : v.toFixed(decimals)) +
    suffix;
  return { value, format, text: text.trim() };
}
