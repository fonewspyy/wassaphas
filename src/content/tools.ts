// Tools I built to work with AI agents. Facts checked in each repo on 2026-10-12;
// numbers measured from the code, not copied from docs.

type Bi = { th: string; en: string };

export type Tool = {
  name: string;
  kind: Bi;
  period: Bi;
  url?: string;
  /** Path of a page on this site that explains the tool in depth. */
  page?: string;
  summary: Bi;
  points: Bi[];
  facts: string;
};

export const tools: Tool[] = [
  {
    name: "Claude Orchestrator",
    page: "/tools/claude-orchestrator",
    kind: { th: "เครื่องมือทดลอง (repo ส่วนตัว)", en: "Experimental tool (private repo)" },
    period: { th: "ส.ค. 2026 – ปัจจุบัน", en: "Aug 2026 – Present" },
    summary: {
      th: "เครื่องมือที่ผมทดลองให้ AI agent หลายตัวทำงานพร้อมกัน แต่ละตัวรับขั้นต่างกันตามขั้นตอนที่ผมออกแบบ ตั้งแต่สำรวจและวิเคราะห์ ไปจนถึงรีวิว เพื่อสร้าง product หรือแก้ ticket ที่ผู้ใช้เปิดคำขอเข้ามา งานทุกชิ้นผ่านการรีวิวของผมก่อน ตัวกลางนี้จัดคิวและแบ่งงานให้แต่ละบัญชี งานของบริษัทรันบนบัญชี Claude แผน Team ของบริษัท ส่วนโปรเจกต์ส่วนตัวใช้บัญชีส่วนตัว",
      en: "A tool I'm experimenting with, where several AI agents work at once, each taking a different step of a process I designed, from surveying and analysis through to review, to build a product or work through tickets that users open. Every piece of work goes through my review. The tool queues the work and routes it between accounts. Company work runs on the company's Claude Team plan; personal projects use personal accounts.",
    },
    points: [],
    facts: "TypeScript · Hono · Next.js · SSE",
  },
];
