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
  tradeoff: Bi;
  lesson: Bi;
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
        title: { th: "ย้ายทีละส่วน ระบบเปิดใช้ตลอด", en: "Move piece by piece, keep it running" },
        body: {
          th: "ระหว่างย้าย ระบบเก่ากับใหม่รับข้อมูลชุดเดียวกันจากต้นทาง และอ่านผ่านตัวกลางเดียวกัน ทุกการเปลี่ยนออกเป็นชุดที่ deploy แยกกันได้ 332 จาก 386 ชุดมีสคริปต์ rollback ถ้าส่วนไหนพังก็ถอยเฉพาะส่วนนั้น ตลอดการย้ายมีครั้งเดียวที่ API หยุดไปราว 1 นาที",
          en: "During the move, the old and new systems received the same data at the source and read it through the same layer. Changes shipped as independent sets, 332 of 386 with a rollback script, so any one piece could be backed out on its own. In the whole move, the API went down once, for about a minute.",
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
        title: { th: "AI agent เขียน เครื่องบังคับกติกา", en: "Agents write the code, machines enforce the rules" },
        body: {
          th: "ผมเขียนระบบนี้คู่กับ AI agent ทุกวัน ในโปรเจกต์ใหม่ กติกาที่ agent ต้องทำตามไม่ได้อยู่แค่ในเอกสาร ผมใส่ไว้ใน ESLint, check script และ git hook ด้วย ถ้าการแก้ไขผิดกติกาก็ commit ไม่ผ่านตั้งแต่ในเครื่อง หลังบ้านบนเว็บมี test ราว 960 ตัวคุมไว้ agent จึงทำงานเร็วได้โดยที่ผมไม่ต้องตรวจทุกบรรทัดเอง",
          en: "I build this system with AI agents every day. In the newer projects, the rules they must follow don't live only in a document: they are ESLint rules, check scripts and git hooks, so a change that breaks them can't even be committed. About 960 tests cover the web back office, which lets the agents move fast without me reading every line.",
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
          th: "แอปอยู่ในมือคนขับทั้งวัน จึงคอยดูแบตเตอรี่ ส่ง location ต่อได้แม้แอปอยู่เบื้องหลัง ถ่ายรูปหลักฐานส่งของพร้อมพิกัด และใช้ QR เป็นบัตรผ่านประตูโรงงาน",
          en: "The app is in a driver's hand all day, so it watches battery and location, keeps working in the background, attaches GPS to delivery photos, and shows a QR pass at the factory gate.",
        },
      },
    ],
    stats: [
      { value: "100+", label: { th: "คนขับที่ใช้แอปในรอบ 3 เดือน", en: "drivers used the app in the last 3 months" } },
      { value: "~60", label: { th: "เที่ยวที่ปิดงานต่อวัน", en: "trips closed per day" } },
      { value: "5.4M", label: { th: "request ที่ API รับใน 3 เดือน", en: "API requests in 3 months" } },
      { value: "66 ms", label: { th: "เวลาตอบเฉลี่ยของ API", en: "average API response time" } },
    ],
    statsNote: {
      th: "ตัวเลขการใช้งานปัดเศษจาก production ย้อนหลัง 90 วัน ถึง 13 ต.ค. 2026 นับเป็นยอดรวมอย่างเดียว",
      en: "Usage figures are rounded production totals for the 90 days to 13 Oct 2026, counted in aggregate only.",
    },
    tradeoff: {
      th: "ช่วงย้าย ผมต้องดูแลสองระบบพร้อมกันและเขียนข้อมูลลงสองที่ ช้ากว่าการรื้อแล้วเขียนใหม่ทั้งก้อน แต่ไม่มีวันไหนที่คนขับทำงานไม่ได้",
      en: "During the move I ran two systems and wrote data to both. That was slower than a rewrite-and-switch, but there was never a day drivers couldn't work.",
    },
    lesson: {
      th: "แถวในตารางไม่ได้เท่ากับเหตุการณ์ในโลกจริง ก่อนจะนับหรือทำรายงานอะไร ต้องไปดูข้อมูลจริงก่อนว่าหนึ่งแถวหมายถึงอะไร",
      en: "A row in a table is not an event in the world. Before counting or reporting anything, look at real data to learn what one row actually means.",
    },
    stack: ["Next.js 16", "React 19", "TypeScript", ".NET 8", "Dapper", "Flutter", "SQL Server", "SignalR", "Vitest", "Playwright", "Claude Code"],
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
      th: "พนักงานคลังสแกนกล่องสีทุกกล่องเทียบกับใบส่งของก่อนขึ้นรถ ผมเขียน API ที่อยู่ข้างหลัง และรับช่วงแอปบนเครื่องสแกนต่อจากเพื่อนร่วมทีมจนขึ้นใช้งานจริง",
      en: "Warehouse staff scan every carton of paint against its shipment before it goes on a truck. I wrote the API behind it and took the handheld app over from a teammate through to production.",
    },
    role: {
      th: "เขียน API เกือบทั้งหมด และรับช่วงแอปบนเครื่องสแกนต่อจากเพื่อนร่วมทีม",
      en: "Wrote nearly all of the API; took over the handheld app from a teammate",
    },
    problem: {
      th: "ของผิดหรือขาดที่หลุดขึ้นรถไปแล้วแก้ยากและแพง การตรวจต้องทันคิวรถที่รออยู่หน้าประตู วันที่งานเยอะมีการสแกนกว่าหมื่นครั้ง แต่ละครั้งต้องบันทึกไว้ตรวจย้อนหลังได้ โดยที่พนักงานไม่ต้องรอระบบ",
      en: "A wrong or missing carton that leaves on a truck is slow and costly to fix. Checking has to keep up with trucks waiting at the door, busy days bring over ten thousand scans, and every scan must be on record for later review, without making staff wait.",
    },
    decisions: [
      {
        title: { th: "บันทึกทุกการสแกนโดยไม่ให้ใครรอ", en: "Record every scan without making anyone wait" },
        body: {
          th: "การสแกนตอบกลับทันที ส่วนการบันทึกเข้าคิวในหน่วยความจำ แล้วมี worker เขียนลงฐานข้อมูลเป็นชุด ทุก 500 ms หรือเมื่อครบ 50 รายการ แล้วแต่อย่างไหนถึงก่อน พนักงานจึงไม่ต้องรอฐานข้อมูล",
          en: "A scan answers immediately. Its record goes onto an in-memory queue, and a worker writes them in batches every 500 ms or at 50 entries, whichever comes first, so staff never wait on the database.",
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
      { value: "~9,500", label: { th: "การสแกนต่อวัน (สูงสุด ~17,000)", en: "scans a day (peak ~17,000)" } },
      { value: "47k+", label: { th: "shipment ที่ตรวจใน 3 เดือน", en: "shipments checked in 3 months" } },
      { value: "26", label: { th: "พนักงานคลังที่ใช้เครื่องสแกน", en: "warehouse staff on the scanners" } },
    ],
    statsNote: {
      th: "ตัวเลขการใช้งานปัดเศษจาก production ย้อนหลัง 90 วัน ถึง 13 ต.ค. 2026 นับเป็นยอดรวมอย่างเดียว",
      en: "Usage figures are rounded production totals for the 90 days to 13 Oct 2026, counted in aggregate only.",
    },
    tradeoff: {
      th: "การบันทึกเป็นชุดแปลว่า ถ้า process ล้มกลางคัน log ที่ยังรอในคิวอาจหายได้ไม่เกินหนึ่งชุด ผมยอมแลกเพื่อให้การสแกนหน้างานไม่ต้องรอฐานข้อมูล",
      en: "Batching means that if the process dies, the log entries still queued (at most one batch) can be lost. I accepted that so scanning on the floor never waits on the database.",
    },
    lesson: {
      th: "พอระบบนิ่งแล้ว การลบโค้ดที่ไม่มีใครเรียกมีค่าพอๆ กับการเขียนฟีเจอร์ใหม่ เพราะทุกบรรทัดที่เหลือคือสิ่งที่คนต่อไปต้องอ่าน",
      en: "Once a system settles, deleting code nothing calls is worth as much as a new feature: every remaining line is something the next person has to read.",
    },
    stack: [".NET 9", "Dapper", "Hangfire", "Flutter", "SQL Server", "MSTest"],
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
          th: "ภาพจากมือถือบางใบหาบัตรไม่เจอเลย ผมใช้ AI agent ช่วยไล่โค้ดและวัดผลทีละขั้น จนเจอว่าภาพถูกส่งเข้าโมเดลด้วยลำดับสี RGB แทน BGR กระเป๋าสีน้ำตาลจึงกลายเป็นสีฟ้า ความมั่นใจตกจาก 0.92 เหลือ 0.20 แก้บรรทัดเดียวแล้วบัตรที่เคยอ่านไม่ได้กลับมาอ่านได้",
          en: "Some phone photos found no card at all. Tracing it step by step with an AI agent, I found images reached the detector in RGB instead of BGR, so a brown wallet turned blue and confidence fell from 0.92 to 0.20. A one-line fix brought those cards back.",
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
      th: "การแยกเป็น 6 โมเดลทำให้หาจุดผิดได้ง่าย แต่ก็ช้ากว่าโมเดลเดียว บน CPU ใช้ราว 25 วินาทีต่อใบ ถ้าจะใช้กับคิวยาวต้องมี GPU หรือย้ายขั้นอ่านไปใช้โมเดลที่เร็วกว่า",
      en: "Six models make failures easy to locate but are slower than one: about 25 seconds a card on a CPU. A long queue needs a GPU, or a faster model for the reading step.",
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
