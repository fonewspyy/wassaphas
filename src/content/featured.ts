// The one project shown on the home page. Facts come from the product site (kobnub.io)
// and the repository (commit counts as of 2026-10); keep them checkable.

type Bi = { th: string; en: string };

export const featured = {
  name: "Kobnub",
  url: "https://kobnub.io",
  since: { th: "ก.ย. 2025 – ปัจจุบัน", en: "Sep 2025 – Present" },
  tagline: {
    th: "ระบบหลังร้านบนเว็บสำหรับร้านค้าและร้านมอเตอร์ไซค์ไฟฟ้า ขาย ออกเอกสาร ตัดสต็อก และลงบัญชีได้ในที่เดียว",
    en: "A web back office for Thai shops and electric-motorcycle dealers: selling, documents, stock and accounting in one place.",
  } satisfies Bi,
  body: {
    th: "ผมเริ่มเขียนเองตั้งแต่ ก.ย. 2025 และเป็นคนเขียนเกือบทั้งหมด ระบบคุมงานของแต่ละสาขาตั้งแต่ขาย จอง รับของ โอนสต็อก ไปจนถึงการเงินและบัญชี ขายแล้วตัดสต็อกแบบ FIFO และลงบัญชีคู่ให้เอง ไม่ต้องคีย์ซ้ำ ออกแบบฟอร์มภาษี ภ.พ.30 และ ภ.ง.ด.3/53 ได้ ส่วนร้านมอเตอร์ไซค์มีติดตามเลขตัวถัง ประกัน และงานจดทะเบียน",
    en: "I started it in September 2025 and wrote nearly all of it. It runs each branch from sales, bookings and goods receiving through stock transfers to finance and accounting. A sale cuts stock FIFO and posts the double-entry journal itself, so nothing is keyed twice. It prepares the PP.30 and PND.3/53 tax forms, and dealers get VIN tracking, warranties and registration.",
  } satisfies Bi,
  facts: [
    { value: "2,787 / 2,814", label: { th: "commit ที่เป็นของผม", en: "commits that are mine" } },
    { value: "FIFO", label: { th: "ตัดสต็อกและลงบัญชีคู่อัตโนมัติ", en: "stock costing, auto double-entry" } },
    { value: "RBAC", label: { th: "หลายสาขา แยกสิทธิ์ตามบทบาท", en: "multi-branch, role-based access" } },
  ],
  stack: ["Next.js 16", "React 19", "TypeScript", "Express", "MariaDB", "Cloudflare R2", "OpenAPI"],
};
