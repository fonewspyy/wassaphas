// Case studies shown on the home page and at /case-studies/[slug].
//
// What may appear here, and what may not:
// - Usage numbers are rounded production counts for the 90 days to 13 Oct 2026, from a
//   read-only aggregate query (counts only). Round them; never publish exact figures.
// - The scanner before/after figures (open-status rate, p90 scan span, invalid attempts)
//   compare Jul–Dec 2025 with Apr–early Jul 2026, from the read-only KPI queries of
//   Jul 2026. Small bases: always give the period and say "after go-live", never "caused".
// - Code-size numbers come from git history and the code itself.
// - Never name a database, table, stored procedure, server, host, customer or partner,
//   and never describe a security weakness, even a fixed one.
// - Each study opens with the problem as the people doing the work saw it.

type Bi = { th: string; en: string };

export type CaseStat = { value: string; label: Bi };
export type Decision = { title: Bi; body: Bi };
// Labels live in the dictionary (caseStudies.tags).
export type CaseTag = "analysis" | "process" | "ai" | "engineering";

export type CaseStudy = {
  slug: string;
  org: string;
  period: Bi;
  tags: CaseTag[];
  title: Bi;
  summary: Bi;
  role: Bi;
  problem: Bi;
  decisions: Decision[];
  stats: CaseStat[];
  statsNote: Bi;
  tradeoff: Bi;
  lesson: Bi;
  stack: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "beger-transport",
    org: "Beger",
    period: { th: "ม.ค. 2026 – ปัจจุบัน", en: "Jan 2026 – Present" },
    tags: ["analysis", "engineering"],
    title: {
      th: "ระบบขนส่ง: จากโปรแกรม desktop เป็นแอปคนขับและหลังบ้านบนเว็บ",
      en: "Transport: from a desktop program to a driver app and a web back office",
    },
    summary: {
      th: "งานจัดรถ คิวรถ ส่งของ และวางบิลค่าขนส่งอยู่ในโปรแกรม desktop ตัวเดียวที่รองรับงานที่โตขึ้นไม่ไหว ส่วนแอปคนขับเดิม รับบิลแต่ละใบต้องรอราว 5 วินาที ผมย้ายงานเหล่านี้มาเป็นเว็บหลังบ้าน API และแอปคนขับทีละส่วน ระหว่างที่งานส่งของยังเดินอยู่ เพราะรับผิดชอบเองตั้งแต่ต้นจนจบ ผมจึงวางทางถอยและด่านตรวจไว้ก่อนทุกการเปลี่ยน แล้วใช้ AI ช่วยลงแรงในส่วนที่เหลือ",
      en: "Dispatch, the truck queue, deliveries and freight billing all ran in one desktop program that could no longer keep up as the work grew, and in the old driver app each bill took about five seconds to come through. I moved the work to a web back office, an API and a driver app, one piece at a time, while deliveries kept running. Owning it end to end, I put the way back and the checks in place before every change, and let AI carry the rest of the load.",
    },
    role: {
      th: "ทำเกือบทั้งหมดเองตั้งแต่ต้นจนจบ: วิเคราะห์งาน ออกแบบ เขียนเว็บหลังบ้าน API และแอปคนขับ ขึ้นระบบ และตามแก้หลังเปิดใช้",
      en: "Nearly all of it, end to end: analysis, design, back office, API and driver app, release, and fixes after go-live",
    },
    problem: {
      th: "ทุกวันมีรถออกจากโรงงานหลายสิบเที่ยว ระบบเดิมเป็นโปรแกรม desktop ที่ใช้ได้เฉพาะเครื่องในออฟฟิศ รองรับงานที่โตขึ้นไม่ไหว และจะเพิ่มหรือแก้อะไรก็ยาก แอปคนขับที่มีอยู่ รับบิลแต่ละครั้งต้องรอราว 5 วินาที คนขับที่ยืนอยู่หน้างานรอแบบนั้นไม่ได้ และระบบต้องเปลี่ยนระหว่างที่งานยังวิ่งอยู่ จะปิดระบบไปก่อนไม่ได้",
      en: "Dozens of trucks leave the plant every day. The old system was a desktop program that only ran on office PCs, could no longer keep up as the work grew, and was hard to change. In the existing driver app each bill took about five seconds to come through, too slow for a driver standing on the job. And it had to be replaced while the work kept running; switching it off first was not an option.",
    },
    decisions: [
      {
        title: { th: "ระบบเดิมไม่ได้แย่ แต่มีช่องว่าง", en: "The old system wasn't bad; it had gaps" },
        body: {
          th: "ระบบเดิมใช้งานได้ แต่กติกากระจายอยู่หลายหน้าจอ งานไม่มีเจ้าของชัด และไม่มีบันทึกว่าใครทำอะไร ระบบที่เชื่อมกันจึงเห็นสถานะไม่ตรงกัน และหน้างานตรวจย้อนหลังไม่ได้ ผมจึงออกแบบใหม่ทั้ง pipeline ตั้งแต่คลังถึงบัญชี ให้ทุกขั้นมีเจ้าของสถานะและมีบันทึก",
          en: "The old system worked, but its rules were spread across many screens, jobs had no clear owner, and nothing recorded who did what. Linked systems disagreed about status and the floor couldn't look back. So I redesigned the whole pipeline, warehouse to accounting, giving every step an owner for its status and a record.",
        },
      },
      {
        title: { th: "ขึ้นทีละส่วน ถอยได้ทุกเมื่อ", en: "Ship piece by piece, always able to back out" },
        body: {
          th: "เปิดระบบเก่าและใหม่คู่กัน ทุกการเปลี่ยนผ่านระบบทดสอบก่อน และ 332 จาก 386 ชุดมีสคริปต์ rollback ตลอดการย้าย API หยุดครั้งเดียวราว 1 นาที การแก้ข้อมูลจริงต้องดูตัวอย่างก่อนทุกครั้ง แถวไหนกำกวม ผมกันไว้ให้คนตรวจ",
          en: "Old and new ran side by side, every change went through the test system first, and 332 of 386 change sets had a rollback script. The API went down once in the whole move, for about a minute. Fixes to live data always start with a preview, and anything ambiguous is held back for a person to check.",
        },
      },
      {
        title: { th: "เร็วขึ้นได้ แต่ผลต้องเหมือนเดิม", en: "Faster, but the same result" },
        body: {
          th: "ผมจูน stored procedure โดยไล่ execution plan ดู CPU และ logical reads query หนึ่งลดจาก 1,377 เหลือ 217 ms โดยผลไม่เปลี่ยน ตัวไหนเร็วขึ้นแต่ผลบน production ไม่ตรงกับเดิม ผมถอยกลับ",
          en: "I tune stored procedures by walking the execution plan for CPU and logical reads. One query went from 1,377 to 217 ms with the same result. When a faster version didn't match the old result in production, I rolled it back.",
        },
      },
      {
        title: { th: "เก็บ requirement กับคนขับเอง", en: "Requirements straight from the drivers" },
        body: {
          th: "ผมลงไปคุยกับคนขับเองว่างานจริงติดตรงไหน แอปจึงรับงาน เช็กอิน และถ่ายรูปส่งของได้ในที่เดียว และแนบรูปทีหลังได้ ไม่ต้องถ่ายตอนยังถือถังสีอยู่หน้าบ้านลูกค้า",
          en: "I talked to the drivers myself about where their day gets stuck. So the app takes jobs, checks in and photographs deliveries in one place, and photos can be added later instead of at the customer's door with a paint bucket in hand.",
        },
      },
      {
        title: { th: "รายงานสดและแจ้งเตือน", en: "Live reports and alerts" },
        body: {
          th: "หัวหน้าแต่ละแผนกดูรายงานสด และดึงข้อมูลไปใช้เองได้ ไม่ต้องขอ IT ระบบเตือนเรื่องที่มักลืม เช่น รถเช็กอินที่ประตูโหลด หรือใบรับรองคุณภาพที่ค้าง",
          en: "Each department head sees a live report and can pull the data themselves without asking IT. The system flags what people tend to forget, such as a truck checking in at a loading door or a quality certificate left stuck.",
        },
      },
      {
        title: { th: "API ชุดเดียว ไม่หนักตามจำนวนคน", en: "One API that doesn't slow with more users" },
        body: {
          th: "แอปคนขับกับเว็บใช้ API ชุดเดียวกัน หน้าจอที่หลายคนเปิดพร้อมกันดึงข้อมูลครั้งเดียวแล้วแชร์ผลกัน ฐานข้อมูลจึงไม่หนักขึ้นตามจำนวนคนที่เปิด",
          en: "The driver app and the web share one API, and a screen many people have open queries the database once and shares the result, so load doesn't grow with every viewer.",
        },
      },
      {
        title: { th: "AI ช่วยเขียน เครื่องคุมกติกา", en: "AI helps write, machines hold the rules" },
        body: {
          th: "ผมใช้ AI ช่วยเขียนโค้ดและเอกสาร แต่กติกาอยู่ใน lint, test และ git hook คำสั่ง SQL อันตรายถูกบล็อกตั้งแต่ต้น และการตัดสินใจสำคัญเขียนเป็น ADR ไว้ 12 ฉบับ",
          en: "AI helps me write code and documents, but the rules live in lint, tests and git hooks, dangerous SQL is blocked outright, and key decisions are written up in 12 decision records.",
        },
      },
    ],
    stats: [
      { value: "100+", label: { th: "คนขับที่ใช้แอปในรอบ 3 เดือน", en: "drivers used the app in the last 3 months" } },
      { value: "332/386", label: { th: "ชุดการเปลี่ยนแปลงที่มีสคริปต์ rollback", en: "change sets with a rollback script" } },
      { value: "~1 นาที", label: { th: "API หยุดครั้งเดียวตลอดการย้ายระบบ", en: "the only API outage in the whole move" } },
      { value: "66 ms", label: { th: "เวลาตอบเฉลี่ยของ API", en: "average API response time" } },
    ],
    statsNote: {
      th: "จำนวนคนขับปัดเศษจาก production ย้อนหลัง 90 วัน ถึง 13 ต.ค. 2026 ตัวเลขที่เหลือมาจากบันทึกการ deploy และการวัดของระบบ",
      en: "The driver count is a rounded production total for the 90 days to 13 Oct 2026. The other figures come from deploy records and system measurements.",
    },
    tradeoff: {
      th: "ช่วงย้ายต้องเปิดสองระบบคู่กัน เขียนข้อมูลลงสองที่ และทุกการเปลี่ยนต้องผ่านระบบทดสอบก่อน ช้ากว่ารื้อทิ้งแล้วเขียนใหม่ทั้งก้อน แต่ไม่มีวันไหนที่คนขับทำงานไม่ได้",
      en: "During the move I ran two systems, wrote data to both, and sent every change through the test system first. That was slower than a rewrite-and-switch, but there was never a day drivers couldn't work.",
    },
    lesson: {
      th: "ปัญหาที่หนักที่สุดมักอยู่ตรงรอยต่อระหว่างแผนกและระบบ สถานะไหนไม่มีเจ้าของที่ชัด ข้อมูลจะเพี้ยนตรงนั้นก่อน ผมจึงเริ่มออกแบบจากคำถามว่าแต่ละขั้นใครเป็นเจ้าของข้อมูล",
      en: "The hardest problems sit at the seams between departments and systems. Where a status has no clear owner, the data drifts there first, so I start a design by asking who owns the data at each step.",
    },
    stack: ["Next.js 16", "React 19", "TypeScript", ".NET 8", "Dapper", "Flutter", "SQL Server", "SignalR", "Vitest", "Playwright"],
  },
  {
    slug: "beger-warehouse-scanning",
    org: "Beger",
    period: { th: "พ.ย. 2025 – ปัจจุบัน", en: "Nov 2025 – Present" },
    tags: ["process", "engineering"],
    title: {
      th: "ตรวจสินค้าก่อนขึ้นรถ ด้วยกติกาที่ระบบสแกนตรวจเอง",
      en: "Checking goods before loading, with rules the scanners enforce",
    },
    summary: {
      th: "ของผิดหรือขาดที่หลุดขึ้นรถไปแล้วแก้ยากและแพง พนักงานคลังสแกนกล่องสีเทียบกับใบส่งของด้วยเครื่องสแกนมือถือมานานกว่าสิบปี ผมรับช่วงแอปบนเครื่องสแกนต่อจากเพื่อนร่วมทีม เขียน API เกือบทั้งหมด และทำให้ระบบตรวจกติกาเอง",
      en: "A wrong or missing carton that leaves on a truck is slow and costly to fix. Warehouse staff have checked paint cartons against their shipments on handheld scanners for over ten years. I took the handheld app over from a teammate, wrote nearly all of its API, and made the system check the rules itself.",
    },
    role: {
      th: "เขียน API เกือบทั้งหมด และรับช่วงแอปบนเครื่องสแกนต่อจากเพื่อนร่วมทีม",
      en: "Wrote nearly all of the API; took over the handheld app from a teammate",
    },
    problem: {
      th: "ของผิดหรือขาดที่หลุดขึ้นรถไปแล้วแก้ยากและแพง หัวหน้างานตามงานจากรายงาน Excel และ Crystal Report การตรวจต้องทันคิวรถที่รออยู่หน้าประตู วันที่งานเยอะมีการสแกนจำนวนมาก และแต่ละครั้งต้องบันทึกไว้ตรวจย้อนหลังได้ โดยที่พนักงานไม่ต้องรอระบบ",
      en: "A wrong or missing carton that leaves on a truck is slow and costly to fix. Supervisors followed the work through Excel and Crystal reports. Checking has to keep up with trucks waiting at the door, busy days bring a large number of scans, and every scan must be on record for later review, without making staff wait.",
    },
    decisions: [
      {
        title: { th: "ให้ระบบตรวจกติกาเอง", en: "Let the system enforce the checking rules" },
        body: {
          th: "ระบบไม่ยอมรับสินค้าที่ไม่อยู่ในใบส่งของ จับการสแกนซ้ำ และกันการนับเกินจำนวน ทุกการสแกนบันทึกว่าใครสแกนอะไรเมื่อไร หลังเปิดใช้ ระบบจับการสแกนที่ไม่ถูกต้องได้หลายหมื่นครั้ง ตัวเลขนี้คือครั้งที่ระบบกันไว้ ไม่ได้แปลว่าทุกครั้งจะกลายเป็นของผิดบนรถ",
          en: "The system refuses an item that isn't on the shipment, catches a repeat scan and blocks an over-count, and each scan is logged with who scanned what and when. Since go-live it has stopped and logged tens of thousands of invalid scan attempts. That counts attempts it stopped, not errors that would all have reached a truck.",
        },
      },
      {
        title: { th: "จอติดตามงานสดสำหรับหัวหน้างาน", en: "A live screen for supervisors" },
        body: {
          th: "แทนรายงาน Excel และ Crystal Report หัวหน้างานดูจากจอที่อัปเดตสดว่าแต่ละงานอยู่ขั้นไหน ตั้งแต่รับงาน มอบหมาย เริ่มสแกน จนสแกนเสร็จ และงานไหนค้างผิดปกติ ถ้ามีคำถามก็ย้อนดูได้ว่าใครทำอะไร",
          en: "In place of Excel and Crystal reports, supervisors follow a live screen that shows where each job is, from received and assigned to started and finished, and which jobs look stuck. When a question comes up, they can trace who did what.",
        },
      },
      {
        title: { th: "แยกงานที่ต้องถูกทันที ออกจากงานที่รอได้", en: "Split what must be right now from what can wait" },
        body: {
          th: "ทุกการสแกน ระบบตรวจสถานะของบาร์โค้ดหรือ QR ตัดยอด และบันทึกผล จบในการเรียกฐานข้อมูลครั้งเดียว แล้วตอบกลับทันทีพร้อมยอดที่เหลือ ส่วน audit log ว่าใครสแกนอะไรเมื่อไร ทั้งที่ผ่านและไม่ผ่าน ส่งเข้าคิวในหน่วยความจำ แล้วมี worker เขียนลงฐานข้อมูลเป็นชุด ทุก 500 ms หรือเมื่อครบ 50 รายการ การเก็บ log จึงไม่ทำให้การสแกนช้าลง",
          en: "Each scan checks the barcode or QR code's status, deducts the quantity and saves the result in a single database call, then answers at once with what's left. The audit log of who scanned what and when, for passes and failures alike, goes onto an in-memory queue, and a worker writes it in batches every 500 ms or 50 entries, so logging never slows a scan down.",
        },
      },
      {
        title: { th: "รอเอกสารที่ยังไม่พร้อม แทนการให้คนกดซ้ำ", en: "Wait for documents that aren't ready yet" },
        body: {
          th: "ใบรับรองคุณภาพสินค้าบางใบยังออกจากระบบ ERP ไม่ทันตอนพิมพ์ แทนที่จะให้พนักงานกดซ้ำ ผมให้งานพิมพ์เข้าคิวแล้วลองใหม่เองเมื่อข้อมูลพร้อม",
          en: "Some quality certificates aren't out of the ERP yet when someone tries to print them. Instead of asking staff to retry, the print job is queued and retried on its own once the data is ready.",
        },
      },
      {
        title: { th: "เครื่องสแกนอัปเดตตัวเองได้", en: "Handhelds that update themselves" },
        body: {
          th: "เครื่องสแกนกระจายอยู่ทั่วคลัง แอปจึงเช็กเวอร์ชันและติดตั้งตัวใหม่เองได้ และมีโหมดชั่งน้ำหนักวัตถุดิบที่อ่านตัวเลขจากหน้าจอตาชั่งด้วยกล้อง",
          en: "Handhelds are spread around the warehouse, so the app checks its version and installs updates on its own, and a weighing mode reads the scale's display through the camera.",
        },
      },
      {
        title: { th: "ลบโค้ดที่ไม่มีใครเรียก", en: "Delete what nothing calls" },
        body: {
          th: "หลังระบบนิ่ง ผมไล่หา endpoint และ service ที่ไม่มีใครเรียกแล้วลบออก และรวมการจัดประเภท error ให้เหลือแบบเดียว คนที่มาอ่านต่อจะได้ไม่ต้องเดาว่าโค้ดไหนยังใช้อยู่",
          en: "Once the system settled, I traced which endpoints and services nothing called any more, removed them, and unified how errors are classified, so the next reader doesn't have to guess what's still in use.",
        },
      },
    ],
    stats: [
      {
        value: "−83%",
        label: {
          th: "อัตรางานที่แพ็กเสร็จแต่สถานะยังเปิดค้าง (ก.ค.–ธ.ค. 2025 เทียบ เม.ย.–ต้น ก.ค. 2026)",
          en: "rate of jobs packed but left with an open status (Jul–Dec 2025 vs Apr–early Jul 2026)",
        },
      },
      {
        value: "−62%",
        label: {
          th: "เวลา p90 จากสแกนแรกถึงสแกนสุดท้ายของแต่ละ wave หลัง go-live",
          en: "p90 time from first to last scan of a wave, after go-live",
        },
      },
    ],
    statsNote: {
      th: "ทั้งสองตัวเลขเป็นการเปลี่ยนแปลงแบบร้อยละ จากข้อมูลการสแกนจริง เทียบ ก.ค.–ธ.ค. 2025 กับ เม.ย.–ต้น ก.ค. 2026 จำนวนเคสเบื้องหลังอัตรานี้น้อย จึงควรอ่านเป็นทิศทาง และเป็นผลหลัง go-live ไม่ได้พิสูจน์ว่าเกิดจากระบบอย่างเดียว",
      en: "Both figures are percentage changes in real scan data, comparing Jul–Dec 2025 with Apr–early Jul 2026. The counts behind the rate are small, so read it as a direction, and both are results after go-live, not proof of cause.",
    },
    tradeoff: {
      th: "audit log ที่ยังรอในคิวอาจหายได้ถ้า process ล้มกลางคัน แต่ผลการสแกนกับยอดคงเหลือบันทึกเสร็จแล้วตั้งแต่ก่อนตอบกลับ ผมยอมแลกส่วนนี้ เพื่อให้การเก็บ log ไม่ทำให้คนหน้างานต้องรอ",
      en: "Audit entries still in the queue can be lost if the process dies, but the scan result and the remaining quantity are saved before the scan answers. I accepted that so logging never makes anyone on the floor wait.",
    },
    lesson: {
      th: "พอระบบนิ่งแล้ว การลบโค้ดที่ไม่มีใครเรียกมีค่าพอๆ กับการเขียนฟีเจอร์ใหม่ เพราะโค้ดที่เหลืออยู่คือสิ่งที่คนต่อไปต้องอ่านทั้งหมด",
      en: "Once a system settles, deleting code nothing calls is worth as much as a new feature: every remaining line is something the next person has to read.",
    },
    stack: [".NET 9", "Dapper", "Hangfire", "Flutter", "SQL Server", "MSTest"],
  },
  {
    slug: "thai-id-card-ocr",
    org: "Bangkok Medical Software",
    period: { th: "2024 – 2025 · ปรับปรุงต่อ 2026", en: "2024 – 2025 · revisited 2026" },
    tags: ["ai", "engineering"],
    title: {
      th: "อ่านบัตรประชาชนไทยจากภาพถ่ายมือถือ",
      en: "Reading Thai ID cards from phone photos",
    },
    summary: {
      th: "รปภ. ต้องได้ข้อมูลจากบัตรประชาชนที่ถ่ายด้วยมือถือ ทั้งที่ภาพมีแสงสะท้อนและเอียง ระหว่างที่คิวหน้าอาคารรออยู่ ผมสร้างระบบ OCR นี้ตั้งแต่ศูนย์ ทั้งเทรนโมเดลและเขียน backend และระบบนี้ใช้งานจริงในคอนโด โรงพยาบาล และอาคารราชการ",
      en: "A guard needs the details off an ID card photographed on a phone, with glare and tilt, while a queue waits at the door. I built the OCR for it from scratch, from the trained models to the backend, and it is in use at condominiums, hospitals and government buildings.",
    },
    role: { th: "สร้างทั้งหมดตั้งแต่ศูนย์", en: "Built it all from scratch" },
    problem: {
      th: "บัตรที่ถ่ายด้วยมือถือมีแสงสะท้อน เอียง และฉากหลังรก OCR ทั่วไปอ่านทั้งใบตรงๆ แล้วได้ผลเพี้ยน แต่คิวหน้าอาคารรอนานไม่ได้",
      en: "Phone photos of cards come with glare, tilt and cluttered backgrounds, and generic OCR on the whole photo returns garbage. Meanwhile the queue at the door can't wait.",
    },
    decisions: [
      {
        title: { th: "แยกเป็นขั้นที่วัดผลได้ทีละขั้น", en: "Split it into steps you can measure one at a time" },
        body: {
          th: "หาบัตรและแยกประเภท → ตัดขอบแล้วดัดภาพให้ตรง → หาตำแหน่ง 56 ช่องข้อมูล → อ่านทีละช่อง แต่ละขั้นมีโมเดลของตัวเอง ทั้งหมด 6 โมเดล รวมฝั่งป้ายทะเบียนรถ พอผลผิดก็รู้ทันทีว่าผิดที่ขั้นไหน",
          en: "Find and classify the card → cut it out and flatten it → locate 56 fields → read each one. Each step has its own model, six in all including licence plates, so a wrong result points straight at the step that failed.",
        },
      },
      {
        title: { th: "ใช้ความรู้เรื่องบัตรไทยตรวจผล", en: "Check the output with what's known about Thai cards" },
        body: {
          th: "เลขบัตร 13 หลักมี checksum ที่อ่านผิดหลักเดียวก็ตรวจเจอ และเติมหลักที่หายได้ ที่อยู่เทียบกับรายชื่อจังหวัด อำเภอ และตำบลทั้งประเทศ 7,436 ตำบล บัตรหมดอายุวันก่อนวันเกิดเสมอ จึงใช้แก้เดือนที่อ่านผิดได้ และวันที่ภาษาไทยกับอังกฤษต้องตรงกัน",
          en: "The 13-digit ID has a checksum that catches a single misread digit and can restore a missing one. Addresses are matched against every province, district and all 7,436 subdistricts. Cards expire the day before the holder's birthday, which fixes a misread month, and the Thai and English dates must agree.",
        },
      },
      {
        title: { th: "เทียบกับโมเดลรุ่นใหม่ ด้วยตัวเลข", en: "Compare against newer models, with numbers" },
        body: {
          th: "ปี 2026 มี vision-language model ที่เทรนกับภาษาไทยออกมา ผมวัดเทียบบนบัตรชุดเดียวกัน บน GPU อ่านครบทุกช่องใน 2–7 วินาที บน CPU ช้ากว่านั้นหลายเท่า เลยแนะนำให้ใช้แบบผสม: โมเดลเดิมของผมหาและดัดบัตร โมเดลใหม่อ่าน แล้วกฎตรวจสอบเดิมตรวจซ้ำ",
          en: "By 2026 there were vision-language models trained on Thai. Measured on the same cards, one read every field in 2–7 seconds on a GPU and many times slower on a CPU, so I proposed a hybrid: my models find and flatten the card, the new model reads it, and the same checks verify the result.",
        },
      },
    ],
    stats: [
      { value: "56", label: { th: "ช่องข้อมูลที่ระบบหาและอ่านจากบัตรหนึ่งใบ", en: "fields the system finds and reads on one card" } },
      { value: "0.993", label: { th: "mIoU ของโมเดลตัดขอบบัตร (validation)", en: "mIoU of the card segmentation model (validation)" } },
      { value: "2–7 s", label: { th: "ต่อใบ บน GPU เมื่ออ่านด้วยโมเดลรุ่นใหม่", en: "per card on a GPU with the newer reader" } },
    ],
    statsNote: {
      th: "วัดในเครื่องบนบัตรชุดเดียวกัน ภาพบัตรจริงไม่ถูกนำมาแสดง",
      en: "Measured locally on the same set of cards. No real card images are shown.",
    },
    tradeoff: {
      th: "การแยกเป็น 6 โมเดลทำให้หาจุดผิดได้ง่าย แต่ใช้กำลังเครื่องมากกว่าโมเดลเดียว เครื่องที่ไม่มี GPU จะช้าลงมาก ผมจึงให้โค้ดรองรับ CUDA ไว้ และแยกขั้นอ่านออกมา เปลี่ยนไปใช้โมเดลที่เร็วกว่าได้โดยไม่ต้องรื้อขั้นอื่น",
      en: "Six models make failures easy to locate but need more compute than one, and a machine without a GPU slows down a lot. So the code supports CUDA, and the reading step stands on its own, so it can move to a faster model without touching the rest.",
    },
    lesson: {
      th: "ระบบที่มีหลายขั้นต้องวัดผลแยกทีละขั้น ถ้าดูแค่ผลลัพธ์สุดท้าย จะไม่รู้ว่าปัญหาอยู่ตรงไหน และความรู้เรื่องตัวบัตรเองช่วยตรวจผลได้มากพอๆ กับตัวโมเดล",
      en: "A system with several stages has to be measured stage by stage; the final output alone won't tell you where a problem is. And knowing the card itself checks the result as well as any model does.",
    },
    stack: ["YOLO11", "BiSeNetV2", "PaddleOCR", "Typhoon OCR", "PyTorch", "FastAPI", "Flutter", "Docker"],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
