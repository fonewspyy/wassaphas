import { BEGER_SPLIT_DATE, begerMonths, begerSummary, begerWeeks } from "@/content/beger-metrics";
import type { Locale } from "@/i18n/config";

// The Beger half of "what changed with AI agents": git history of the production work,
// paired with production numbers so the faster pace is read next to the outcome.
// Same visual language as the Kobnub charts: one measure per chart, before light, after ink.

const BEFORE = "#a3a39f";
const AFTER = "#111111";
const SPLIT = "#08705f";

type Bi = { th: string; en: string };
const t = (b: Bi, l: Locale) => b[l];

const COPY = {
  heading: { th: "งานประจำที่ Beger", en: "Day-to-day production work at Beger" },
  intro: {
    th: "17 repo ของระบบที่ใช้งานจริงทุกวัน วัดจาก git เส้นแบ่งคือวันแรกที่ไฟล์กติกาของ AI agent เข้า repo",
    en: "17 repos behind systems people use every day, measured from git. The split is the first day agent rules entered a repo.",
  },
  kpis: [
    { value: (s: typeof begerSummary) => `${s.before.per_week} → ${s.after.per_week}`, label: { th: "commit ต่อสัปดาห์", en: "commits per week" } },
    { value: (s: typeof begerSummary) => `${s.before.median_lines_per_commit} → ${s.after.median_lines_per_commit}`, label: { th: "บรรทัดต่อ commit (มัธยฐาน)", en: "lines per commit (median)" } },
    { value: (s: typeof begerSummary) => `${Math.round(s.before.test_share_of_changed_lines * 100)}% → ${Math.round(s.after.test_share_of_changed_lines * 100)}%`, label: { th: "ของโค้ดที่แก้เป็น test", en: "of changed code is tests" } },
    { value: (s: typeof begerSummary) => `${s.before.repos_touched} → ${s.after.repos_touched}`, label: { th: "repo ที่ดูแล", en: "repos maintained" } },
  ],
  weeklyTitle: { th: "commit ต่อสัปดาห์", en: "Commits per week" },
  testTitle: { th: "สัดส่วน test ในโค้ดที่แก้ รายเดือน", en: "Share of changed code that is tests, by month" },
  before: { th: "ก่อนมีกติกาให้ agent", en: "Before agent rules" },
  after: { th: "หลังมีกติกาให้ agent", en: "With agent rules" },
  splitLabel: { th: "กติกา agent เข้า repo", en: "agent rules land" },
  outcome: {
    th: "ช่วงเดียวกันนี้ ระบบขนส่งที่ผมดูแลรับงานเขียนข้อมูลเฉลี่ยราว 60,000 request ต่อวัน เวลาตอบเฉลี่ย 66 ms และ 332 จาก 386 ชุดการเปลี่ยนแปลงมีสคริปต์ rollback ทำงานเร็วขึ้น แต่ทุกการเปลี่ยนยังถอยกลับได้",
    en: "Over the same period the transport system I run handled about 60,000 write requests a day at a 66 ms average, and 332 of 386 change sets shipped with a rollback script. The pace went up; every change could still be backed out.",
  },
  caveat: {
    th: "commit เล็กลงและถี่ขึ้น จำนวน commit จึงบอกวิธีทำงาน ไม่ได้บอกว่าผลงานเพิ่มกี่เท่า ช่วงก่อนเส้นแบ่งเป็นช่วงเริ่มงานและสั้นกว่า (55 commit) และวันที่ไฟล์กติกาเข้า repo ไม่ใช่วันแรกที่ผมใช้ AI ตัวเลขการใช้งานปัดเศษจาก production 90 วัน ถึง 13 ต.ค. 2026",
    en: "Commits got smaller and more frequent, so their count shows how the work is done, not how much more of it there is. The period before the split is my first months and shorter (55 commits), and the day the rules landed isn't the first day I used AI. Usage figures are rounded production totals for the 90 days to 13 Oct 2026.",
  },
};

function Legend({ lang }: { lang: Locale }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-2">
      {[
        { color: BEFORE, label: COPY.before },
        { color: AFTER, label: COPY.after },
      ].map((i) => (
        <li key={i.label.en} className="inline-flex items-center gap-2">
          <span aria-hidden className="h-2.5 w-2.5" style={{ background: i.color }} />
          {t(i.label, lang)}
        </li>
      ))}
    </ul>
  );
}

const axis = { fontSize: "9", fill: "#6f6f6c", fontFamily: "var(--font-plex-mono)" } as const;

