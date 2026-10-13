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
      th: "เครื่องมือที่ผมเขียนไว้สั่งงาน Claude Code หลายงานพร้อมกันบนเครื่องตัวเอง มีคิวงาน บอร์ดดูสถานะสด และด่านตรวจคำสั่ง SQL ก่อนรัน ใช้กับ Kobnub และงานที่ Beger ตั้งแต่ ส.ค. 2026",
      en: "A tool I wrote to run several Claude Code tasks at once on my own machine, with a task queue, a live status board and a check on every SQL statement before it runs. I've used it for Kobnub and for work at Beger since August 2026.",
    },
    points: [],
    facts: "TypeScript · Hono · Next.js · SSE",
  },
];
