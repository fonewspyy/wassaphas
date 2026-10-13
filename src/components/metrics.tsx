import { SPLIT_DATE, months, ratchets, weeks } from "@/content/metrics";
import type { Locale } from "@/i18n/config";

// Infographic of how working with AI agents changed the Kobnub codebase.
// One measure per chart, one axis each. Before/after the split is one hue, two shades
// (light ink → full ink), always with a legend; the light shade is under 3:1, so every
// chart also carries direct numbers. Native <title> tooltips on each mark.

const BEFORE = "#a3a39f";
const AFTER = "#111111";

type Bi = { th: string; en: string };
const t = (b: Bi, l: Locale) => b[l];

const COPY = {
  before: { th: "ก่อนใช้ AI agent", en: "Before AI agents" },
  after: { th: "หลังใช้ orchestrator และ ratchet", en: "With orchestrator and ratchets" },
  weeklyTitle: { th: "commit ต่อสัปดาห์", en: "Commits per week" },
  weeklyNote: {
    th: "เฉลี่ย 20.9 ต่อสัปดาห์ก่อนหน้า และ 344.5 ต่อสัปดาห์หลังจากนั้น งานถูกแบ่งเป็นชิ้นเล็กลงด้วย จาก ~1,300 เหลือ ~250 บรรทัดต่อ commit จำนวน commit จึงบอกวิธีทำงาน มากกว่าบอกปริมาณงาน",
    en: "20.9 a week before, 344.5 a week after. Work also got split finer, from ~1,300 to ~250 lines per commit, so this shows how the work is done more than how much.",
  },
  sizeTitle: { th: "บรรทัด TypeScript: โค้ดกับ test", en: "TypeScript lines: source vs tests" },
  sizeNote: {
    th: "test เพิ่มจาก 76 เป็น 1,687 ไฟล์ และจาก 7% เป็น 36% ของโค้ดทั้งหมด ขณะที่ตัวโค้ดก็โตตาม",
    en: "Tests went from 76 to 1,687 files, and from 7% to 36% of all TypeScript, while the source grew too.",
  },
  source: { th: "โค้ด", en: "Source" },
  tests: { th: "test", en: "Tests" },
  ratchetTitle: { th: "ratchet: ตัวเลขที่ยอมให้ลดอย่างเดียว", en: "Ratchets: counts that may only go down" },
  ratchetNote: {
    th: "แต่ละกราฟคือเพดานที่ commit ไว้ใน repo ด่านตรวจจะไม่ให้ commit ผ่านถ้าตัวเลขเกินเพดาน บางช่วงที่ลดลงมาจากการนับใหม่ให้ถูก ไม่ใช่การแก้โค้ด",
    en: "Each is a limit committed to the repo; the gate rejects any change that goes over it. Some drops are recounts, not code changes.",
  },
  caveat: {
    th: "ข้อมูลวัดจาก git และ GitHub Actions ของ repo Kobnub ด้วยสคริปต์อ่านอย่างเดียว ณ 12 ต.ค. 2026 ratchet, orchestrator และ integration test เริ่มใช้ห่างกันไม่ถึง 2 สัปดาห์ จึงแยกไม่ได้ว่าอะไรส่งผลเท่าไร",
    en: "Measured from Kobnub's git history and GitHub Actions with read-only scripts on 12 Oct 2026. Ratchets, the orchestrator and integration tests all arrived within two weeks, so their effects can't be separated.",
  },
};

const RATCHET_LABELS: Record<string, Bi> = {
  tenant_scope_server: { th: "query ที่ลืมกรองตามบริษัท", en: "Queries missing a tenant filter" },
  no_explicit_any_server: { th: "any ฝั่ง server", en: "`any` in server code" },
  no_explicit_any_client: { th: "any ฝั่ง client", en: "`any` in client code" },
  knip_unused_server: { th: "โค้ดที่ไม่มีใครใช้ ฝั่ง server", en: "Unused code, server" },
  knip_unused_client: { th: "โค้ดที่ไม่มีใครใช้ ฝั่ง client", en: "Unused code, client" },
  idempotency_exposure_server: { th: "route ที่ยิงซ้ำแล้วไม่ปลอดภัย", en: "Routes unsafe to retry" },
};

const fmt = (n: number) => n.toLocaleString("en-US");
const fmtK = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : String(n));

function Legend({ lang, items }: { lang: Locale; items: { color: string; label: Bi }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-2">
      {items.map((i) => (
        <li key={i.label.en} className="inline-flex items-center gap-2">
          <span aria-hidden className="h-2.5 w-2.5" style={{ background: i.color }} />
          {t(i.label, lang)}
        </li>
      ))}
    </ul>
  );
}

function WeeklyCommits({ lang }: { lang: Locale }) {
  const W = 640;
  const H = 200;
  const pad = { l: 34, r: 4, t: 10, b: 22 };
  const max = 1000;
  const bw = (W - pad.l - pad.r) / weeks.length;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const splitIndex = weeks.findIndex(([d]) => d >= SPLIT_DATE);
  const xSplit = pad.l + splitIndex * bw;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={t(COPY.weeklyTitle, lang)}>
      {[0, 250, 500, 750, 1000].map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#d5d5d1" strokeWidth={v === 0 ? 1.5 : 0.75} />
          <text x={pad.l - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="#6f6f6c" fontFamily="var(--font-plex-mono)">
            {v}
          </text>
        </g>
      ))}
      {weeks.map(([d, c], i) => (
        <rect
          key={d}
          x={pad.l + i * bw + 1}
          y={y(c)}
          width={Math.max(bw - 2, 1)}
          height={Math.max(y(0) - y(c), c > 0 ? 1 : 0)}
          fill={d >= SPLIT_DATE ? AFTER : BEFORE}
        >
          <title>{`${d}: ${c} commits`}</title>
        </rect>
      ))}
      <line x1={xSplit} x2={xSplit} y1={pad.t} y2={y(0)} stroke="#08705f" strokeWidth={1.5} strokeDasharray="3 3" />
      <text x={xSplit - 6} y={pad.t + 10} textAnchor="end" fontSize="9" fill="#08705f" fontWeight={600}>
        {lang === "th" ? "เริ่ม ratchet + orchestrator" : "ratchets + orchestrator"}
      </text>
      <text x={pad.l} y={H - 6} fontSize="9" fill="#6f6f6c" fontFamily="var(--font-plex-mono)">
        {weeks[0][0].slice(0, 7)}
      </text>
      <text x={W - pad.r} y={H - 6} textAnchor="end" fontSize="9" fill="#6f6f6c" fontFamily="var(--font-plex-mono)">
        {weeks[weeks.length - 1][0].slice(0, 7)}
      </text>
    </svg>
  );
}

