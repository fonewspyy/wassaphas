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
      th: "งานจัดรถ คิวรถ ส่งของ และวางบิลค่าขนส่งอยู่ในโปรแกรม desktop ตัวเดียวที่ช้า ไม่เสถียร และแก้ยาก ส่วนคนขับไม่มีเครื่องมือของตัวเองเลย ผมย้ายงานเหล่านี้มาเป็นเว็บหลังบ้าน API และแอปคนขับทีละส่วน ระหว่างที่งานส่งของยังเดินอยู่ เพราะรับผิดชอบเองตั้งแต่ต้นจนจบ ผมจึงวางทางถอยและด่านตรวจไว้ก่อนทุกการเปลี่ยน แล้วใช้ AI ช่วยลงแรงในส่วนที่เหลือ",
      en: "Dispatch, the truck queue, deliveries and freight billing all ran in one desktop program that was slow, unstable and hard to change, and drivers had nothing of their own. I moved the work to a web back office, an API and a driver app, one piece at a time, while deliveries kept running. Owning it end to end, I put the way back and the checks in place before every change, and let AI carry the rest of the load.",
    },
    role: {
      th: "ทำเกือบทั้งหมดเองตั้งแต่ต้นจนจบ: วิเคราะห์งาน ออกแบบ เขียนเว็บหลังบ้าน API และแอปคนขับ ขึ้นระบบ และตามแก้หลังเปิดใช้",
      en: "Nearly all of it, end to end: analysis, design, back office, API and driver app, release, and fixes after go-live",
    },
    problem: {
      th: "ทุกวันมีรถออกจากโรงงานหลายสิบเที่ยว ระบบเดิมเป็นโปรแกรม desktop ที่ใช้ได้เฉพาะเครื่องในออฟฟิศ ช้า ไม่เสถียร มีปัญหาบ่อย และจะเพิ่มหรือแก้อะไรก็ยาก คนขับไม่มีเครื่องมือของตัวเองเลย และระบบต้องเปลี่ยนระหว่างที่งานยังวิ่งอยู่ จะปิดระบบไปก่อนไม่ได้",
      en: "Dozens of trucks leave the plant every day. The old system was a desktop program that only ran on office PCs: slow, unstable, often in trouble and hard to change. Drivers had no tool of their own. And it had to be replaced while the work kept running; switching it off first was not an option.",
    },
    decisions: [
      {
        title: { th: "นับให้ถูกก่อนออกแบบระบบประตู", en: "Count visits correctly before designing the gate" },
        body: {
          th: "ก่อนออกแบบระบบประตู ผมไล่ดูข้อมูลจริง 30 วัน แล้วเจอว่าแถวในคิว 1 แถวไม่ได้เท่ากับการมา 1 ครั้ง คนขับบางคนมีถึง 26 แถวในวันเดียว และ 44% ของเวลาเช็กอินคือเวลาที่ออฟฟิศเรียกรถ ไม่ใช่เวลาที่รถมาถึงจริง ถ้านับตามแถว ยอดจะเฟ้อเกือบ 2 เท่า ผมเลยออกแบบให้หน่วยนับคือ \"การมา 1 ครั้ง\" ตั้งแต่ต้น",
          en: "Before designing the gate system I went through 30 days of real data and found that one queue row is not one visit: a driver could have 26 rows in a day, and 44% of check-in times were really the time the office called the truck. Counting rows would have nearly doubled the totals, so I made a single visit the unit of counting from the start.",
        },
      },
      {
        title: { th: "ย้ายทีละส่วน ระบบเปิดใช้ตลอด", en: "Move piece by piece, keep it running" },
        body: {
          th: "ระหว่างย้าย ระบบเก่ากับใหม่รับข้อมูลชุดเดียวกันจากต้นทาง และอ่านผ่านตัวกลางเดียวกัน ทุกการเปลี่ยนออกเป็นชุดที่ deploy แยกกันได้ 332 จาก 386 ชุดมีสคริปต์ rollback ถ้าส่วนไหนพังก็ถอยเฉพาะส่วนนั้น ตลอดการย้ายมีครั้งเดียวที่ API หยุดไปราว 1 นาที ระหว่างที่เปิดคู่กัน ถ้าระบบเก่าพยายามแก้ข้อมูลที่ระบบใหม่รับไปดูแลแล้ว จะถูกบล็อกและบันทึกไว้ แทนการเขียนทับกันเงียบๆ",
          en: "During the move, the old and new systems received the same data at the source and read it through the same layer. Changes shipped as independent sets, 332 of 386 with a rollback script, so any one piece could be backed out on its own. In the whole move, the API went down once, for about a minute. While both ran, any attempt by the old system to change data the new one had taken over was blocked and logged instead of silently overwriting it.",
        },
      },
      {
        title: { th: "ผ่านระบบทดสอบก่อน และเตรียมทางถอยไว้", en: "Through the test system first, with a way back prepared" },
        body: {
          th: "ทุกการเปลี่ยนแปลงขึ้นระบบทดสอบก่อน แล้วจึงขึ้น production เป็นชุด 332 จาก 386 ชุดมีสคริปต์ rollback แยกจากสคริปต์ deploy และสคริปต์ตรวจ หลังขึ้น ผมเทียบว่าโค้ดบนสองระบบตรงกัน และลองรันบน production ภายใน transaction แล้วย้อนกลับ ข้อมูลจริงจึงไม่ถูกแตะ การแก้ข้อมูลจริงเริ่มจากดูตัวอย่างและจำนวนแถวที่คาดไว้ทุกครั้ง ครั้งหนึ่งพบ 29 แถว ผมปิดเฉพาะ 26 แถวที่ปลอดภัย และกัน 3 แถวที่ข้อมูลกำกวมไว้ให้คนตรวจก่อน",
          en: "Every change goes to the test system first, then to production as a set; 332 of 386 sets carry a rollback script alongside the deploy and check scripts. Afterwards I confirm the code on both systems matches and run it on production inside a transaction that is rolled back, so live data isn't touched. Fixes to live data start with a preview and an expected row count. Once a preview found 29 rows; I closed only the 26 that were safe and held back 3 with ambiguous evidence for a person to review.",
        },
      },
      {
        title: { th: "เร็วขึ้นได้ ต้องได้ผลเหมือนเดิมทุกแถว", en: "Faster only if every row comes back the same" },
        body: {
          th: "งานปรับความเร็ว query ผมเก็บผลก่อนแก้ไว้เทียบทีละแถว ครั้งหนึ่งตัวที่ปรับแล้วผ่านบนระบบทดสอบครบ 202 จาก 202 แต่บน production ต่างไป 13 จาก 232 ผมจึงถอยกลับ แม้จะเร็วกว่า เพราะรายงานที่เร็วแต่ตัวเลขผิด แย่กว่ารายงานที่ช้า",
          en: "For query tuning I keep the results from before the change and compare them row by row. One candidate matched 202 of 202 on the test system but differed on 13 of 232 in production, so I rolled it back even though it was faster: a fast report with wrong numbers is worse than a slow one.",
        },
      },
      {
        title: { th: "แอปคนขับที่ออกแบบจากงานจริงของคนขับ", en: "A driver app built around how drivers work" },
        body: {
          th: "คนขับรับงาน เช็กอินที่โรงงาน และถ่ายรูปหลักฐานการส่งของได้ในแอปเดียว รูปแนบทีหลังได้ภายในวันเดียวกัน ไม่ต้องถ่ายตอนยังถือถังสีอยู่หน้าบ้านลูกค้า และงานที่ปิดผิดเปิดกลับมาแก้ได้ แอปอยู่ในมือคนขับทั้งวัน จึงคอยดูแบตเตอรี่ ส่ง location ต่อได้แม้แอปอยู่เบื้องหลัง ใส่พิกัดในรูปส่งของ และใช้ QR เป็นบัตรผ่านประตูโรงงาน",
          en: "Drivers take jobs, check in at the plant and photograph proof of delivery in one app. Photos can be added later the same day instead of at the customer's door with a paint bucket in hand, and a job closed by mistake can be reopened. The app is in a driver's hand all day, so it watches battery and location, keeps working in the background, attaches GPS to delivery photos, and shows a QR pass at the factory gate.",
        },
      },
      {
        title: { th: "API ชั้นเดียวที่ทุกหน้าจอใช้ร่วมกัน", en: "One API layer every screen shares" },
        body: {
          th: "แอปคนขับกับเว็บหลังบ้านเรียก API ชุดเดียวกัน ทุก endpoint ตอบในรูปแบบเดียวกัน มีตัวจัดการ error กลางตัวเดียว และย้าย stored procedure หลักของงานบิล รายงาน และแอปมือถือ ให้รับ input เป็น JSON ก้อนเดียว เพิ่มฟิลด์ใหม่ได้โดยไม่ต้องแก้ signature หน้าจอที่หลายคนเปิดพร้อมกัน เช่น กระดานจัดรถ ดึงจากฐานข้อมูลครั้งเดียวแล้วเก็บผลไว้ให้ทุกคนใช้ร่วมกัน 5 วินาที ฐานข้อมูลจึงไม่ต้องรับคำสั่งเดิมซ้ำทีละคน",
          en: "The driver app and the back office call the same API. Every endpoint answers in one shape, errors go through one handler, and the main stored procedures for billing, reports and the mobile app take a single JSON input, so a new field doesn't change their signature. Busy screens such as the dispatch board query the database once and share the result for five seconds, so the database doesn't run the same query for every viewer.",
        },
      },
      {
        title: { th: "ใช้ AI ลงแรง ให้เครื่องคุมกติกา", en: "AI does the legwork, machines hold the rules" },
        body: {
          th: "งานคนเดียวทั้งเส้นจะทันได้ ผมใช้ AI agent ช่วยเขียนโค้ด สคริปต์ตรวจ และเอกสาร แต่กติกาไม่ได้อยู่แค่ในเอกสาร ผมใส่ไว้ใน ESLint, check script และ git hook ถ้าการแก้ผิดกติกาก็ commit ไม่ผ่าน กติกาห้าม agent แตะ production โดยที่ผมไม่ได้อนุมัติ และคำสั่ง SQL ที่ลบหรือแก้ข้อมูลโดยไม่มีเงื่อนไขถูกบล็อกตั้งแต่ต้น หลังบ้านบนเว็บมี test ราว 960 ตัว และมีชุดสถานการณ์ทดสอบที่ไล่ทั้งเส้นตั้งแต่จัดรถจนถึงบัญชีบนระบบทดสอบ การตัดสินใจสำคัญผมเขียนเป็นบันทึก (ADR) ไว้ 12 ฉบับ คนที่มารับช่วงต่อจะรู้ว่าทำไมระบบเป็นแบบนี้",
          en: "To cover the whole line largely on my own, I use AI agents to help write code, check scripts and documents. The rules don't live only in a document: they are ESLint rules, check scripts and git hooks, so a change that breaks them can't be committed. The rules forbid agents from touching production without my approval, and SQL that deletes or updates without a condition is blocked outright. About 960 tests cover the web back office, a set of scenarios runs the whole line from dispatch to accounting on the test system, and the key decisions are written up in 12 decision records, so whoever comes next knows why the system is the way it is.",
        },
      },
    ],
    stats: [
      { value: "100+", label: { th: "คนขับที่ใช้แอปในรอบ 3 เดือน", en: "drivers used the app in the last 3 months" } },
      { value: "~60", label: { th: "เที่ยวที่ปิดงานต่อวัน", en: "trips closed per day" } },
      { value: "5.3M", label: { th: "request บันทึกข้อมูลที่สำเร็จ ใน 90 วัน", en: "successful write requests in 90 days" } },
      { value: "66 ms", label: { th: "เวลาตอบเฉลี่ยของ API", en: "average API response time" } },
    ],
    statsNote: {
      th: "ตัวเลขการใช้งานปัดเศษจาก production ย้อนหลัง 90 วัน ถึง 13 ต.ค. 2026 นับเป็นยอดรวมอย่างเดียว",
      en: "Usage figures are rounded production totals for the 90 days to 13 Oct 2026, counted in aggregate only.",
    },
    tradeoff: {
      th: "ช่วงย้าย ผมต้องเปิดสองระบบคู่กันและเขียนข้อมูลลงสองที่ และทุกการเปลี่ยนต้องผ่านระบบทดสอบก่อน ช้ากว่าการรื้อแล้วเขียนใหม่ทั้งก้อนหรือแก้บน production ตรงๆ แต่ไม่มีวันไหนที่คนขับทำงานไม่ได้",
      en: "During the move I ran two systems, wrote data to both, and sent every change through the test system first. That was slower than a rewrite-and-switch or fixing production directly, but there was never a day drivers couldn't work.",
    },
    lesson: {
      th: "เมื่อรับผิดชอบเองทั้งเส้น ความเร็วไม่ได้มาจากการข้ามขั้นตอน แต่มาจากการเตรียมทางถอยไว้ก่อน พอถอยได้ ผมก็กล้าเปลี่ยนทีละน้อยได้บ่อยๆ",
      en: "When you own the whole line, speed doesn't come from skipping steps. It comes from preparing the way back first; once a change can be undone, small changes can ship often.",
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
      th: "ของผิดหรือขาดที่หลุดขึ้นรถไปแล้วแก้ยากและแพง หัวหน้างานตามงานจากรายงาน Excel และ Crystal Report การตรวจต้องทันคิวรถที่รออยู่หน้าประตู วันที่งานเยอะมีการสแกนกว่าหมื่นครั้ง และแต่ละครั้งต้องบันทึกไว้ตรวจย้อนหลังได้ โดยที่พนักงานไม่ต้องรอระบบ",
      en: "A wrong or missing carton that leaves on a truck is slow and costly to fix. Supervisors followed the work through Excel and Crystal reports. Checking has to keep up with trucks waiting at the door, busy days bring over ten thousand scans, and every scan must be on record for later review, without making staff wait.",
    },
    decisions: [
      {
        title: { th: "ให้ระบบตรวจกติกาเอง", en: "Let the system enforce the checking rules" },
        body: {
          th: "ระบบไม่ยอมรับสินค้าที่ไม่อยู่ในใบส่งของ จับการสแกนซ้ำ และกันการนับเกินจำนวน ทุกการสแกนบันทึกว่าใครสแกนอะไรเมื่อไร ระหว่าง เม.ย. ถึงต้น ก.ค. 2026 ระบบหยุดและบันทึกการสแกนที่ไม่ถูกต้องไว้ราว 31,000 ครั้ง ตัวเลขนี้คือครั้งที่ระบบกันไว้ ไม่ได้แปลว่าทุกครั้งจะกลายเป็นของผิดบนรถ",
          en: "The system refuses an item that isn't on the shipment, catches a repeat scan and blocks an over-count, and each scan is logged with who scanned what and when. From April to early July 2026 it stopped and logged about 31,000 invalid scan attempts. That counts attempts it stopped, not errors that would all have reached a truck.",
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
          th: "เครื่องสแกนกระจายอยู่ทั่วคลัง แอปจึงเช็กเวอร์ชันและติดตั้งตัวใหม่เองได้ ล็อกอินด้วยบัญชี Microsoft 365 ของพนักงาน และมีโหมดชั่งน้ำหนักวัตถุดิบที่อ่านตัวเลขจากหน้าจอตาชั่งด้วยกล้อง",
          en: "Handhelds are spread around the warehouse, so the app checks its version and installs updates on its own. Staff sign in with their Microsoft 365 accounts, and a weighing mode reads the scale's display through the camera.",
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
        value: "28 → 3",
        label: {
          th: "งานที่แพ็กเสร็จแต่สถานะยังเปิดค้าง (จาก 115,764 งานใน ก.ค.–ธ.ค. 2025 เทียบ 74,813 งานใน เม.ย.–ต้น ก.ค. 2026)",
          en: "jobs packed but left with an open status (of 115,764 in Jul–Dec 2025 vs 74,813 in Apr–early Jul 2026)",
        },
      },
      {
        value: "259 → 97",
        label: {
          th: "นาที: p90 ของเวลาจากสแกนแรกถึงสแกนสุดท้ายของแต่ละ wave หลัง go-live (258.9 → 97.4)",
          en: "minutes, p90 from first to last scan of a wave, after go-live (258.9 → 97.4)",
        },
      },
      { value: "~9,500", label: { th: "การสแกนต่อวัน (สูงสุด ~17,000)", en: "scans a day (peak ~17,000)" } },
      { value: "26", label: { th: "พนักงานคลังที่ใช้เครื่องสแกน", en: "warehouse staff on the scanners" } },
    ],
    statsNote: {
      th: "อัตรางานค้างและเวลา p90 มาจากข้อมูลการสแกนจริง เทียบ ก.ค.–ธ.ค. 2025 (ราว 116,000 งาน) กับ เม.ย.–ต้น ก.ค. 2026 (ราว 75,000 งาน) จำนวนเคสเบื้องหลังอัตรานี้น้อย จึงควรอ่านเป็นทิศทาง และเป็นผลหลัง go-live ไม่ได้พิสูจน์ว่าเกิดจากระบบอย่างเดียว ตัวเลขการใช้งานอื่นปัดเศษจาก production ย้อนหลัง 90 วัน ถึง 13 ต.ค. 2026",
      en: "The open-status rate and the p90 time come from real scan data, comparing Jul–Dec 2025 (about 116,000 packed jobs) with Apr–early Jul 2026 (about 75,000). The counts behind the rate are small, so read it as a direction, and both are results after go-live, not proof of cause. Other usage figures are rounded production totals for the 90 days to 13 Oct 2026.",
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
      th: "รปภ. ต้องได้ข้อมูลจากบัตรประชาชนที่ถ่ายด้วยมือถือ ทั้งที่ภาพมีแสงสะท้อนและเอียง ระหว่างที่คิวหน้าอาคารรออยู่ ผมสร้างระบบ OCR นี้ตั้งแต่ศูนย์ ทั้งเทรนโมเดลและเขียน backend ปีต่อมากลับมาไล่งานตัวเองอีกรอบ",
      en: "A guard needs the details off an ID card photographed on a phone, with glare and tilt, while a queue waits at the door. I built the OCR for it from scratch, from the trained models to the backend, and a year later went back through my own work.",
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
        title: { th: "ปีต่อมา กลับมาหาบั๊กในงานตัวเอง", en: "A year later, hunting bugs in my own work" },
        body: {
          th: "ภาพจากมือถือบางใบหาบัตรไม่เจอเลย ผมไล่วัดผลทีละขั้น จนเจอว่าภาพถูกส่งเข้าโมเดลด้วยลำดับสี RGB แทน BGR กระเป๋าสีน้ำตาลจึงกลายเป็นสีฟ้า ความมั่นใจตกจาก 0.92 เหลือ 0.20 แก้บรรทัดเดียวแล้วบัตรที่เคยอ่านไม่ได้กลับมาอ่านได้",
          en: "Some phone photos found no card at all. Measuring each step in turn, I found images reached the detector in RGB instead of BGR, so a brown wallet turned blue and confidence fell from 0.92 to 0.20. A one-line fix brought those cards back.",
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
      { value: "0.20 → 0.92", label: { th: "ความมั่นใจของโมเดลหาบัตร หลังแก้ลำดับสี", en: "card detector confidence after the colour-order fix" } },
      { value: "0.993", label: { th: "mIoU ของโมเดลตัดขอบบัตร (validation)", en: "mIoU of the card segmentation model (validation)" } },
      { value: "2–7 s", label: { th: "ต่อใบ บน GPU เมื่ออ่านด้วยโมเดลรุ่นใหม่", en: "per card on a GPU with the newer reader" } },
    ],
    statsNote: {
      th: "วัดในเครื่องบนบัตรชุดเดียวกัน ภาพบัตรจริงไม่ถูกนำมาแสดง",
      en: "Measured locally on the same set of cards. No real card images are shown.",
    },
    tradeoff: {
      th: "การแยกเป็น 6 โมเดลทำให้หาจุดผิดได้ง่าย แต่ก็ช้ากว่าโมเดลเดียว ตอนทดสอบบนเครื่อง CPU 2 core ใช้ราว 25 วินาทีต่อใบ ถ้าจะใช้กับคิวยาวต้องรันบน GPU (โค้ดรองรับ CUDA อยู่แล้ว) หรือย้ายขั้นอ่านไปใช้โมเดลที่เร็วกว่า",
      en: "Six models make failures easy to locate but are slower than one: about 25 seconds a card when tested on a 2-core CPU. A long queue needs a GPU (the code already supports CUDA), or a faster model for the reading step.",
    },
    lesson: {
      th: "บั๊กที่หนักที่สุดไม่ได้อยู่ในโมเดล แต่อยู่ในบรรทัดเดียวที่ส่งภาพเข้าโมเดล จะเจอได้ก็ต้องวัดผลทีละขั้น ไม่ใช่ดูแค่ผลลัพธ์สุดท้าย",
      en: "The worst bug wasn't in any model; it was the one line that handed images to a model. Only measuring each step, not just the final output, found it.",
    },
    stack: ["YOLO11", "BiSeNetV2", "PaddleOCR", "Typhoon OCR", "PyTorch", "FastAPI", "Flutter", "Docker"],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
