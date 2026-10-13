"use client";

import Image from "next/image";
import { useRef } from "react";

type Props = {
  src: string;
  width: number;
  height: number;
  alt: string;
  sizes: string;
  openLabel: string;
  closeLabel: string;
};

// A screenshot that opens full size on click. Uses the native <dialog>, so Escape, focus
// trapping and the backdrop come from the browser; a click on the backdrop closes it too.
export function ZoomableImage({ src, width, height, alt, sizes, openLabel, closeLabel }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={openLabel}
        className="group/zoom relative block w-full cursor-zoom-in"
      >
        <Image src={src} width={width} height={height} alt={alt} sizes={sizes} className="block h-auto w-full" />
        <span
          aria-hidden
          className="absolute bottom-3 right-3 bg-ink px-2.5 py-1 font-mono text-[11px] text-label opacity-0 transition-opacity group-hover/zoom:opacity-100 group-focus-visible/zoom:opacity-100"
        >
          {openLabel} ⤢
        </span>
      </button>

      <dialog
        ref={dialog}
        aria-label={alt}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        className="m-auto max-h-[92vh] max-w-[min(96vw,1400px)] bg-transparent p-0 backdrop:bg-black/80"
      >
        <div className="relative border-2 border-label bg-label">
          <Image src={src} width={width} height={height} alt={alt} sizes="96vw" className="block h-auto max-h-[86vh] w-auto" />
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="absolute right-2 top-2 bg-ink px-3 py-1.5 text-sm font-semibold text-label hover:bg-scan"
          >
            {closeLabel} ✕
          </button>
        </div>
      </dialog>
    </>
  );
}
