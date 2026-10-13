import type { Locale } from "./config";

export type ImpactStat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

// All UI copy for both languages. The Thai object is the shape the English one must match.

const th = {
  meta: {
    description:
      "Software engineer ในกรุงเทพฯ สร้างระบบงานคลังสินค้า การจัดส่ง และงานปฏิบัติการที่ใช้งานจริง ทั้งเว็บ API แอปมือถือ และฐานข้อมูล",
  },
  nav: { skills: "สกิล", projects: "ผลงาน", experience: "ประสบการณ์", research: "งานวิจัย", contact: "ติดต่อ", switchTo: "English", menu: "เมนู" },
  profile: {
    name: "วรรษพรรษ ทองโสภา",
    role: "Software Engineer · Full-stack & AI",
    location: "กรุงเทพฯ",
    tagline:
      "ผมสร้างระบบงานปฏิบัติการที่คนใช้ทำงานกันทุกวัน เริ่มจากดูว่างานหน้างานเกิดขึ้นจริงอย่างไร แล้วแปลงเป็นซอฟต์แวร์ที่อยู่บน production ได้อย่างมั่นคง",
    about: [
      "ตอนนี้ผมทำงานที่ Beger ดูแลระบบเบื้องหลังงานคลังสินค้า การจัดส่ง และงานขนส่ง มีทั้งเว็บแอป Next.js, .NET API, แอป Flutter บนเครื่องสแกน RF และมือถือของคนขับ และงาน SQL Server อีกมาก",
      "ก่อนหน้านั้นผมสร้างระบบลงทะเบียนผู้มาติดต่อด้วย AI ที่ Bangkok Medical Software รวมถึง OCR อ่านบัตรประชาชน และเคยทำวิจัยการแบ่งส่วนภาพทางการแพทย์ที่เกาหลีจนได้รางวัล Best Paper",
      "ผมใช้ AI coding agent อย่าง Claude Code และ Codex เป็นประจำ และลงแรงกับ skill, harness และด่านตรวจรอบ ๆ มัน เพื่อให้ได้ความเร็วโดยไม่ต้องแลกกับคุณภาพ",
    ],
  },
  impact: [
    { value: 100, suffix: "+", label: "คนขับที่ใช้แอปส่งของที่ผมทำใหม่" },
    { value: 2, prefix: "10+ → ", label: "คลิกในการจองช่วงเวลาส่งของ จากเดิมมากกว่า 10" },
    { value: 0, label: "downtime ตอนย้ายระบบ WinForms ไป Next.js" },
    { value: 23, label: "skill ที่กำกับ AI agent ใน codebase" },
    { value: 94.08, decimals: 2, suffix: "%", label: "Dice สูงสุดในงานวิจัยแบ่งส่วนภาพ CT หัวใจที่ตีพิมพ์แล้ว" },
  ] as ImpactStat[],
  hero: {
    viewProjects: "ดูประสบการณ์",
    contact: "ติดต่อผม",
    resume: "เรซูเม่",
    layersCaption: "request → response",
    layers: { FE: "Frontend", BE: "Backend", DB: "Database" },
  },
  sections: {
    impact: { eyebrow: "In production", title: "ตัวเลขจากงานที่ใช้งานจริง" },
    about: { eyebrow: "About", title: "ตั้งแต่หน้างานถึงฐานข้อมูล" },
    skills: { eyebrow: "Skills", title: "เครื่องมือที่ใช้ประจำ" },
    projects: { eyebrow: "Projects", title: "ผลงานที่เลือกมา" },
    experience: { eyebrow: "Experience", title: "ประสบการณ์ทำงาน" },
    research: { eyebrow: "Research & education", title: "งานวิจัยและการศึกษา" },
    contact: { eyebrow: "Contact", title: "คุยกันได้" },
  },
  research: {
    publicationLabel: "บทความวารสาร",
    conferenceLabel: "บทความงานประชุมวิชาการ",
    awardLabel: "รางวัล",
    resultsTitle: "ผลการทดลอง",
    findingsTitle: "สิ่งที่พบ",
    tableView: "ดูเป็นตาราง",
    myRole: "ผู้เขียนร่วม",
    educationLabel: "การศึกษา",
    degree: "วิทยาศาสตรบัณฑิต (วิทยาการคอมพิวเตอร์)",
    school: "มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา",
    graduated: "ก.ค. 2021 ถึง มี.ค. 2025",
    languages: "ภาษาไทย (ภาษาแม่) · English (TOEIC 610)",
    readPaper: "หน้าวารสาร",
    previewPaper: "อ่านบทความ",
    doi: "DOI",
    viewer: {
      back: "กลับไปหน้าแรก",
      download: "ดาวน์โหลด PDF",
      journal: "เปิดในเว็บวารสาร",
      page: "หน้า",
      of: "จาก",
      prev: "หน้าก่อน",
      next: "หน้าถัดไป",
      zoomIn: "ขยาย",
      zoomOut: "ย่อ",
      fit: "พอดีความกว้าง",
      loading: "กำลังโหลดบทความ…",
      error: "แสดงตัวอย่างไม่ได้ ดาวน์โหลดไฟล์ PDF แทนได้",
      license: "© ผู้เขียน เผยแพร่ใน Proceedings of Engineering and Technology Innovation ภายใต้สัญญาอนุญาต CC BY-NC 4.0",
    },
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
      "Software engineer in Bangkok building warehouse, dispatch and operations systems that run in production, across web, APIs, mobile apps and databases.",
  },
  nav: { skills: "Skills", projects: "Projects", experience: "Experience", research: "Research", contact: "Contact", switchTo: "ภาษาไทย", menu: "Menu" },
  profile: {
    name: "Wassaphas Thongsopa",
    role: "Software Engineer · Full-stack & AI",
    location: "Bangkok, Thailand",
    tagline:
      "I build the operational systems people run their workday on. I start from how the work actually happens, then turn it into software that holds up in production.",
    about: [
      "I work at Beger on the systems behind the warehouse, dispatch and delivery operation: Next.js web apps, .NET APIs, Flutter apps on RF scanners and drivers' phones, and a lot of SQL Server.",
      "Before that I built an AI visitor-gate system at Bangkok Medical Software, including its Thai ID card OCR, and did medical image segmentation research in Korea that won a best paper award.",
      "I lean on AI coding agents such as Claude Code and Codex, and I put real effort into the skills, harnesses and checks around them so the speed doesn't cost quality.",
    ],
  },
  impact: [
    { value: 100, suffix: "+", label: "drivers on the delivery app I rebuilt" },
    { value: 2, prefix: "10+ → ", label: "clicks to book a delivery slot, down from more than 10" },
    { value: 0, label: "downtime moving a WinForms system to Next.js" },
    { value: 23, label: "routing-matched skills guarding AI agents in the codebase" },
    { value: 94.08, decimals: 2, suffix: "%", label: "top Dice score in my published cardiac CT segmentation study" },
  ],
  hero: {
    viewProjects: "View experience",
    contact: "Get in touch",
    resume: "Résumé",
    layersCaption: "request → response",
    layers: { FE: "Frontend", BE: "Backend", DB: "Database" },
  },
  sections: {
    impact: { eyebrow: "In production", title: "Numbers from work people use" },
    about: { eyebrow: "About", title: "From the shop floor to the database" },
    skills: { eyebrow: "Skills", title: "Tools I use day to day" },
    projects: { eyebrow: "Projects", title: "Selected work" },
    experience: { eyebrow: "Experience", title: "Where I've worked" },
    research: { eyebrow: "Research & education", title: "Research and education" },
    contact: { eyebrow: "Contact", title: "Get in touch" },
  },
  research: {
    publicationLabel: "Journal article",
    conferenceLabel: "Conference paper",
    awardLabel: "Award",
    resultsTitle: "Results",
    findingsTitle: "What we found",
    tableView: "Show as a table",
    myRole: "Co-author",
    educationLabel: "Education",
    degree: "B.Sc. in Computer Science",
    school: "Kasetsart University, Sriracha Campus",
    graduated: "Jul 2021 to Mar 2025",
    languages: "Thai (native) · English (TOEIC 610)",
    readPaper: "Journal page",
    previewPaper: "Read the paper",
    doi: "DOI",
    viewer: {
      back: "Back home",
      download: "Download PDF",
      journal: "Open on the journal site",
      page: "Page",
      of: "of",
      prev: "Previous page",
      next: "Next page",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      fit: "Fit width",
      loading: "Loading the paper…",
      error: "The preview couldn't load. You can download the PDF instead.",
      license: "© the authors. Published in Proceedings of Engineering and Technology Innovation under CC BY-NC 4.0.",
    },
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
