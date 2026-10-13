// The one project shown on the home page: Kobnub (repo: motor-management).
// Every claim here was checked in the code on 2026-10-11; numbers were measured, not
// copied from the repo's own docs (which go stale). The one customer named here was
// supplied by the owner; keep other customer names, branch names, money figures and
// production hosts out of this file.

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
    th: "ผมเริ่มเขียนเองตั้งแต่ ก.ย. 2025 และเป็นคนเขียนเกือบทั้งหมด",
    en: "I started it in September 2025 and wrote nearly all of it.",
  } satisfies Bi,
  client: {
    name: "I3 EV BIKE",
    url: "https://www.facebook.com/i3evbiketh",
    label: { th: "ใช้งานจริงที่", en: "In use at" } satisfies Bi,
    note: {
      th: "บริษัท สามมหาเศรษฐี จำกัด ตัวแทนจำหน่ายมอเตอร์ไซค์ไฟฟ้า ลพบุรี",
      en: "an electric-motorcycle dealer in Lop Buri",
    } satisfies Bi,
  },
  shot: {
    src: "/work/i3-ev-bike.png",
    width: 1919,
    height: 908,
    alt: {
      th: "หน้าเว็บของ I3 EV BIKE ร้านมอเตอร์ไซค์ไฟฟ้าที่ใช้ Kobnub",
      en: "The I3 EV BIKE website, an electric-motorcycle dealer that uses Kobnub",
    } satisfies Bi,
    caption: { th: "หน้าเว็บของร้านที่ใช้ Kobnub", en: "The website of a dealer using Kobnub" } satisfies Bi,
    open: { th: "ดูภาพเต็ม", en: "View full size" } satisfies Bi,
    close: { th: "ปิด", en: "Close" } satisfies Bi,
  },
  stack: ["Next.js 16", "React 19", "TypeScript", "Express", "MariaDB", "Cloudflare R2", "OpenAPI", "Jest", "Playwright"],
};
