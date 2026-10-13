import { featured } from "@/content/featured";
import type { Locale } from "@/i18n/config";
import Image from "next/image";
import { FacebookIcon } from "./icons";

// Shown as a parcel: one heavy-ruled box.
export function FeaturedProject({ lang, visitLabel }: { lang: Locale; visitLabel: string }) {
  return (
    <div>
      <article className="grid border-2 border-rule bg-label lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="p-6 sm:p-8">
          <p className="text-sm font-medium tabular-nums text-ink-3">{featured.since[lang]}</p>
          <h3 className="mt-2 text-5xl font-bold tracking-[-0.03em] sm:text-7xl">{featured.name}</h3>
          <p className="mt-4 max-w-xl text-xl font-medium leading-snug text-pretty">{featured.tagline[lang]}</p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-2 text-pretty">{featured.body[lang]}</p>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-2 text-pretty">
            {featured.client.label[lang]}{" "}
            <a
              href={featured.client.url}
              target="_blank"
              rel="noreferrer"
              className="link inline-flex items-center gap-1.5 font-semibold text-ink"
            >
              <FacebookIcon className="size-4 shrink-0" />
              {featured.client.name}
            </a>{" "}
            · {featured.client.note[lang]}
          </p>
          <p className="mt-6 font-mono text-xs leading-relaxed text-ink-3">{featured.stack.join("  ·  ")}</p>
          <a
            href={featured.url}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-base font-semibold text-label transition-colors hover:bg-scan"
          >
            {visitLabel} kobnub.io <span aria-hidden>↗</span>
          </a>
        </div>
        <figure className="group relative flex flex-col justify-center overflow-hidden border-t-2 border-rule bg-ink p-6 sm:p-10 lg:border-l-2 lg:border-t-0">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(var(--label)_1px,transparent_1px)] [background-size:18px_18px]"
          />
          <div className="relative [perspective:1400px]">
            <div className="overflow-hidden border-2 border-label/80 bg-label shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] transition-transform duration-500 ease-out [transform:rotateY(-9deg)_rotateX(3deg)_translateX(4%)] motion-safe:group-hover:[transform:rotateY(0deg)_rotateX(0deg)_translateX(0)] motion-reduce:[transform:none]">
              <div aria-hidden className="flex items-center gap-1.5 border-b-2 border-rule bg-label px-3 py-2">
                <span className="size-2.5 rounded-full bg-scan" />
                <span className="size-2.5 rounded-full border-2 border-rule" />
                <span className="size-2.5 rounded-full border-2 border-rule" />
                <span className="ml-3 truncate font-mono text-[11px] text-ink-3">{featured.client.name}</span>
              </div>
              <a
                href={featured.shot.site}
                target="_blank"
                rel="noreferrer"
                aria-label={`${featured.shot.open[lang]}: ${featured.client.name}`}
                className="group/shot relative block"
              >
                <Image
                  src={featured.shot.src}
                  width={featured.shot.width}
                  height={featured.shot.height}
                  alt={featured.shot.alt[lang]}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="block h-auto w-full"
                />
                <span
                  aria-hidden
                  className="absolute bottom-3 right-3 bg-ink px-2.5 py-1 font-mono text-[11px] text-label opacity-0 transition-opacity group-hover/shot:opacity-100 group-focus-visible/shot:opacity-100"
                >
                  {featured.shot.open[lang]} ↗
                </span>
              </a>
            </div>
          </div>
          <figcaption className="relative mt-5 font-mono text-xs text-label/70">
            <span className="flex items-center gap-2">
              <span aria-hidden className="inline-block size-1.5 rounded-full bg-scan" />
              {featured.shot.caption[lang]}
            </span>
            <a
              href={featured.shot.site}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 pl-3.5 text-label underline decoration-scan underline-offset-4 hover:text-scan"
            >
              {new URL(featured.shot.site).host} <span aria-hidden>↗</span>
            </a>
          </figcaption>
        </figure>
      </article>
    </div>
  );
}
