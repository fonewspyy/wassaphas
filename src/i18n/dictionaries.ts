import type { Locale } from "./config";

// All UI copy for both languages. The Thai object is the shape the English one must match.

const th = {
  meta: {
    description:
      "Full-stack developer ในกรุงเทพฯ ทำเว็บครบตั้งแต่หน้าบ้าน API ไปจนถึงฐานข้อมูล และสร้างเครื่องมือสำหรับ AI coding agent",
  },
  nav: { skills: "สกิล", projects: "ผลงาน", experience: "ประสบการณ์", contact: "ติดต่อ", switchTo: "English" },
  profile: {
    role: "Full-Stack Developer & AI Builder",
    location: "กรุงเทพฯ",
    tagline:
      "ผมทำระบบเว็บได้ครบทั้งหน้าบ้าน หลังบ้าน และฐานข้อมูล ช่วงหลังใช้เวลาส่วนใหญ่ไปกับการสร้าง AI agent ที่ช่วยงานวิศวกรรมได้จริง",
    about: [
      "หน้าบ้านผมใช้ React กับ Next.js เป็นหลัก หลังบ้านเป็น Node.js และ Python ส่วนฐานข้อมูลใช้ทั้ง MariaDB และ PostgreSQL ไปจนถึงเขียน stored procedure บน SQL Server",
      "ตอนนี้งานที่ทำเยอะที่สุดคือเครื่องมือสำหรับ AI coding agent เช่น orchestrator ที่กระจายงานไปหลายบัญชี และหยุดคำสั่ง SQL ที่เสี่ยงไว้ให้คนอนุมัติก่อนรัน",
      "ผมชอบทำต้นแบบให้ใช้งานได้เร็ว ๆ ก่อน แล้วค่อยกลับมาเก็บรายละเอียดให้พร้อมขึ้น production",
    ],
  },
  hero: {
    viewProjects: "ดูผลงาน",
    contact: "ติดต่อผม",
    resume: "เรซูเม่",
    layersCaption: "request → response",
    layers: { FE: "Frontend", BE: "Backend", DB: "Database" },
  },
  sections: {
    about: { eyebrow: "About", title: "ตั้งแต่หน้าเว็บถึงฐานข้อมูล" },
    skills: { eyebrow: "Skills", title: "เครื่องมือที่ใช้ประจำ" },
    projects: { eyebrow: "Projects", title: "ผลงานที่เลือกมา" },
    experience: { eyebrow: "Experience", title: "ประสบการณ์ทำงาน" },
    contact: { eyebrow: "Contact", title: "คุยกันได้" },
  },
  skills: {
    frontend: "Frontend",
    backend: "Backend",
    database: "Database",
    ai: "AI และ Agent",
    devops: "DevOps",
  },
  projects: {
    empty: "กำลังเพิ่มผลงาน",
    featured: "ผลงานเด่น",
    details: "รายละเอียด",
    live: "เว็บไซต์",
    code: "โค้ด",
    allProjects: "ผลงานทั้งหมด",
    highlights: "สิ่งที่ทำ",
    stack: "เทคโนโลยี",
    visitLive: "เปิดเว็บไซต์",
    viewSource: "ดูซอร์สโค้ด",
    privateSource: "โค้ดของโปรเจกต์นี้ไม่ได้เปิดเป็นสาธารณะ ถ้าสนใจผมเล่ารายละเอียดให้ฟังตอนสัมภาษณ์ได้",
    notFoundTitle: "ไม่พบผลงานนี้",
  },
  contact: {
    blurb:
      "ถ้ากำลังหาคนตำแหน่ง full-stack หรือ AI engineer หรือมีโปรเจกต์อยากคุยด้วย ส่งข้อความมาได้เลย ผมจะตอบกลับทางอีเมล",
    name: "ชื่อ",
    email: "อีเมล",
    message: "ข้อความ",
    placeholder: "ตำแหน่งที่เปิดรับ โปรเจกต์ที่อยากทำ หรือแค่ทักมาก็ได้",
    send: "ส่งข้อความ",
    sending: "กำลังส่ง…",
    sentTitle: "ได้รับข้อความแล้ว ขอบคุณครับ",
    sentBody: "ผมจะตอบกลับโดยเร็ว",
    sendAnother: "ส่งข้อความอีกครั้ง",
    errors: {
      name_required: "กรุณากรอกชื่อ",
      email_invalid: "รูปแบบอีเมลไม่ถูกต้อง",
      message_too_short: "ข้อความสั้นเกินไป (อย่างน้อย 10 ตัวอักษร)",
      too_long: "ข้อความยาวเกินไป",
      rate_limited: "ส่งถี่เกินไป ลองใหม่อีกครั้งในอีกไม่กี่นาที",
      not_configured: "ฟอร์มติดต่อยังไม่พร้อมใช้งาน",
      network: "เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง",
      generic: "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง",
    },
  },
  footer: { builtWith: "สร้างด้วย Next.js และ MariaDB", source: "ซอร์สโค้ด" },
  notFound: {
    title: "ไม่พบหน้านี้",
    body: "หน้านี้ไม่มีอยู่ หรือยังไม่ได้เผยแพร่",
    back: "กลับหน้าแรก",
  },
};