function SizeOverTime({ lang }: { lang: Locale }) {
  const W = 640;
  const H = 200;
  const pad = { l: 40, r: 4, t: 10, b: 22 };
  const max = 900_000;
  const bw = (W - pad.l - pad.r) / months.length;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / max);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={t(COPY.sizeTitle, lang)}>
      {[0, 300_000, 600_000, 900_000].map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#d5d5d1" strokeWidth={v === 0 ? 1.5 : 0.75} />
          <text x={pad.l - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="#6f6f6c" fontFamily="var(--font-plex-mono)">
            {fmtK(v)}
          </text>
        </g>
      ))}
      {months.map(([m, src, test, files], i) => {
        const x = pad.l + i * bw + 3;
        const w = bw - 6;
        // 2px surface gap between stacked segments
        return (
          <g key={m}>
            <rect x={x} y={y(src)} width={w} height={y(0) - y(src)} fill={BEFORE}>
              <title>{`${m}: ${fmt(src)} source lines`}</title>
            </rect>
            {test > 0 && (
              <rect x={x} y={y(src + test)} width={w} height={Math.max(y(src) - y(src + test) - 2, 1)} fill={AFTER}>
                <title>{`${m}: ${fmt(test)} test lines in ${fmt(files)} files`}</title>
              </rect>
            )}
            {i % 3 === 0 && (
              <text x={x + w / 2} y={H - 6} textAnchor="middle" fontSize="9" fill="#6f6f6c" fontFamily="var(--font-plex-mono)">
                {m}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function RatchetSpark({ points, start }: { points: [string, number][]; start: number }) {
  const W = 160;
  const H = 48;
  const t0 = Date.parse(points[0][0]);
  const t1 = Math.max(Date.parse(points[points.length - 1][0]), t0 + 1);
  const x = (d: string) => 2 + ((Date.parse(d) - t0) / (t1 - t0)) * (W - 4);
  const y = (v: number) => 4 + (H - 8) * (1 - v / start);
  let d = `M ${x(points[0][0])} ${y(points[0][1])}`;
  for (let i = 1; i < points.length; i++) {
    d += ` H ${x(points[i][0])} V ${y(points[i][1])}`;
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-12 w-full" aria-hidden preserveAspectRatio="none">
      <line x1={0} x2={W} y1={H - 4} y2={H - 4} stroke="#d5d5d1" />
      <path d={d} fill="none" stroke={AFTER} strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Metrics({ lang }: { lang: Locale }) {
  const legend = [
    { color: BEFORE, label: COPY.before },
    { color: AFTER, label: COPY.after },
  ];
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <figure className="border-2 border-rule bg-label p-5 sm:p-6">
          <figcaption>
            <p className="font-semibold">{t(COPY.weeklyTitle, lang)}</p>
            <div className="mt-2">
              <Legend lang={lang} items={legend} />
            </div>
          </figcaption>
          <div className="mt-4">
            <WeeklyCommits lang={lang} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-2 text-pretty">{t(COPY.weeklyNote, lang)}</p>
        </figure>

        <figure className="border-2 border-rule bg-label p-5 sm:p-6">
          <figcaption>
            <p className="font-semibold">{t(COPY.sizeTitle, lang)}</p>
            <div className="mt-2">
              <Legend
                lang={lang}
                items={[
                  { color: BEFORE, label: COPY.source },
                  { color: AFTER, label: COPY.tests },
                ]}
              />
            </div>
          </figcaption>
          <div className="mt-4">
            <SizeOverTime lang={lang} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-2 text-pretty">{t(COPY.sizeNote, lang)}</p>
        </figure>
      </div>

      <RatchetFigure lang={lang} />

      <p className="max-w-3xl text-sm leading-relaxed text-ink-3 text-pretty">{t(COPY.caveat, lang)}</p>
    </div>
  );
}

// Kobnub's ratchets on their own, so other sections can show them as evidence.
export function RatchetFigure({ lang }: { lang: Locale }) {
  return (
    <figure className="border-2 border-rule bg-label p-5 sm:p-6">
      <figcaption className="font-semibold">{t(COPY.ratchetTitle, lang)}</figcaption>
      <ul className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {ratchets.map((r) => (
          <li key={r.id}>
            <p className="text-sm text-ink-2">{t(RATCHET_LABELS[r.id] ?? { th: r.id, en: r.id }, lang)}</p>
            <p className="mt-1 font-mono text-2xl font-semibold tracking-tight">
              {fmt(r.start)} <span className="text-ink-3">→</span> {fmt(r.now)}
            </p>
            <div className="mt-2">
              <RatchetSpark points={r.points} start={r.start} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm leading-relaxed text-ink-2 text-pretty">{t(COPY.ratchetNote, lang)}</p>
    </figure>
  );
}
