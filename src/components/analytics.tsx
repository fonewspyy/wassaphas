"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Counts page views and clicks on links/buttons, posted to /api/track.
// Give any element data-track="name" to label it explicitly in the admin report.

type Event = {
  type: "pageview" | "click";
  path: string;
  target?: string;
  href?: string;
  referrer?: string;
  lang?: string;
};

function send(event: Event) {
  const body = JSON.stringify({ ...event, lang: document.documentElement.lang || undefined });
  // sendBeacon survives the page unloading, which matters for clicks on outbound links.
  if (!navigator.sendBeacon?.("/api/track", body)) {
    fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
  }
}

const clip = (s: string | null | undefined, max: number) =>
  s ? s.replace(/\s+/g, " ").trim().slice(0, max) || undefined : undefined;

function describe(el: HTMLElement): { target?: string; href?: string } {
  const target =
    clip(el.dataset.track, 200) ??
    clip(el.getAttribute("aria-label"), 200) ??
    clip(el.textContent, 80) ??
    clip(el.getAttribute("title"), 200);
  if (!(el instanceof HTMLAnchorElement) || !el.href) return { target };
  const url = new URL(el.href, location.href);
  // Same-site links are stored as a path, everything else (GitHub, mailto, PDFs elsewhere) in full.
  const href = url.origin === location.origin ? url.pathname + url.hash : url.href;
  return { target, href: href.slice(0, 300) };
}

let sentFirstPageview = false;

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // document.referrer stays the same across client-side navigations, so only the
    // first page of a visit reports it.
    const referrer = sentFirstPageview ? undefined : document.referrer || undefined;
    sentFirstPageview = true;
    send({ type: "pageview", path: location.pathname, referrer });
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest<HTMLElement>("a, button, [data-track]");
      if (!el) return;
      send({ type: "click", path: location.pathname, ...describe(el) });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
