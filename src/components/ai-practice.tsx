import { RatchetFigure } from "@/components/metrics";
import type { Locale } from "@/i18n/config";

// How I work with AI agents: what I put around them, and what happened in production.
// Plain statements with the evidence next to each; the limits of the numbers are stated.
// Beger figures: rounded production aggregates for the 90 days to 13 Oct 2026 and git
// history; no system, repo or table names.

type Bi = { th: string; en: string };
const t = (b: Bi, l: Locale) => b[l];

const INTRO: Bi = {
  th: "ผมใช้ AI agent เขียนโค้ดทุกวัน ทั้งงานที่ Beger และโปรเจกต์ส่วนตัว ผมรู้ว่าหลายคนไม่ไว้ใจโค้ดที่ AI เขียน ผมเองก็ไม่ไว้ใจถ้าไม่มีอะไรคุมไว้ ส่วนนี้เล่าว่าผมให้มันทำงานแบบไหน อะไรที่ยังให้คนตัดสิน และผลที่ production เป็นยังไง",
  en: "I write code with AI agents every day, at Beger and on my own projects. Plenty of people don't trust code an AI wrote, and I wouldn't either without something holding it in check. Here is what I hand to agents, what I keep for a person to decide, and how it has held up in production.",
};

const POINTS: { title: Bi; body: Bi; figure?: boolean }[] = [
  {
    title: { th: "งานที่ผมให้ agent ทำ", en: "What I hand to agents" },
    body: {
      th: "งานที่ชัดเจนและตรวจผลได้ เช่น เขียน test ลบโค้ดที่ไม่มีใครใช้ และไล่หาบั๊กทีละขั้น ใน Kobnub ไฟล์ test เพิ่มจาก 76 เป็นราว 1,700 ไฟล์ ระหว่างต้น ก.ค. ถึงต้น ต.ค. 2026 ส่วนระบบอ่านบัตรประชาชน agent ช่วยวัดผลทีละขั้นจนเจอว่าภาพถูกส่งเข้าโมเดลด้วยลำดับสีผิด งานไหนแตะเงิน สต็อก หรือสิทธิ์ agent ต้องหยุดถามผมก่อน",
      en: "Work that is well defined and can be checked: writing tests, deleting code nothing uses, tracing a bug step by step. In Kobnub, test files went from 76 to about 1,700 between early July and early October 2026. On the ID-card reader, an agent measured each step until we found images reaching the model in the wrong colour order. Anything touching money, stock or permissions, the agent has to stop and ask me first.",
    },
  },
  {
    title: { th: "ให้เครื่องบังคับกติกา", en: "Let machines enforce the rules" },
    body: {
      th: "กติกาที่ agent ต้องทำตาม ผมเขียนเป็น ESLint, git hook และ ratchet คือตัวเลขที่ commit ไว้ใน repo และยอมให้ลดลงอย่างเดียว ถ้าการแก้ไขทำให้ตัวเลขเกินเพดาน commit จะไม่ผ่าน กราฟด้านล่างมาจาก Kobnub โปรเจกต์ส่วนตัวของผม",
      en: "The rules agents must follow are ESLint rules, git hooks and ratchets: counts committed to the repo that may only go down. A change that pushes a count over its limit can't be committed. The charts below come from Kobnub, my own project.",
    },
    figure: true,
  },
  {
    title: { th: "ให้คนตัดสินเฉพาะเรื่องที่ย้อนไม่ได้", en: "Ask a person only about what can't be undone" },
    body: {
      th: "ด่านตรวจ SQL ใน orchestrator ของผมเคยรอคนอนุมัติทุกคำสั่งที่ไม่ใช่การอ่าน จาก 2,327 ครั้งแรก คนตอบเอง 68 ครั้งและปฏิเสธ 8 ครั้ง อีก 97% รอ 45 วินาทีแล้วจบที่คำตอบเดิมตามนโยบาย ผมเลยเปลี่ยนเป็นบันทึกทุกคำสั่งแล้วปล่อยผ่าน และเตือนเฉพาะคำสั่งที่ย้อนไม่ได้ เช่น DROP หรือ DELETE ที่ไม่มี WHERE",
      en: "The SQL gate in my orchestrator used to hold every non-read statement for approval. Of the first 2,327, a person answered 68 and denied 8; the other 97% waited 45 seconds for the answer policy was always going to give. So now it records every statement and lets it through, flagging only what can't be undone, such as DROP or a DELETE without WHERE.",
    },
  },
  {
    title: { th: "ตรวจตัวตรวจด้วย", en: "Check the checks" },
    body: {
      th: "ratchet ที่นับ query ซึ่งลืมกรองตามบริษัท เคยรายงานว่าเหลือ 0 จุด เพราะมันเช็กแค่ว่ามีคำว่า company_id อยู่ในข้อความ พอเปลี่ยนให้ตรวจจริง ตัวเลขขึ้นเป็น 36",
      en: "The ratchet counting queries without a company filter once reported zero, because it only checked that the text contained company_id. Once it checked properly, the count was 36.",
    },
  },
];

