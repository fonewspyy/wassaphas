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
    kind: { th: "เครื่องมือทดลอง (repo ส่วนตัว)", en: "Experimental tool (private repo)" },
    period: { th: "ส.ค. 2026 – ปัจจุบัน", en: "Aug 2026 – Present" },
    summary: {
      th: "เครื่องมือที่ผมทดลองให้ AI agent หลายตัวทำงานพร้อมกันคนละบทบาท เช่น SA, BA และ PO เพื่อสร้าง product ขึ้นมาหนึ่งตัว หรือแก้ ticket ที่ผู้ใช้เปิดคำขอเข้ามา โดยงานทุกชิ้นต้องผ่านการรีวิวของผมก่อน และเพราะงานกระจายอยู่บนบัญชี Claude หลายบัญชี ผมจึงเขียนตัวกลางนี้ไว้จัดคิวและแบ่งงานให้แต่ละบัญชี",
      en: "A tool I'm experimenting with, where several AI agents work at once in different roles, such as systems analyst, business analyst and product owner, to build a product or work through tickets that users open. Every piece of work goes through my review. The work runs across several Claude accounts, so I wrote this to queue it and route it between them.",
    },
    points: [],
    facts: "TypeScript · Hono · Next.js · SSE",
  },
];
