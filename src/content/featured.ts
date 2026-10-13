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
  // Measured from the code: OpenAPI spec, schema manifest, app routes, git ls-files.
  scale: [
    { value: "766", label: { th: "API endpoint", en: "API endpoints" } },
    { value: "152", label: { th: "ตารางใน MariaDB", en: "MariaDB tables" } },
    { value: "196", label: { th: "หน้าในแอป", en: "app pages" } },
    { value: "~1,700", label: { th: "ไฟล์ test", en: "test files" } },
  ],
  sections: [
    {
      title: { th: "ระบบทำอะไร", en: "What it does" },
      body: {
        th: "ขาย จอง รับของ โอนสต็อก ซื้อของและจ่ายซัพพลายเออร์ ตัดสต็อกแบบ FIFO และลงบัญชีคู่ มีงบทดลอง งบดุล งบกำไรขาดทุน และงบกระแสเงินสด กรอก ภ.พ.30 ลงแบบฟอร์ม PDF ของกรมสรรพากร และออก ภ.ง.ด.3/53 ส่วนร้านมอเตอร์ไซค์มีประกัน เคลม recall และติดตามรถลูกค้า มี CRM ที่ต่อกับ LINE หลายสาขาแยกสิทธิ์ตามบทบาท และรองรับ PDPA",
        en: "Sales, bookings, goods receiving, stock transfers, purchasing and supplier payments. Stock is costed FIFO and every movement posts double-entry, with a trial balance, balance sheet, income statement and cash flow. PP.30 is filled into the Revenue Department's PDF form and PND.3/53 are generated. Dealers get warranties, claims, recalls and customer-vehicle tracking; there's a LINE-connected CRM, multi-branch role-based access and PDPA handling.",
      } satisfies Bi,
    },
    {
      title: { th: "เงินกับสต็อกต้องไม่เพี้ยน", en: "Keeping money and stock right" },
      body: {
        th: "ทุกการกระทำที่แตะเงินหรือสต็อกจะลงสมุดบัญชีเสมอ ใน transaction ที่ล็อกแถวไว้ บัญชีที่ลงแล้ว database ไม่ยอมให้แก้หรือลบ เพราะมี trigger กันไว้ ประวัติการแก้ไขเขียนต่อท้ายได้อย่างเดียวและร้อยกันด้วย HMAC ถ้ามีใครย้อนไปแก้จะรู้ทันที และเลขที่เอกสารออกได้จากที่เดียวเท่านั้น",
        en: "Anything that touches money or stock posts to the ledger, inside a transaction with the rows locked. Once a journal is posted the database refuses to change or delete it, enforced by triggers. The audit log is append-only and HMAC-chained, so a rewrite of history shows. Document numbers come from exactly one place.",
      } satisfies Bi,
    },
    {
      title: { th: "กติกาที่เครื่องบังคับ", en: "Rules machines enforce" },
      figure: true,
      body: {
        th: "ระบบขนาดนี้ผมดูแลเกือบคนเดียว เลยให้เครื่องเป็นคนคุมกติกา: เอกสารที่บอกว่าส่วนไหนห้ามแตะ test ที่ไม่ยอมรันกับ database ที่ไม่ใช่ของทดสอบ ด่านตรวจ 28 ขั้นก่อน deploy และ ratchet คือตัวเลขที่ commit ไว้ใน repo และยอมให้ลดลงอย่างเดียว เช่นจำนวน query ที่ลืมกรองตามบริษัท ถ้าการแก้ไขทำให้ตัวเลขเกินเพดาน commit จะไม่ผ่าน",
        en: "I run a system this size almost alone, so machines enforce the rules: docs saying what must not be touched, tests that refuse to run against anything but a test database, a 28-step gate before deploy, and ratchets, counts committed to the repo that may only go down, such as queries that forget to filter by company. A change that pushes a count over its limit can't be committed.",
      } satisfies Bi,
    },
    {
      title: { th: "เรื่องที่ได้เรียนรู้", en: "Things I learned" },
      body: {
        th: "เคยมีตัวจัดรูปแบบเลขที่เอกสารอยู่ 5 ชุด ก่อนลบให้เหลือชุดเดียว ผมเทียบกับรูปแบบที่ใช้จริงทั้งหมด 1,674 กรณี ผลตรงกันทุกกรณี อีกเรื่องคือ ratchet ที่ตรวจว่า query กรองตามบริษัท เคยผ่านแค่มีคำว่า company_id อยู่ในข้อความ เลยรายงานว่าเหลือ 0 จุด พอให้มันตรวจจริงจัง ตัวเลขขึ้นเป็น 36 ตัวตรวจที่ผ่านไม่ได้แปลว่าโค้ดถูก",
        en: "There used to be five document-number formatters. Before deleting four, I compared the survivor against every pattern in real use: 1,674 cases, no differences. Another time, the ratchet that checks queries filter by company passed any SQL containing the text company_id, so it read 0. Made to check properly, it read 36. A passing check isn't the same as correct code.",
      } satisfies Bi,
    },
  ],
  stack: ["Next.js 16", "React 19", "TypeScript", "Express", "MariaDB", "Cloudflare R2", "OpenAPI", "Jest", "Playwright"],
};