const PROD_TITLE: Bi = { th: "ผลที่ production", en: "In production" };
const PROD_BODY: Bi = {
  th: "ระบบขนส่งที่ Beger ซึ่งผมเขียนคู่กับ agent ย้ายออกจากโปรแกรม desktop เดิมโดยงานส่งของไม่ต้องหยุด ตัวเลข 90 วันล่าสุด (ถึง 13 ต.ค. 2026):",
  en: "The transport system at Beger, which I build with agents, moved off its old desktop program without stopping deliveries. Figures for the 90 days to 13 Oct 2026:",
};
const PROD_STATS: { value: Bi; label: Bi }[] = [
  { value: { th: "5.3M", en: "5.3M" }, label: { th: "request บันทึกข้อมูลที่สำเร็จ", en: "successful write requests" } },
  { value: { th: "66 ms", en: "66 ms" }, label: { th: "เวลาตอบเฉลี่ย", en: "average response time" } },
  { value: { th: "~1 นาที", en: "~1 min" }, label: { th: "ระบบหยุดรวมตลอดการย้าย (ครั้งเดียว)", en: "total downtime during the move (once)" } },
  { value: { th: "332/386", en: "332/386" }, label: { th: "ชุดการเปลี่ยนแปลงที่มีสคริปต์ rollback", en: "change sets with a rollback script" } },
];

const LIMITS_TITLE: Bi = { th: "สิ่งที่ตัวเลขเหล่านี้บอกไม่ได้", en: "What these numbers don't show" };
const LIMITS: Bi = {
  th: "หลังเริ่มใช้ agent ผมส่ง commit ถี่ขึ้นมาก (ที่ Beger จาก 3.4 เป็น 42 ต่อสัปดาห์) แต่ commit ก็เล็กลงครึ่งหนึ่ง และช่วงก่อนหน้าคือช่วงที่ผมเพิ่งเริ่มงาน ตัวเลขนี้จึงบอกวิธีทำงาน ไม่ได้บอกว่าทำงานได้มากขึ้นกี่เท่า กติกา, orchestrator และ test เริ่มใช้ไล่เลี่ยกัน ผมจึงแยกไม่ได้ว่าอย่างไหนช่วยมากแค่ไหน",
  en: "After I started working with agents I committed far more often (at Beger, from 3.4 to 42 a week), but each commit was about half the size, and the earlier period was my first months in the job. So the count shows how I work, not how much more I get done. The rules, the orchestrator and the tests arrived close together, so I can't separate how much each one helped.",
};

export function AiPractice({ lang }: { lang: Locale }) {
  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-lg leading-relaxed text-ink-2 text-pretty">{t(INTRO, lang)}</p>

      <ol>
        {POINTS.map((p, i) => (
          <li key={p.title.en} className="grid gap-x-6 gap-y-1 border-b border-hair py-6 first:pt-0 sm:grid-cols-[3rem_minmax(0,1fr)]">
            <span aria-hidden className="font-mono text-sm text-ink-3">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-lg font-bold tracking-[-0.01em]">{t(p.title, lang)}</h3>
              <p className="mt-2 max-w-3xl leading-relaxed text-ink-2 text-pretty">{t(p.body, lang)}</p>
              {p.figure && (
                <div className="mt-5">
                  <RatchetFigure lang={lang} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      <section aria-labelledby="ai-prod-title">
        <h3 id="ai-prod-title" className="text-lg font-bold tracking-[-0.01em]">
          {t(PROD_TITLE, lang)}
        </h3>
        <p className="mt-2 max-w-3xl leading-relaxed text-ink-2 text-pretty">{t(PROD_BODY, lang)}</p>
        {/* 2px gaps over the rule colour draw the cell borders at every breakpoint */}
        <dl className="mt-4 grid gap-[2px] border-2 border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {PROD_STATS.map((s) => (
            <div key={s.label.en} className="bg-label p-5">
              <dt className="sr-only">{t(s.label, lang)}</dt>
              <dd>
                <span className="block font-mono text-2xl font-semibold tracking-tight">{t(s.value, lang)}</span>
                <span className="mt-1 block text-sm text-ink-2">{t(s.label, lang)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="max-w-3xl">
        <p className="text-sm font-semibold">{t(LIMITS_TITLE, lang)}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-3 text-pretty">{t(LIMITS, lang)}</p>
      </div>
    </div>
  );
}
