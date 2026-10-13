// The one project shown on the home page: Kobnub (repo: motor-management).
// Every claim here was checked in the code on 2026-10-11; numbers were measured, not
// copied from the repo's own docs (which go stale). Keep customer names, branch names,
// money figures and production hosts out of this file.

type Bi = { th: string; en: string };

export const featured = {
  name: "Kobnub",
  url: "https://kobnub.io",
  since: { th: "ก.ย. 2025 – ปัจจุบัน", en: "Sep 2025 – Present" } satisfies Bi,
  tagline: {
    th: "ระบบหลังร้านบนเว็บสำหรับร้านค้าและร้านมอเตอร์ไซค์ไฟฟ้า ขาย ออกเอกสาร ตัดสต็อก และลงบัญชีได้ในที่เดียว",
    en: "A web back office for Thai shops and electric-motorcycle dealers: selling, documents, stock and accounting in one place.",
  } satisfies Bi,
  body: {
    th: "ผมเริ่มเขียนเองตั้งแต่ ก.ย. 2025 และเป็นคนเขียนเกือบทั้งหมด ตอนนี้ใช้งานจริงอยู่ที่ kobnub.io",
    en: "I started it in September 2025 and wrote nearly all of it. It's live at kobnub.io.",
  } satisfies Bi,
  stack: ["Next.js 16", "React 19", "TypeScript", "Express", "MariaDB", "Cloudflare R2", "OpenAPI", "Jest", "Playwright"],
};