export type Dictionary = typeof th;

const en: Dictionary = {
  meta: {
    description:
      "Full-stack developer in Bangkok. I build web apps from the front end through the API to the database, plus tooling for AI coding agents.",
  },
  nav: { skills: "Skills", projects: "Projects", experience: "Experience", contact: "Contact", switchTo: "ภาษาไทย" },
  profile: {
    role: "Full-Stack Developer & AI Builder",
    location: "Bangkok, Thailand",
    tagline:
      "I build web systems across the front end, the API and the database. Lately most of my time goes into AI agents that do real engineering work.",
    about: [
      "On the front end I mostly use React and Next.js. Behind that I write Node.js and Python services, and underneath I work with MariaDB, PostgreSQL and SQL Server stored procedures.",
      "My main focus right now is tooling for AI coding agents, such as an orchestrator that spreads tasks across several accounts and holds any risky SQL statement until a person approves it.",
      "I like to get a working prototype out quickly, then go back and make it solid enough for production.",
    ],
  },
  hero: {
    viewProjects: "View projects",
    contact: "Get in touch",
    resume: "Résumé",
    layersCaption: "request → response",
    layers: { FE: "Frontend", BE: "Backend", DB: "Database" },
  },
  sections: {
    about: { eyebrow: "About", title: "From the UI down to the database" },
    skills: { eyebrow: "Skills", title: "Tools I use day to day" },
    projects: { eyebrow: "Projects", title: "Selected work" },
    experience: { eyebrow: "Experience", title: "Where I've worked" },
    contact: { eyebrow: "Contact", title: "Get in touch" },
  },
  skills: {
    frontend: "Frontend",
    backend: "Backend",
    database: "Database",
    ai: "AI & agents",
    devops: "DevOps",
  },
  projects: {
    empty: "Projects are on their way.",
    featured: "Featured",
    details: "Details",
    live: "Live",
    code: "Code",
    allProjects: "All projects",
    highlights: "What I did",
    stack: "Stack",
    visitLive: "Visit the site",
    viewSource: "View source",
    privateSource: "The source code isn't public. I'm happy to walk through it in an interview.",
    notFoundTitle: "Project not found",
  },
  contact: {
    blurb:
      "If you're hiring for a full-stack or AI engineering role, or have a project in mind, send a message and I'll reply by email.",
    name: "Name",
    email: "Email",
    message: "Message",
    placeholder: "A role you're hiring for, a project, or just hello.",
    send: "Send message",
    sending: "Sending…",
    sentTitle: "Thanks, your message is in.",
    sentBody: "I'll get back to you soon.",
    sendAnother: "Send another message",
    errors: {
      name_required: "Please enter your name",
      email_invalid: "Please enter a valid email",
      message_too_short: "Message is too short (10 characters minimum)",
      too_long: "Message is too long",
      rate_limited: "Too many messages. Please try again in a few minutes.",
      not_configured: "The contact form isn't set up yet.",
      network: "Network error. Please try again.",
      generic: "Something went wrong. Please try again.",
    },
  },
  footer: { builtWith: "Built with Next.js and MariaDB", source: "source" },
  notFound: {
    title: "Nothing here",
    body: "That page doesn't exist or isn't published.",
    back: "Back home",
  },
};

const dictionaries: Record<Locale, Dictionary> = { th, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type ContactErrorCode = keyof Dictionary["contact"]["errors"];
