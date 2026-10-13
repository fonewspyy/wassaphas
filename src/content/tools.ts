// Tools I built to work with AI agents. Facts checked in each repo on 2026-10-12;
// numbers measured from the code, not copied from docs.

type Bi = { th: string; en: string };

export type Tool = {
  name: string;
  kind: Bi;
  period: Bi;
  url?: string;
  summary: Bi;
  points: Bi[];
  facts: string;
};

export const tools: Tool[] = [
  {
    name: "Claude Orchestrator",
    kind: { th: "เครื่องมือส่วนตัว (repo ส่วนตัว)", en: "Personal tool (private repo)" },
    period: { th: "ส.ค. 2026 – ปัจจุบัน", en: "Aug 2026 – Present" },
    summary: {
      th: "ศูนย์สั่งงาน Claude Code ที่รันบนเครื่อง กระจายงานไปหลายบัญชี มีคิว บอร์ดดูสถานะสด และด่านตรวจทุกคำสั่ง SQL ที่ agent จะรัน ผมใช้มันสร้าง Kobnub",
      en: "A local control plane for Claude Code: it spreads tasks across several accounts, with a queue, a live board, and a check on every SQL statement an agent runs. I use it to build Kobnub.",
    },
    points: [
      {
        th: "ส่งงานไปบัญชีที่ว่างที่สุด ถ้าบัญชีไหนชนลิมิต งานที่รออยู่จะย้ายไปบัญชีอื่นโดยไม่นับเป็นการลองใหม่ ความล้มเหลวแยกเป็นชั่วคราว ลิมิต หรือพังจริง และไม่ลองซ้ำกับแบบที่พังจริง",
        en: "Sends work to the account with the most room. When one hits its limit, its queue moves elsewhere without spending a retry. Failures are sorted into transient, rate-limit or deterministic, and deterministic ones aren't retried.",
      },
      {
        th: "ด่านตรวจเกาะ PreToolUse hook ของ Claude Code แยก SQL เป็นอ่าน เขียน สร้าง และทำลาย ตอนแรกให้คนอนุมัติทุกคำสั่ง แต่จาก 3,150 ครั้ง คนต้องตอบจริง 150 ครั้งและกดอนุมัติทุกครั้ง เลยเปลี่ยนเป็นบันทึกทุกคำสั่ง แล้วถามเฉพาะที่ย้อนไม่ได้ เช่น DROP หรือ DELETE ที่ไม่มี WHERE",
        en: "The gate hooks Claude Code's PreToolUse event and sorts SQL into read, write, create and destructive. It first asked a person about everything; across 3,150 cards people answered 150 times and approved every one. Now it records everything and asks only about what can't be undone, like DROP or a DELETE with no WHERE.",
      },
      {
        th: "hook ที่จับคู่กับงานไม่ได้จะถูกปฏิเสธ และตอบเป็น HTTP 200 ที่มีคำว่า deny เพราะถ้าตอบ error ตัว tool จะได้รันต่อ งานที่ prompt มาจากคนนอกทีมจะรอคนอนุมัติ 45 วินาที แล้วปฏิเสธถ้าไม่มีใครตอบ",
        en: "A hook it can't match to a task is denied, returned as an HTTP 200 deny because an error status would let the tool run. Tasks whose prompts come from outside the team wait 45 seconds for a person, then get denied.",
      },
    ],
    facts: "TypeScript · Hono · SQLite · Next.js · SSE · ~21k lines + 12k lines of tests",
  },
  {
    name: "nohell",
    kind: { th: "โอเพนซอร์ส (MIT)", en: "Open source (MIT)" },
    period: { th: "ส.ค. 2026", en: "Aug 2026" },
    url: "https://github.com/fonewspyy/nohell-skill",
    summary: {
      th: "ชุด skill 8 ตัวที่บังคับให้ AI coding agent คิดแบบ senior engineer ก่อนแก้โค้ด เขียนเป็นภาษาไทย และใช้อยู่ใน repo งานจริงของผมอย่างน้อย 4 ตัว",
      en: "Eight skills that make AI coding agents think like a senior engineer before changing code. Written in Thai, and in use across at least four of my work repos.",
    },
    points: [
      {
        th: "แคตตาล็อก anti-pattern 490 ข้อใน 31 หมวด ตั้งแต่ SQL ธุรกรรม เงิน ไปจนถึงงานที่ AI ชอบทำพลาด มีกฎ 68 ข้อที่ตรวจด้วยเครื่องได้ และตรวจเฉพาะบรรทัดที่เพิ่มใหม่ ไม่ใช่ทั้ง repo",
        en: "A catalogue of 490 anti-patterns in 31 categories, from SQL and transactions to money and AI-specific mistakes. 68 rules are machine-checkable and run only on lines a change adds.",
      },
      {
        th: "ก่อนแก้อะไร agent ต้องเขียน Impact Map 13 ช่อง เช่น ใครอ่าน ใครเขียน ใครเรียก และจะย้อนกลับยังไง ถ้าเรื่องเกี่ยวกับเงิน สต็อก สิทธิ์ หรือสถานะเอกสาร ต้องหยุดถามคนก่อน",
        en: "Before changing anything an agent fills a 13-field Impact Map: who reads, writes and calls it, and how to roll back. Anything about money, stock, permissions or document state means stop and ask.",
      },
      {
        th: "วัดผลด้วยชุดทดสอบ 37 กรณี กรณีละ 3 รอบ เทียบรหัส anti-pattern ตรงตัวโดยไม่ใช้ AI ตัดสิน ได้ recall 0.90 และไม่ถามพร่ำเพรื่อเวลาเจอบั๊กที่ชัดอยู่แล้ว",
        en: "Evaluated on 37 cases, three runs each, scored by exact ID match with no AI judge: recall 0.90, and no needless questions on clear-cut bugs.",
      },
    ],
    facts: "Claude Code skills · Python · 490 anti-patterns · 37-case eval",
  },
];
