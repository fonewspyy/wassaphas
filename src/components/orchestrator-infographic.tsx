import type { ReactNode } from "react";
import { orchestrator as o } from "@/content/orchestrator";
import type { Locale } from "@/i18n/config";

type Bi = { th: string; en: string };

// The orchestrator drawn as an infographic: idea, flow, architecture, gate and release.
// Plain HTML and CSS boxes so it reflows to one column on a phone and reads in both themes.
export function OrchestratorInfographic({ lang }: { lang: Locale }) {
  return (
    <div className="space-y-16">
      <Idea lang={lang} />
      <Flow lang={lang} />
      <Architecture lang={lang} />
      <Gate lang={lang} />
      <Release lang={lang} />
    </div>
  );
}

function Heading({ n, children }: { n: string; children: ReactNode }) {
  return (
    <h2 className="flex items-baseline gap-3 border-b-2 border-rule pb-3 text-2xl font-bold tracking-[-0.01em]">
      <span className="font-mono text-sm text-scan">{n}</span>
      {children}
    </h2>
  );
}

function Idea({ lang }: { lang: Locale }) {
  return (
    <section>
      <Heading n="01">{o.ideaTitle[lang]}</Heading>
      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {o.ideas.map((idea, i) => (
          <li key={idea.problem.en} className="flex flex-col border-2 border-rule bg-label">
            <p className="flex-1 border-b-2 border-dashed border-rule p-4 text-[15px] leading-relaxed text-ink-2">
              <span className="mb-2 block font-mono text-xs text-ink-3">
                {lang === "th" ? "ปัญหา" : "Problem"} {i + 1}
              </span>
              {idea.problem[lang]}
            </p>
            <p className="flex-1 p-4 text-[15px] font-medium leading-relaxed">
              <span className="mb-2 block font-mono text-xs text-scan">{lang === "th" ? "ทางแก้" : "Answer"}</span>
              {idea.answer[lang]}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Flow({ lang }: { lang: Locale }) {
  return (
    <section>
      <Heading n="02">{o.flowTitle[lang]}</Heading>
      <ol className="relative mt-8 space-y-6 border-l-2 border-rule pl-8">
        {o.flow.map((f, i) => (
          <li key={f.step.en} className="relative">
            <span
              aria-hidden
              className="absolute -left-[3.05rem] top-0 grid size-8 place-items-center border-2 border-rule bg-label font-mono text-xs font-bold"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-lg font-bold">{f.step[lang]}</h3>
            <p className="mt-1 max-w-2xl leading-relaxed text-ink-2 text-pretty">{f.body[lang]}</p>
            {"loop" in f && f.loop && <Loop items={f.loop} lang={lang} />}
          </li>
        ))}
      </ol>
    </section>
  );
}

function Loop({ items, lang }: { items: Bi[]; lang: Locale }) {
  return (
    <div className="mt-4 max-w-2xl border-2 border-dashed border-rule p-4">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.en} className="flex items-center gap-2">
            <span className="border-2 border-rule bg-label px-2.5 py-1 text-sm font-semibold">{item[lang]}</span>
            {i < items.length - 1 && (
              <span aria-hidden className="font-mono text-scan">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-3 font-mono text-xs text-ink-3">
        ↺ {lang === "th" ? "ถ้ารีวิวไม่ผ่าน ตีกลับพร้อมเหตุผลแล้ววนรอบใหม่" : "a failed review goes back with reasons for another round"}
      </p>
    </div>
  );
}

function Box({ name, tech, items, accent = false }: { name: string; tech: string; items: string[]; accent?: boolean }) {
  return (
    <div className={`border-2 border-rule ${accent ? "bg-ink text-label" : "bg-label"}`}>
      <div className={`flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-b-2 px-4 py-2.5 ${accent ? "border-label/30" : "border-rule"}`}>
        <p className="font-bold">{name}</p>
        <p className={`font-mono text-xs ${accent ? "text-label/70" : "text-ink-3"}`}>{tech}</p>
      </div>
      <ul className="space-y-1.5 px-4 py-3 text-sm">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden className={accent ? "text-label/60" : "text-scan"}>
              ▪
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// A labelled connector: horizontal between columns on wide screens, vertical when stacked.
function Connector({ label, both = false, vertical = false }: { label: string; both?: boolean; vertical?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-1 py-2 text-center ${vertical ? "" : "lg:py-0"}`} aria-hidden>
      <span className="font-mono text-lg leading-none text-scan">
        <span className={vertical ? "" : "lg:hidden"}>{both ? "↕" : "↓"}</span>
        {!vertical && <span className="hidden lg:inline">{both ? "⇄" : "→"}</span>}
      </span>
      <span className="font-mono text-[11px] leading-tight text-ink-3">{label}</span>
    </div>
  );
}

function Architecture({ lang }: { lang: Locale }) {
  const a = o.arch;
  const items = (list: Bi[]) => list.map((x) => x[lang]);
  return (
    <section>
      <Heading n="03">{o.archTitle[lang]}</Heading>
      <div className="mt-8 grid items-center gap-x-3 lg:grid-cols-[minmax(0,1fr)_5.5rem_minmax(0,1.15fr)_5.5rem_minmax(0,1fr)]">
        <Box name={a.board.name[lang]} tech={a.board.tech} items={items(a.board.items)} />
        <Connector label={a.links.boardControl[lang]} both />
        <div>
          <Box name={a.control.name[lang]} tech={a.control.tech} items={items(a.control.items)} accent />
          <Connector label={a.links.controlStore[lang]} both vertical />
          <Box name={a.store.name[lang]} tech={a.store.tech} items={items(a.store.items)} />
        </div>
        <Connector label={a.links.controlWorkers[lang]} both />
        <Box name={a.workers.name[lang]} tech={a.workers.tech} items={items(a.workers.items)} />
      </div>
    </section>
  );
}

const toneClass = {
  pass: "border-scan text-scan",
  hold: "border-rule text-ink",
  stop: "border-rule bg-ink text-label",
} as const;

function Gate({ lang }: { lang: Locale }) {
  return (
    <section>
      <Heading n="04">{o.gateTitle[lang]}</Heading>
      <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {o.gate.map((g) => (
          <li key={g.kind} className={`border-2 p-4 ${toneClass[g.tone]}`}>
            <p className="font-mono text-xs opacity-80">{g.kind}</p>
            <p className="mt-1 text-lg font-bold">{g.label[lang]}</p>
            <p className="mt-2 text-sm">{g.rule[lang]}</p>
          </li>
        ))}
      </ol>
      <p className="mt-5 max-w-3xl leading-relaxed text-ink-2 text-pretty">{o.gateNote[lang]}</p>
    </section>
  );
}

function Release({ lang }: { lang: Locale }) {
  return (
    <section>
      <Heading n="05">{o.deployTitle[lang]}</Heading>
      <ol className="mt-6 grid gap-2 sm:grid-cols-[repeat(4,minmax(0,1fr))]">
        {o.deploy.map((d, i) => (
          <li key={d.en} className="relative border-2 border-rule bg-label p-4">
            <p className="font-mono text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-1 font-semibold">{d[lang]}</p>
            {i === o.deploy.length - 1 && (
              <p className="mt-2 inline-block bg-ink px-2 py-0.5 font-mono text-[11px] text-label">
                {lang === "th" ? "นอกช่วงเวลาที่ตั้งไว้ รอคนอนุมัติ" : "outside the window, waits for a person"}
              </p>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-5 max-w-3xl leading-relaxed text-ink-2 text-pretty">{o.deployNote[lang]}</p>
    </section>
  );
}
