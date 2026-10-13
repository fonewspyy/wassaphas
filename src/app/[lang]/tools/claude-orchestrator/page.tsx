import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang as rootLang } from "next/root-params";
import { ArrowLeftIcon } from "@/components/icons";
import { OrchestratorInfographic } from "@/components/orchestrator-infographic";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { orchestrator as o } from "@/content/orchestrator";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

const PATH = "/tools/claude-orchestrator";

export async function generateMetadata({ params }: PageProps<"/[lang]/tools/claude-orchestrator">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: o.title[lang],
    description: o.intro[lang],
    alternates: {
      canonical: localePath(lang, PATH),
      languages: { th: PATH, en: `/en${PATH}` },
    },
  };
}

// The whole page is fixed content in the repo, so it prerenders per locale.
export default async function OrchestratorPage() {
  const lang = await rootLang();
  if (!lang || !isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <SiteHeader lang={lang} dict={dict} />
      <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <Link href={`${localePath(lang, "/")}#work`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
          <ArrowLeftIcon width={14} height={14} /> {dict.sections.work.tools}
        </Link>

        <header className="mt-8">
          <p className="font-mono text-xs text-ink-3">{o.stack.join(" · ")}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.02em] text-balance sm:text-4xl">{o.title[lang]}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-2 text-pretty">{o.intro[lang]}</p>
          <dl className="mt-8 grid border-2 border-rule bg-label sm:grid-cols-3">
            {o.stats.map((s, i) => (
              <div key={s.value} className={`p-5 ${i > 0 ? "border-t-2 border-rule sm:border-l-2 sm:border-t-0" : ""}`}>
                <dt className="sr-only">{s.label[lang]}</dt>
                <dd>
                  <span className="block font-mono text-3xl font-semibold tracking-tight">{s.value}</span>
                  <span className="mt-2 block text-sm leading-snug text-ink-2 text-pretty">{s.label[lang]}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-muted">{o.status[lang]}</p>
        </header>

        <div className="mt-14">
          <OrchestratorInfographic lang={lang} />
        </div>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