function WeeklyCommits({ lang }: { lang: Locale }) {
  const W = 640;
  const H = 200;
  const pad = { l: 30, r: 4, t: 10, b: 22 };
  const max = Math.max(...begerWeeks.map(([, c]) => c));
  const top = Math.ceil(max / 50) * 50;
  const bw = (W - pad.l - pad.r) / begerWeeks.length;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / top);
  const xSplit = pad.l + begerWeeks.findIndex(([d]) => d >= BEGER_SPLIT_DATE) * bw;
  const ticks = [0, top / 2, top];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={t(COPY.weeklyTitle, lang)}>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#d5d5d1" strokeWidth={v === 0 ? 1.5 : 0.75} />
          <text x={pad.l - 6} y={y(v) + 3} textAnchor="end" {...axis}>
            {v}
          </text>
        </g>
      ))}
      {begerWeeks.map(([d, c], i) => (
        <rect
          key={d}
          x={pad.l + i * bw + 1}
          y={y(c)}
          width={Math.max(bw - 2, 1)}
          height={Math.max(y(0) - y(c), c > 0 ? 1 : 0)}
          fill={d >= BEGER_SPLIT_DATE ? AFTER : BEFORE}
        >
          <title>{`${d}: ${c} commits`}</title>
        </rect>
      ))}
      <line x1={xSplit} x2={xSplit} y1={pad.t} y2={y(0)} stroke={SPLIT} strokeWidth={1.5} strokeDasharray="3 3" />
      <text x={xSplit + 6} y={pad.t + 10} fontSize="9" fill={SPLIT} fontWeight={600}>
        {t(COPY.splitLabel, lang)}
      </text>
      <text x={pad.l} y={H - 6} {...axis}>
        {begerWeeks[0][0].slice(0, 7)}
      </text>
      <text x={W - pad.r} y={H - 6} textAnchor="end" {...axis}>
        {begerWeeks[begerWeeks.length - 1][0].slice(0, 7)}
      </text>
    </svg>
  );
}

function TestShare({ lang }: { lang: Locale }) {
  const W = 640;
  const H = 200;
  const pad = { l: 30, r: 4, t: 16, b: 22 };
  const shares = begerMonths.map(([m, lines, test]) => [m, lines ? test / lines : 0] as const);
  const top = 0.25;
  const bw = (W - pad.l - pad.r) / shares.length;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / top);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={t(COPY.testTitle, lang)}>
      {[0, 0.1, 0.2].map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#d5d5d1" strokeWidth={v === 0 ? 1.5 : 0.75} />
          <text x={pad.l - 6} y={y(v) + 3} textAnchor="end" {...axis}>
            {`${Math.round(v * 100)}%`}
          </text>
        </g>
      ))}
      {shares.map(([m, s], i) => {
        const x = pad.l + i * bw + 4;
        const w = bw - 8;
        return (
          <g key={m}>
            <rect x={x} y={y(s)} width={w} height={Math.max(y(0) - y(s), s > 0 ? 1 : 0)} fill={`${m}-01` >= BEGER_SPLIT_DATE.slice(0, 7) + "-01" ? AFTER : BEFORE}>
              <title>{`${m}: ${Math.round(s * 100)}% tests`}</title>
            </rect>
            <text x={x + w / 2} y={y(s) - 4} textAnchor="middle" {...axis}>
              {`${Math.round(s * 100)}%`}
            </text>
            {i % 2 === 0 && (
              <text x={x + w / 2} y={H - 6} textAnchor="middle" {...axis}>
                {m}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function BegerMetrics({ lang }: { lang: Locale }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold tracking-[-0.01em]">{t(COPY.heading, lang)}</h3>
        <p className="mt-1 max-w-3xl text-sm text-ink-2 text-pretty">{t(COPY.intro, lang)}</p>
      </div>
      {/* 2px gaps over the rule colour draw the cell borders at every breakpoint */}
      <dl className="grid gap-[2px] border-2 border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {COPY.kpis.map((k) => (
          <div key={k.label.en} className="bg-label p-5">
            <dt className="sr-only">{t(k.label, lang)}</dt>
            <dd>
              <span className="block font-mono text-2xl font-semibold tracking-tight">{k.value(begerSummary)}</span>
              <span className="mt-1 block text-sm text-ink-2">{t(k.label, lang)}</span>
            </dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-4 lg:grid-cols-2">
        <figure className="border-2 border-rule bg-label p-5 sm:p-6">
          <figcaption>
            <p className="font-semibold">{t(COPY.weeklyTitle, lang)}</p>
            <div className="mt-2">
              <Legend lang={lang} />
            </div>
          </figcaption>
          <div className="mt-4">
            <WeeklyCommits lang={lang} />
          </div>
        </figure>
        <figure className="border-2 border-rule bg-label p-5 sm:p-6">
          <figcaption>
            <p className="font-semibold">{t(COPY.testTitle, lang)}</p>
            <div className="mt-2">
              <Legend lang={lang} />
            </div>
          </figcaption>
          <div className="mt-4">
            <TestShare lang={lang} />
          </div>
        </figure>
      </div>
      <p className="max-w-3xl border-l-4 border-scan pl-4 text-base leading-relaxed text-pretty">{t(COPY.outcome, lang)}</p>
      <p className="max-w-3xl text-sm leading-relaxed text-ink-3 text-pretty">{t(COPY.caveat, lang)}</p>
    </div>
  );
}
