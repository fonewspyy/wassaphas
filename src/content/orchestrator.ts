// The Claude Orchestrator page: idea, flow and architecture, drawn as an infographic.
// Facts come from the orchestrator repo's README.md and PRODUCT.md and its local task
// database (checked 2026-10-13). It is a private, experimental tool; say so, and keep
// database, server and host names out of this file.

type Bi = { th: string; en: string };

export const orchestrator = {
  title: { th: "Claude Orchestrator: แนวคิด, flow และ architecture", en: "Claude Orchestrator: idea, flow and architecture" } satisfies Bi,
  intro: {
    th: "เครื่องมือทดลองที่ผมเขียนเอง ให้ AI agent หลายตัวทำงานพร้อมกันบนบัญชี Claude หลายบัญชี มีคิว กระดานดูสถานะสด และด่านตรวจทุกคำสั่ง SQL ที่ agent จะรัน งานทุกชิ้นผ่านการรีวิวของผมก่อนขึ้นระบบจริง",
    en: "An experimental tool I wrote so several AI agents can work at once across several Claude accounts, with a queue, a live board, and a gate on every SQL statement an agent is about to run. Every piece of work goes through my review before it reaches a live system.",
  } satisfies Bi,

  ideaTitle: { th: "แนวคิด: สามเรื่องที่ทำจาก terminal ไม่สะดวก", en: "The idea: three things a terminal does badly" } satisfies Bi,
  ideas: [
    {
      problem: { th: "งานเยอะเกินกว่าบัญชีเดียวจะรับไหว", en: "More work than one account can carry" },
      answer: { th: "คิวกลางกระจายงานไปบัญชีที่ว่างที่สุด ชนลิมิตเมื่อไรก็ย้ายไปบัญชีอื่นเอง", en: "One queue routes work to the freest account, and moves it when an account hits its limit" },
    },
    {
      problem: { th: "agent อาจแก้ฐานข้อมูลก่อนคนจะเห็น", en: "An agent can change a database before anyone sees it" },
      answer: { th: "ด่านตรวจหยุดคำสั่งไว้ก่อนรัน จัดประเภท แล้วบันทึกทุกการตัดสินใจ", en: "A gate stops the call before it runs, classifies it, and records every decision" },
    },
    {
      problem: { th: "ไม่รู้ว่า agent ทำอะไรไปจริงๆ", en: "No way to see what an agent actually did" },
      answer: { th: "เก็บ event ดิบทุกขั้น และดูสดบนกระดาน ไม่ต้องเชื่อสรุปที่ agent เขียนเอง", en: "Every raw event is kept and streamed live to the board, so nobody has to trust the agent's own summary" },
    },
  ] satisfies { problem: Bi; answer: Bi }[],

  flowTitle: { th: "Flow ของคำขอหนึ่งชิ้น", en: "The flow of one request" } satisfies Bi,
  flow: [
    {
      step: { th: "รับคำขอ", en: "Request" },
      body: { th: "แบบฟอร์มระบุกลุ่มงาน รายละเอียด ภาพก่อนและหลัง คะแนน Impact และภาระงาน และชื่อผู้อนุมัติ", en: "A form with the group, the detail, before and after, Impact and workload scores, and who approved it" },
    },
    {
      step: { th: "คัดกรอง", en: "Triage" },
      body: { th: "ปฏิเสธตั้งแต่ก่อนเข้าคิว ถ้าไม่ใช่งานของทีมนี้ ยังไม่มีคนอนุมัติ ไม่รู้ว่าเป็นโปรแกรมของใคร หรือเป็น ticket ซ้ำ", en: "Refused before the queue if it isn't this team's work, has no approval, names no known program, or is a duplicate" },
    },
    {
      step: { th: "จัดลำดับ", en: "Prioritise" },
      body: { th: "Priority = Impact × ภาระงาน (1–5 ทั้งคู่) คิดตรงๆ ไม่มี AI มาตัดสิน ใครก็คำนวณตามได้", en: "Priority = Impact × workload, both 1–5. Plain arithmetic with no model in the path, so anyone can recompute it" },
    },
    {
      step: { th: "กระจายงาน", en: "Route" },
      body: { th: "ส่งไปบัญชีที่ว่างที่สุดในขอบเขตของ repo นั้น ถ้าต้องข้ามขอบเขตเพราะชนลิมิต ระบบบันทึกไว้ให้เห็น", en: "Sent to the freest account allowed for that repo; if a limit forces it across that boundary, the record says so" },
    },
    {
      step: { th: "agent ทำงานเป็นรอบ", en: "Agents work in rounds" },
      body: { th: "แต่ละ agent รับบทของตัวเอง แล้วเดินเป็นรอบ", en: "Each agent takes its own role, and the work moves in rounds" },
      loop: [
        { th: "สำรวจ", en: "Survey" },
        { th: "วัด baseline", en: "Baseline" },
        { th: "แตกงาน", en: "Fan out" },
        { th: "รีวิว", en: "Review" },
        { th: "พิสูจน์ผล", en: "Prove" },
      ],
    },
    {
      step: { th: "ด่านตรวจ", en: "Gate" },
      body: { th: "ก่อน agent รันคำสั่ง SQL หรือคำสั่งที่ออกนอกเครื่อง เช่น git push ระบบจัดประเภทและขึ้นการ์ดให้คนเห็นก่อน", en: "Before an agent runs SQL, or a command that leaves the machine such as git push, it is classified and raised as a card" },
    },
    {
      step: { th: "รีวิวและขึ้นระบบ", en: "Review and release" },
      body: { th: "ผมตรวจผล อนุมัติ หรือตีกลับพร้อมเหตุผลให้ agent แก้ใหม่ แล้วจึงขึ้นระบบตามลำดับ", en: "I review the result, then approve it or send it back with reasons for another round, and only then release it in order" },
    },
  ] satisfies { step: Bi; body: Bi; loop?: Bi[] }[],

  archTitle: { th: "Architecture", en: "Architecture" } satisfies Bi,
  arch: {
    board: {
      name: { th: "กระดานบนเว็บ", en: "Web board" },
      tech: "Next.js",
      items: [
        { th: "คิวและสถานะงาน", en: "Queue and task status" },
        { th: "การ์ดอนุมัติ", en: "Approval cards" },
        { th: "event สดของแต่ละงาน", en: "Live events per task" },
      ],
    },
    control: {
      name: { th: "Control plane", en: "Control plane" },
      tech: "TypeScript · Hono",
      items: [
        { th: "API ที่ต้องใช้ token ทุกเส้นทาง", en: "API, token on every route" },
        { th: "คิวและ router", en: "Queue and router" },
        { th: "Permission gate", en: "Permission gate" },
        { th: "SSE ส่งสถานะสด", en: "SSE live stream" },
      ],
    },
    store: {
      name: { th: "ที่เก็บข้อมูล", en: "Store" },
      tech: "SQLite",
      items: [
        { th: "งาน", en: "Tasks" },
        { th: "event ดิบ", en: "Raw events" },
        { th: "การตัดสินใจของด่านตรวจ", en: "Gate decisions" },
      ],
    },
    workers: {
      name: { th: "Workers", en: "Workers" },
      tech: "Claude Code",
      items: [
        { th: "หนึ่ง pool ต่อหนึ่งบัญชี", en: "One pool per account" },
        { th: "จำกัดงานพร้อมกันต่อบัญชี", en: "Concurrency cap per account" },
        { th: "hook ถามด่านตรวจก่อนทุก tool call", en: "Hook asks the gate before each tool call" },
      ],
    },
    links: {
      boardControl: { th: "HTTP + SSE", en: "HTTP + SSE" },
      controlStore: { th: "อ่าน/เขียน", en: "read / write" },
      controlWorkers: { th: "แจกงาน · ถามด่านตรวจ", en: "dispatch · gate check" },
    },
  },

  gateTitle: { th: "ด่านตรวจจัดประเภท SQL อย่างไร", en: "How the gate classifies SQL" } satisfies Bi,
  gate: [
    { kind: "read", label: { th: "อ่านอย่างเดียว", en: "Read" }, rule: { th: "ผ่านได้เลย", en: "Passes" }, tone: "pass" },
    { kind: "data-write", label: { th: "แก้ข้อมูล", en: "Data write" }, rule: { th: "ต้องมีสิทธิ์และบันทึก", en: "Needs permission, recorded" }, tone: "hold" },
    { kind: "schema-create", label: { th: "สร้างโครงสร้าง", en: "Schema create" }, rule: { th: "ต้องมีสิทธิ์และบันทึก", en: "Needs permission, recorded" }, tone: "hold" },
    { kind: "destructive", label: { th: "ลบหรือทำลาย", en: "Destructive" }, rule: { th: "ต้องมีสิทธิ์และบันทึก", en: "Needs permission, recorded" }, tone: "stop" },
  ] satisfies { kind: string; label: Bi; rule: Bi; tone: "pass" | "hold" | "stop" }[],
  gateNote: {
    th: "คำสั่งกำกวมถูกนับเป็นต้องตรวจไว้ก่อน และถ้าด่านตรวจจับคู่คำสั่งกับงานไม่ได้ จะปฏิเสธทันที งานจาก ticket ซึ่งคนนอกทีมเป็นคนเขียนคำขอ ถูกตรวจเข้มกว่างานที่ผมสั่งเอง",
    en: "Anything ambiguous is treated as needing a check, and a call the gate can't match to a task is refused. Ticket work, whose request was written by someone outside the team, is gated harder than work I typed myself.",
  } satisfies Bi,

  deployTitle: { th: "การขึ้นระบบ", en: "Release" } satisfies Bi,
  deploy: [
    { th: "ทดสอบบน UAT", en: "Smoke on UAT" },
    { th: "ขึ้น UAT", en: "Deploy to UAT" },
    { th: "ทดสอบบน production", en: "Smoke on production" },
    { th: "ขึ้น production", en: "Deploy to production" },
  ] satisfies Bi[],
  deployNote: {
    th: "เดินทีละขั้นเท่านั้น ข้ามหรือสลับลำดับไม่ได้ ขั้นไหนล้ม ขั้นที่เหลือจะหยุด และนอกช่วงเวลาที่ตั้งไว้ ขั้นสุดท้ายต้องรอคนอนุมัติ ไม่มีการอนุมัติเองเมื่อหมดเวลา",
    en: "Strictly one stage after another, with no skip or reorder. A failure halts the rest, and outside the set window the last stage waits for a person; nothing approves itself on a timeout.",
  } satisfies Bi,

  stats: [
    { value: "761", label: { th: "งานที่ AI agent ทำผ่านเครื่องมือนี้ 15–28 ก.ย. 2026", en: "jobs AI agents ran through it, 15–28 Sep 2026" } },
    { value: "97%", label: { th: "ของงานชุดนั้นจบสำเร็จ", en: "of those finished successfully" } },
    { value: "324", label: { th: "test ฝั่ง backend ที่ผ่าน ใน 31 ไฟล์", en: "passing backend tests across 31 files" } },
  ] satisfies { value: string; label: Bi }[],
  status: {
    th: "ยังเป็นเครื่องมือทดลองใน repo ส่วนตัว ผมใช้กับงานของตัวเอง",
    en: "Still an experimental tool in a private repo, used for my own work.",
  } satisfies Bi,
  stack: ["TypeScript", "Hono", "Next.js", "SQLite", "SSE", "Claude Code hooks"],
};
