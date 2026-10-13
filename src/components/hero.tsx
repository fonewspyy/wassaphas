import { profile } from "@/content/profile";
import type { Dictionary } from "@/i18n/dictionaries";
import { Barcode } from "./barcode";
import { GitHubIcon } from "./icons";
import { LabelIntro } from "./motion/label-intro";

// The hero is a shipping label: the kind of thing his warehouse and driver apps print and
// scan all day. Real label anatomy (ruled fields, barcode, contents), real data in it.
export function Hero({ dict }: { dict: Dictionary }) {
  const showEnglishName = dict.profile.name !== profile.name;

  return (
    <section className="mx-auto grid max-w-6xl gap-x-14 gap-y-10 px-4 pb-20 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end">
      <LabelIntro>
        <article
          data-print
          aria-label={`${dict.profile.name}, ${dict.profile.role}`}
          className="border-2 border-rule bg-label shadow-[0_1px_0_rgb(0_0_0/0.04),0_24px_48px_-28px_rgb(0_0_0/0.45)]"
        >
          <div className="grid grid-cols-2 divide-x-2 divide-rule border-b-2 border-rule text-sm">
            <Field label={dict.label.from} value={`${dict.profile.location}, TH`} />
            <Field label={dict.label.service} value={dict.profile.role} />
          </div>

          <div className="border-b-2 border-rule px-5 pb-6 pt-5 sm:px-6">
            <h1 className="text-[clamp(2.6rem,8.5vw,5.25rem)] font-bold leading-[1.02] tracking-[-0.025em] text-balance">
              {dict.profile.name}
            </h1>
            {showEnglishName && (
              <p lang="en" className="mt-2 font-mono text-sm text-ink-3">
                {profile.name}
              </p>
            )}
          </div>

          <div className="relative border-b-2 border-rule px-5 py-4 sm:px-6">
            <div className="relative">
              <Barcode value="WASSAPHAS.COM" />
              {/* scanner beam, swept by LabelIntro */}
              <span
                data-beam
                aria-hidden
                className="invisible absolute -top-2 bottom-4 w-0.5 bg-glow shadow-[0_0_14px_4px_rgb(60_240_208/0.7)]"
              />
            </div>
            <span
              data-status
              className="absolute right-4 top-3 inline-flex items-center gap-1 bg-label px-1.5 text-xs font-semibold text-scan"
            >
              ✓ {dict.label.scanned}
            </span>
          </div>

          <div>
            <p className="px-5 pt-3 text-xs text-ink-3 sm:px-6">{dict.label.contents}</p>
            <dl className="grid grid-cols-2">
              {dict.impact.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`px-5 py-4 sm:px-6 ${i % 2 === 1 ? "border-l-2 border-rule" : ""} ${i >= 2 ? "border-t-2 border-rule" : ""}`}
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-mono text-2xl font-semibold tracking-tight sm:text-3xl">{stat.value}</span>
                    <span className="mt-1 block text-[13px] leading-snug text-ink-2">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </article>
      </LabelIntro>

      <div className="lg:pb-2">
        <p className="max-w-xl text-xl leading-relaxed text-pretty sm:text-2xl sm:leading-relaxed">{dict.profile.tagline}</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
          <a
            href="#experience"
            className="inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-base font-semibold text-label transition-colors hover:bg-scan"
          >
            {dict.hero.primary} <span aria-hidden>↓</span>
          </a>
          <a href="#contact" className="link text-base font-medium">
            {dict.hero.contact}
          </a>
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-base text-ink-2 hover:text-ink">
            <GitHubIcon /> GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-3 sm:px-6">
      <p className="text-xs text-ink-3">{label}</p>
      <p className="mt-0.5 font-semibold leading-snug">{value}</p>
    </div>
  );
}
