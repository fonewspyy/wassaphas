// Case studies shown on the home page and at /case-studies/[slug].
//
// What may appear here, and what may not:
// - Usage numbers are rounded production counts for the 90 days to 13 Oct 2026, from a
//   read-only aggregate query (counts only). Round them; never publish exact figures.
// - Code-size numbers come from git history and the code itself.
// - Never name a database, table, stored procedure, server, host, customer or partner,
//   and never describe a security weakness, even a fixed one.

type Bi = { th: string; en: string };

export type CaseStat = { value: string; label: Bi };
export type Decision = { title: Bi; body: Bi };

export type CaseStudy = {
  slug: string;
  org: string;
  period: Bi;
  title: Bi;
  summary: Bi;
  role: Bi;
  problem: Bi;
  decisions: Decision[];
  stats: CaseStat[];
  statsNote: Bi;
  stack: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "beger-transport",
    org: "Beger",
    period: { th: "ม.ค. 2026 – ปัจจุบัน", en: "Jan 2026 – Present" },
    title: {
      th: "ระบบขนส่ง: จากโปรแกรม desktop เป็นแอปคนขับและหลังบ้านบนเว็บ",
      en: "Transport: from a desktop program to a driver app and a web back office",
    },
    summary: {
      th: "งานจัดรถ คิวรถ ส่งของ และวางบิลค่าขนส่ง เคยอยู่ในโปรแกรม desktop ตัวเดียว ผมย้ายมาเป็นเว็บหลังบ้าน API และแอปคนขับ โดยไม่หยุดงานส่งของสักวัน",
      en: "Dispatch, the truck queue, deliveries and freight billing used to live in one desktop program. I moved them to a web back office, an API and a driver app without stopping deliveries for a day.",
    },
    role: {
      th: "เขียนเกือบทั้งหมด: เว็บหลังบ้าน, API และแอปคนขับ",
      en: "Wrote nearly all of it: back office, API and driver app",
    },
    problem: {
      th: "ทุกวันมีรถออกจากโรงงานหลายสิบเที่ยว ระบบเดิมเป็นโปรแกรม desktop ที่ใช้ได้เฉพาะเครื่องในออฟฟิศ คนขับไม่มีเครื่องมือของตัวเองเลย และระบบต้องย้ายระหว่างที่งานยังวิ่งอยู่ ปิดระบบไม่ได้",
      en: "Dozens of trucks leave the plant every day. The old system was a desktop program that only ran on office PCs, with nothing in drivers' hands. It had to be replaced while work kept running; switching it off was not an option.",
    },
    decisions: [
      {
        title: { th: "ย้ายทีละส่วน ไม่มีวันปิดระบบ", en: "Move piece by piece, never switch off" },
        body: {
          th: "ระหว่างย้าย ระบบเก่ากับใหม่รับข้อมูลชุดเดียวกันจากต้นทาง และอ่านข้อมูลผ่านตัวกลางเดียวกัน ทุกการเปลี่ยนมีสคริปต์ deploy, rollback และ verify ของตัวเอง ถ้าส่วนไหนพังก็ถอยเฉพาะส่วนนั้นได้",
          en: "During the move, the old and new systems received the same data at the source and read it through the same layer. Every change shipped with its own deploy, rollback and verify script, so any one piece could be backed out on its own.",
        },
      },
      {
        title: { th: "นับเที่ยวรถให้ถูกก่อนจะทำรายงาน", en: "Count trips correctly before reporting on them" },
        body: {
          th: "ก่อนออกแบบระบบประตู ผมไล่ดูข้อมูลจริง 30 วัน แล้วเจอว่าแถวในคิว 1 แถวไม่ได้เท่ากับการมา 1 ครั้ง คนขับบางคนมีถึง 26 แถวในวันเดียว และ 44% ของเวลาเช็คอินคือเวลาที่ออฟฟิศเรียกรถ ไม่ใช่เวลาที่รถมาถึงจริง ถ้านับตามแถว ยอดจะเฟ้อเกือบ 2 เท่า ผมเลยออกแบบให้หน่วยนับคือ \"การมา 1 ครั้ง\" ตั้งแต่ต้น",
          en: "Before designing the gate system I went through 30 days of real data and found that one queue row is not one visit: a driver could have 26 rows in a day, and 44% of check-in times were really the time the office called the truck. Counting rows would have nearly doubled the totals, so I made a single visit the unit of counting from the start.",
        },
      },
      {
        title: { th: "API ชั้นเดียวที่ทุกหน้าจอใช้ร่วมกัน", en: "One API layer every screen shares" },
        body: {
          th: "แอปคนขับกับเว็บหลังบ้านเรียก API ชุดเดียวกัน ทุก endpoint ตอบในรูปแบบเดียวกัน มีตัวจัดการ error กลางตัวเดียว และย้าย stored procedure หลักของงานบิล รายงาน และแอปมือถือ ให้รับ input เป็น JSON ก้อนเดียว เพิ่มฟิลด์ใหม่ได้โดยไม่ต้องแก้ signature",
          en: "The driver app and the back office call the same API. Every endpoint answers in one shape, errors go through one handler, and the main stored procedures for billing, reports and the mobile app take a single JSON input, so a new field doesn't change their signature.",
        },
      },
      {
        title: { th: "แอปคนขับที่ทนต่อมือถือจริง", en: "A driver app built for real phones" },
        body: {
          th: "แอปทำงานอยู่ในมือคนขับทั้งวัน จึงเฝ้าดูแบตเตอรี่และ location ทำงานเบื้องหลังได้ ถ่ายรูปหลักฐานส่งของพร้อมพิกัด และใช้ QR เป็นบัตรผ่านประตูโรงงาน",
          en: "The app is in a driver's hand all day, so it watches battery and location, keeps working in the background, attaches GPS to delivery photos, and shows a QR pass at the factory gate.",
        },
      },
    ],
    stats: [
      { value: "100+", label: { th: "คนขับที่ใช้แอปในรอบ 3 เดือน", en: "drivers used the app in the last 3 months" } },
      { value: "~60", label: { th: "เที่ยวที่ปิดงานต่อวัน", en: "trips closed per day" } },
      { value: "~60k", label: { th: "request ที่เขียนข้อมูลต่อวัน สำเร็จ 98.7%", en: "write requests a day, 98.7% succeeding" } },
      { value: "66 ms", label: { th: "เวลาตอบเฉลี่ยของ API", en: "average API response time" } },
    ],
    statsNote: {
      th: "ตัวเลขการใช้งานปัดเศษจาก production ย้อนหลัง 90 วัน ถึง 13 ต.ค. 2026 นับเป็นยอดรวมอย่างเดียว",
      en: "Usage figures are rounded production totals for the 90 days to 13 Oct 2026, counted in aggregate only.",
    },
    stack: ["Next.js 16", "React 19", "TypeScript", ".NET 8", "Dapper", "Flutter", "SQL Server", "SignalR", "Vitest", "Playwright"],
  },
  {
    slug: "beger-warehouse-scanning",
    org: "Beger",
    period: { th: "พ.ย. 2025 – ปัจจุบัน", en: "Nov 2025 – Present" },
    title: {
      th: "ตรวจสินค้าก่อนขึ้นรถด้วยเครื่องสแกนมือถือ",
      en: "Checking goods before loading, with handheld scanners",
    },
    summary: {
      th: "พนักงานคลังสแกนกล่องสีทุกกล่องเทียบกับใบส่งของก่อนขึ้นรถ ผมทำทั้งแอปบนเครื่องสแกนและ API ที่อยู่ข้างหลัง",
      en: "Warehouse staff scan every carton of paint against its shipment before it goes on a truck. I built both the handheld app and the API behind it.",
    },
    role: {
      th: "เขียน API และแอปบนเครื่องสแกนเกือบทั้งหมด",
      en: "Wrote nearly all of the API and the handheld app",
    },
    problem: {
      th: "ของผิดหรือขาดที่หลุดขึ้นรถไปแล้วแก้ยากและแพง การตรวจต้องทันคิวรถที่รออยู่หน้าประตู วันที่งานเยอะมีการสแกนกว่าหมื่นครั้ง แต่ละครั้งต้องบันทึกไว้ตรวจย้อนหลังได้ โดยที่พนักงานไม่ต้องรอระบบ",
      en: "A wrong or missing carton that leaves on a truck is slow and costly to fix. Checking has to keep up with trucks waiting at the door, busy days bring over ten thousand scans, and every scan must be on record for later review, without making staff wait.",
    },
    decisions: [
      {
        title: { th: "บันทึกทุกการสแกนโดยไม่ให้ใครรอ", en: "Record every scan without making anyone wait" },
        body: {
          th: "การสแกนตอบกลับทันที ส่วนการบันทึกเข้าคิวในหน่วยความจำ แล้วมี worker เขียนลงฐานข้อมูลเป็นชุด ทุก 500 ms หรือครบ 50 รายการ เขียนครั้งเดียวได้ถึง 50 รายการ และพนักงานไม่ต้องรอฐานข้อมูล",
          en: "A scan answers immediately. Its record goes onto an in-memory queue, and a worker writes queued records in batches every 500 ms or at 50 entries, up to 50 rows per write, so staff never wait on the database.",
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
          th: "หลังระบบนิ่ง ผมไล่หา endpoint และ service ที่ไม่มีใครเรียกแล้วลบออก และรวมการจัดประเภท error ให้เหลือแบบเดียว โค้ดที่เหลืออยู่คือโค้ดที่ใช้งานจริงทั้งหมด",
          en: "Once the system settled, I traced which endpoints and services nothing called any more, removed them, and unified how errors are classified, so what remains is all code that runs.",
        },
      },
    ],
    stats: [
      { value: "~9,500", label: { th: "การสแกนต่อวัน (สูงสุด ~17,000)", en: "scans a day (peak ~17,000)" } },
      { value: "47k+", label: { th: "shipment ที่ตรวจใน 3 เดือน", en: "shipments checked in 3 months" } },
      { value: "26", label: { th: "พนักงานคลังที่ใช้เครื่องสแกน", en: "warehouse staff on the scanners" } },
    ],
    statsNote: {
      th: "ตัวเลขการใช้งานปัดเศษจาก production ย้อนหลัง 90 วัน ถึง 13 ต.ค. 2026 นับเป็นยอดรวมอย่างเดียว",
      en: "Usage figures are rounded production totals for the 90 days to 13 Oct 2026, counted in aggregate only.",
    },
    stack: [".NET 9", "Dapper", "Hangfire", "Flutter", "SQL Server", "MSTest"],
  },
  {
    slug: "beger-painter-crm",
    org: "Beger",
    period: { th: "ก.ย. 2026 – ปัจจุบัน", en: "Sep 2026 – Present" },
    title: {
      th: "CRM ช่างสีบน LINE",
      en: "A painter CRM on LINE",
    },
    summary: {
      th: "ช่างสีสมัคร ผ่านการประเมิน เรียนคอร์ส และรับงานผ่าน LINE ส่วนพนักงานดูแลช่างจากหลังบ้านบนเว็บ ผมเขียน backend ทั้งหมด",
      en: "Painters sign up, get assessed, take courses and pick up jobs through LINE, while staff manage them from a web back office. I wrote the whole backend.",
    },
    role: { th: "เขียน backend และฐานข้อมูลทั้งหมด", en: "Wrote the entire backend and database" },
    problem: {
      th: "ทะเบียนช่างอยู่ใน spreadsheet การจับคู่ช่างกับงานทำด้วยมือ และระหว่างทำ โจทย์ก็เปลี่ยน จากระบบส่งงานให้ช่าง กลายเป็นตลาดงานที่ช่างเลือกเองว่าจะรับงานไหน",
      en: "The painter registry lived in a spreadsheet and matching painters to jobs was done by hand. Halfway through, the brief changed from dispatching jobs to painters into a marketplace where painters choose the work themselves.",
    },
    decisions: [
      {
        title: { th: "กฎธุรกิจอยู่ในฐานข้อมูลที่เดียว", en: "Business rules live in one place: the database" },
        body: {
          th: "ทุกกฎอยู่ใน stored procedure ที่รับ input เป็น JSON ก้อนเดียว ฝั่ง C# เป็นแค่ชั้นบางๆ ที่ส่งต่อ กฎข้อไหนเปลี่ยน ก็แก้ที่เดียว ไม่ต้องตามหาหลายชั้น",
          en: "Every rule sits in a stored procedure that takes one JSON input, and the C# layer only passes calls through, so a changed rule is changed in one place.",
        },
      },
      {
        title: { th: "ทุก migration มี test", en: "Every migration has a test" },
        body: {
          th: "schema เปลี่ยนผ่าน migration ที่รันซ้ำได้อย่างปลอดภัย ตัว migrator ตรวจว่ากำลังรันบนฐานที่ถูกต้องก่อนทุกครั้ง และ migration แต่ละตัวมี SQL test ของตัวเอง",
          en: "Schema changes go through repeatable migrations, the migrator checks it is pointed at the right database before every run, and each migration has its own SQL test.",
        },
      },
      {
        title: { th: "จดเหตุผลไว้ ตอนโจทย์เปลี่ยน", en: "Write the reasons down when the brief changes" },
        body: {
          th: "ทุกการตัดสินใจเชิงโครงสร้างมีบันทึก ADR รวมถึงตอนเปลี่ยนจากระบบส่งงานเป็นตลาดงาน และแผนรองรับการโต ที่ตั้งใจไม่ทำ sharding, replica หรือ cache ก่อนมีตัวเลขบอกว่าต้องใช้",
          en: "Every structural decision has an ADR, including the turn from dispatching to a marketplace and a growth plan that deliberately leaves out sharding, replicas and caching until the numbers call for them.",
        },
      },
    ],
    stats: [
      { value: "125", label: { th: "stored procedure ที่ทำหน้าที่เป็น business logic", en: "stored procedures carrying the business logic" } },
      { value: "96", label: { th: "migration ที่ผ่าน SQL test", en: "migrations, each with SQL tests" } },
      { value: "21", label: { th: "ADR บันทึกการตัดสินใจ", en: "ADRs recording the decisions" } },
    ],
    statsNote: {
      th: "ระบบยังอยู่ในช่วงเริ่มใช้ จึงยังไม่มีตัวเลขการใช้งานให้แสดง ตัวเลขด้านบนนับจากโค้ด",
      en: "The system is still rolling out, so there are no usage figures yet; the numbers above are counted from the code.",
    },
    stack: ["ASP.NET Core 8", "SQL Server", "DbUp", "LINE LIFF", "Microsoft Entra ID", "Next.js"],
  },
  {
    slug: "thai-id-card-ocr",
    org: "Bangkok Medical Software",
    period: { th: "2024 – 2025 · ปรับปรุงต่อ 2026", en: "2024 – 2025 · revisited 2026" },
    title: {
      th: "อ่านบัตรประชาชนไทยจากภาพถ่ายมือถือ",
      en: "Reading Thai ID cards from phone photos",
    },
    summary: {
      th: "ระบบลงทะเบียนเข้าอาคารที่ รปภ. ถ่ายบัตรประชาชนแล้วได้ข้อมูลทันที ผมสร้างเองตั้งแต่ศูนย์ ทั้งเทรนโมเดลและเขียน backend ปีต่อมากลับมาไล่งานตัวเองอีกรอบ",
      en: "A building check-in system where a guard photographs an ID card and gets the details back at once. I built it from scratch, from the trained models to the backend, and a year later went back through my own work.",
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
          th: "ภาพจากมือถือบางใบหาบัตรไม่เจอเลย ผมไล่ดูทีละขั้นจนเจอว่าภาพถูกส่งเข้าโมเดลด้วยลำดับสี RGB แทน BGR กระเป๋าสีน้ำตาลจึงกลายเป็นสีฟ้า ความมั่นใจตกจาก 0.92 เหลือ 0.20 แก้บรรทัดเดียวแล้วบัตรที่เคยอ่านไม่ได้กลับมาอ่านได้",
          en: "Some phone photos found no card at all. Tracing it step by step, I found images reached the detector in RGB instead of BGR, so a brown wallet turned blue and confidence fell from 0.92 to 0.20. A one-line fix brought those cards back.",
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
    stack: ["YOLO11", "BiSeNetV2", "PaddleOCR", "Typhoon OCR", "PyTorch", "FastAPI", "Flutter", "Docker"],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
