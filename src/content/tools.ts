// Tools I built to work with AI agents. Facts checked in each repo on 2026-10-12;
// numbers measured from the code, not copied from docs. Orchestrator usage (761 tasks,
// 15-28 Sep 2026) counted read-only from its local SQLite on 2026-10-13.

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
      th: "หน้าเดียวที่ผมใช้สั่งงาน Claude Code หลายงานพร้อมกัน รันบนเครื่องตัวเอง ไม่ผ่าน cloud ใช้กับ Kobnub และงาน production ที่ Beger ตั้งแต่ ส.ค. 2026 ช่วง 15–28 ก.ย. 2026 มีงานผ่านมัน 761 งาน สำเร็จ 735 งาน",
      en: "One screen I use to run many Claude Code tasks at once, on my own machine with no cloud in between. I've used it for Kobnub and production work at Beger since August 2026; from 15 to 28 September 2026, 761 tasks went through it and 735 finished.",
    },
    points: [
      {
        th: "งานใหญ่ เช่นไล่แก้ทั้งโมดูล ผมแตกเป็นงานย่อยที่แตะไฟล์คนละชุด แล้วส่งเข้าคิว ตัวจัดคิวส่งงานไปบัญชีที่ว่างที่สุด ถ้าบัญชีไหนชนลิมิต งานจะย้ายไปบัญชีอื่นเอง ผมไม่ต้องนั่งเฝ้า terminal ทีละหน้าต่าง",
        en: "A big job, like reworking a whole module, gets split into tasks that touch separate files and goes into the queue. The router sends each to the account with the most room and moves work elsewhere when an account hits its limit, so I'm not babysitting terminals one by one.",
      },
      {
        th: "agent ที่ทำงานกับฐานข้อมูลจริงอาจรันคำสั่งที่ย้อนไม่ได้ ด่านตรวจจึงดักทุกคำสั่ง SQL ก่อนรัน ผ่าน PreToolUse hook ของ Claude Code แยกเป็นอ่าน เขียน สร้าง และทำลาย บันทึกไว้ทุกคำสั่ง และขึ้นการ์ดเตือนเมื่อเป็นคำสั่งที่ย้อนไม่ได้ ถ้าด่านตรวจจับคู่คำสั่งกับงานไม่ได้ จะปฏิเสธไว้ก่อน",
        en: "An agent working against a real database can run something that can't be undone. The gate catches every SQL statement before it runs, through Claude Code's PreToolUse hook, sorts it into read, write, create or destructive, records it, and raises a card for anything irreversible. A call it can't match to a task is refused.",
      },
      {
        th: "ทุกงานเก็บ event ดิบไว้ครบ และดูสดได้บนบอร์ด ตอนตรวจงาน ผมไม่ต้องเชื่อสรุปที่ agent เขียนมา เปิดดูได้เลยว่ามันอ่านไฟล์ไหนและรันคำสั่งอะไรจริง",
        en: "Every task keeps its raw event stream, live on the board. When I review the work I don't have to trust the agent's own summary; I can see which files it read and which commands it actually ran.",
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
      th: "ชุด skill 8 ตัวสำหรับ AI coding agent ที่ผมเขียนเป็นภาษาไทย ปัญหาที่ผมเจอบ่อยคือ agent ลงมือแก้เร็วเกินไป ก่อนจะรู้ว่าโค้ดนั้นมีใครใช้อยู่บ้าง ชุดนี้บังคับให้มันคิดก่อนลงมือ ตอนนี้ใช้อยู่ใน repo งานจริงของผมอย่างน้อย 4 ตัว",
      en: "Eight skills for AI coding agents, written in Thai. The problem I kept hitting was agents changing code before they knew who else depended on it; these make them think first. They're in use across at least four of my work repos.",
    },
    points: [
      {
        th: "ก่อนแก้โค้ดเก่า agent ต้องเขียน Impact Map 13 ช่อง เช่น ใครอ่าน ใครเขียน ใครเรียก และจะย้อนกลับยังไง ตอบไม่ครบก็ห้ามเขียนโค้ด ถ้างานแตะเงิน สต็อก สิทธิ์ หรือสถานะเอกสาร ต้องหยุดถามคนก่อน",
        en: "Before touching existing code, the agent fills a 13-field Impact Map: who reads, writes and calls it, and how to roll back. No complete map, no code. Anything about money, stock, permissions or document state means stop and ask a person.",
      },
      {
        th: "ตอนรีวิว ใช้แคตตาล็อก anti-pattern 490 ข้อใน 31 หมวด ตั้งแต่ SQL ธุรกรรม และความปลอดภัย ไปจนถึงความผิดพลาดที่ AI ชอบทำ กฎ 68 ข้อตรวจด้วยเครื่องได้ และตรวจเฉพาะบรรทัดที่เพิ่มใหม่ หนี้เก่าใน repo จึงไม่ทำให้ทุก PR แดง ผมวัดผลด้วยชุดทดสอบ 37 กรณี กรณีละ 3 รอบ ให้คะแนนแบบเทียบรหัสตรงตัว ไม่ใช้ AI ตัดสิน ได้ recall 0.90",
        en: "For review there's a catalogue of 490 anti-patterns in 31 categories, from SQL, transactions and security to mistakes AI agents tend to make. 68 rules are machine-checked, on added lines only, so old debt doesn't turn every PR red. I measured it on 37 cases, three runs each, scored by exact ID match with no AI judge: recall 0.90.",
      },
      {
        th: "งานย้ายข้อมูลมีขั้นตอน 6 ขั้นที่หยุดได้ทุกขั้น ตั้งแต่ขยาย schema, เขียนลงสองที่, เติมข้อมูลเก่าแบบทำต่อได้, อ่านเทียบเงียบๆ, สลับระบบ จนถึงปิดทางเขียนเก่า agent จะไม่รวบทุกอย่างเป็น migration ก้อนเดียว",
        en: "Data migrations follow six steps, each one a safe place to stop: expand the schema, dual-write, a resumable backfill, shadow reads, cutover, then closing the old write path. The agent doesn't squash it all into one big migration.",
      },
    ],
    facts: "Claude Code skills · Python · 490 anti-patterns · 37-case eval",
  },
];
