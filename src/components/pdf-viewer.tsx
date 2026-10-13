"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import type { Dictionary } from "@/i18n/dictionaries";

type Copy = Dictionary["research"]["viewer"];
type Size = { width: number; height: number };

// Mobile browsers won't reliably show a PDF in an <iframe> (Android downloads it instead),
// so pages are drawn with pdf.js onto canvases. pdf.js is loaded only on this page.

const ZOOMS = [0.6, 0.8, 1, 1.25, 1.5, 2] as const;
const MAX_PAGE_WIDTH = 880;

let workerReady: Promise<typeof import("pdfjs-dist")> | null = null;
function loadPdfjs() {
  workerReady ??= import("pdfjs-dist").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerPort = new Worker(
      new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
      { type: "module" },
    );
    return pdfjs;
  });
  return workerReady;
}

export function PdfViewer({ src, copy, journalUrl }: { src: string; copy: Copy; journalUrl?: string }) {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [zoomIndex, setZoomIndex] = useState(ZOOMS.indexOf(1));
  const [current, setCurrent] = useState(1);
  const [frameWidth, setFrameWidth] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load the document and every page's natural size, so placeholders hold the layout.
  useEffect(() => {
    let cancelled = false;
    let task: PDFDocumentLoadingTask | null = null;
    (async () => {
      try {
        const pdfjs = await loadPdfjs();
        if (cancelled) return;
        task = pdfjs.getDocument({ url: src });
        const loaded = await task.promise;
        const natural: Size[] = [];
        for (let n = 1; n <= loaded.numPages; n++) {
          const vp = (await loaded.getPage(n)).getViewport({ scale: 1 });
          natural.push({ width: vp.width, height: vp.height });
        }
        if (cancelled) return;
        setSizes(natural);
        setDoc(loaded);
        setStatus("ready");
      } catch (err) {
        console.error("pdf preview failed", err);
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
      task?.destroy();
    };
  }, [src]);

  // Fit-width base follows the frame, so phones get full-width pages.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    setFrameWidth(el.clientWidth); // ResizeObserver only reports on the next rendered frame
    const observer = new ResizeObserver(([entry]) => setFrameWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Current page = the one crossing the middle of the viewport.
  useEffect(() => {
    if (status !== "ready") return;
    const onScroll = () => {
      const mid = window.innerHeight / 2;
      const index = pageRefs.current.findIndex((el) => {
        const r = el?.getBoundingClientRect();
        return r && r.top <= mid && r.bottom >= mid;
      });
      if (index >= 0) setCurrent(index + 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [status, zoomIndex, frameWidth]);

  const goTo = useCallback((page: number) => {
    const target = pageRefs.current[page - 1];
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: reduce ? "auto" : "smooth" });
  }, []);

  const zoom = ZOOMS[zoomIndex];
  const baseWidth = Math.min(frameWidth, MAX_PAGE_WIDTH);
  const pageWidth = Math.round(baseWidth * zoom);
  const numPages = sizes.length;

  return (
    <div>
      <div ref={frame} className="w-full">
        {status === "loading" && (
          <div className="grid h-[60vh] place-items-center rounded-2xl border border-border bg-surface-2 text-sm text-muted">
            {copy.loading}
          </div>
        )}
        {status === "error" && (
          <div className="grid h-[40vh] place-items-center rounded-2xl border border-border bg-surface-2 p-6 text-center text-sm">
            <div>
              <p>{copy.error}</p>
              <a href={src} download className="mt-4 inline-block font-medium text-accent">
                {copy.download}
              </a>
            </div>
          </div>
        )}
      </div>

      {status === "ready" && doc && baseWidth > 0 && (
        // Wider-than-screen zoom scrolls sideways inside this strip, never the page.
        <div className="-mx-4 overflow-x-auto bg-surface-2 px-4 py-6 sm:mx-0 sm:rounded-2xl sm:border sm:border-border sm:py-10">
          <div className="mx-auto flex w-max min-w-full flex-col items-center gap-6 pb-20">
            {sizes.map((size, i) => (
              <div
                key={i}
                ref={(el) => {
                  pageRefs.current[i] = el;
                }}
                className="bg-white shadow-[0_1px_3px_rgb(0_0_0/0.08),0_12px_32px_-12px_rgb(0_0_0/0.18)]"
                style={{ width: pageWidth, height: Math.round((pageWidth * size.height) / size.width) }}
              >
                <PdfPage doc={doc} pageNumber={i + 1} width={pageWidth} label={`${copy.page} ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {status === "ready" && (
        <div className="fixed inset-x-0 bottom-4 z-20 flex justify-center px-4 pb-[env(safe-area-inset-bottom)]">
          <div
            role="toolbar"
            aria-label="PDF"
            className="flex items-center gap-1 rounded-full border border-border bg-surface/95 p-1.5 text-sm shadow-[0_8px_30px_-10px_rgb(0_0_0/0.3)] backdrop-blur"
          >
            <ToolButton label={copy.prev} disabled={current <= 1} onClick={() => goTo(current - 1)}>
              ‹
            </ToolButton>
            <span className="min-w-[4.5rem] px-1 text-center font-mono text-xs tabular-nums" aria-live="polite">
              {current} / {numPages}
            </span>
            <ToolButton label={copy.next} disabled={current >= numPages} onClick={() => goTo(current + 1)}>
              ›
            </ToolButton>
            <span aria-hidden className="mx-1 h-5 w-px bg-border" />
            <ToolButton label={copy.zoomOut} disabled={zoomIndex === 0} onClick={() => setZoomIndex((z) => z - 1)}>
              −
            </ToolButton>
            <button
              type="button"
              onClick={() => setZoomIndex(ZOOMS.indexOf(1))}
              title={copy.fit}
              aria-label={copy.fit}
              className="min-w-[3.25rem] rounded-full px-2 py-1.5 font-mono text-xs tabular-nums hover:bg-surface-2"
            >
              {Math.round(zoom * 100)}%
            </button>
            <ToolButton label={copy.zoomIn} disabled={zoomIndex === ZOOMS.length - 1} onClick={() => setZoomIndex((z) => z + 1)}>
              +
            </ToolButton>
            <span aria-hidden className="mx-1 hidden h-5 w-px bg-border sm:block" />
            <a
              href={src}
              download
              className="hidden rounded-full bg-text px-3 py-1.5 text-xs font-medium text-bg hover:opacity-85 sm:inline-block"
            >
              {copy.download}
            </a>
            {journalUrl && (
              <a
                href={journalUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden rounded-full px-3 py-1.5 text-xs text-muted hover:bg-surface-2 hover:text-text md:inline-block"
              >
                {copy.journal} ↗
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-full text-lg leading-none hover:bg-surface-2 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

/** One page: drawn only when near the viewport, redrawn when its width changes. */
function PdfPage({ doc, pageNumber, width, label }: { doc: PDFDocumentProxy; pageNumber: number; width: number; label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), {
      rootMargin: "800px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!near || !canvas.current) return;
    let task: RenderTask | null = null;
    let cancelled = false;
    (async () => {
      const page = await doc.getPage(pageNumber);
      if (cancelled || !canvas.current) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = page.getViewport({ scale: (width * dpr) / page.getViewport({ scale: 1 }).width });
      canvas.current.width = Math.floor(viewport.width);
      canvas.current.height = Math.floor(viewport.height);
      task = page.render({ canvas: canvas.current, viewport });
      await task.promise.catch(() => {}); // cancelled renders reject; that's expected
    })();
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [doc, pageNumber, width, near]);

  return <canvas ref={canvas} role="img" aria-label={label} className="block h-full w-full" />;
}
