"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";

// A clickable walk-through of the Thai ID card pipeline I built: find the card, flatten it,
// locate the fields, read them, then check the output with what's known about Thai cards.
// Everything on the card is made up: specimen name, a sample ID number that passes the
// checksum, a placeholder photo. The "read" values copy the kinds of mistakes the real OCR
// made; the fixes are the rules the real post-processing applies.

type Bi = { th: string; en: string };
const t = (b: Bi, l: Locale) => b[l];

type Box = [x: number, y: number, w: number, h: number];

const STEPS: { title: Bi; result: Bi }[] = [
  {
    title: { th: "หาบัตรและแยกประเภท", en: "Find and classify the card" },
    result: {
      th: "บัตรประชาชน · ความมั่นใจ 0.92",
      en: "National ID card · confidence 0.92",
    },
  },
  {
    title: { th: "ตัดขอบแล้วดัดภาพให้ตรง", en: "Cut out and flatten" },
    result: { th: "มุมบัตร 4 จุด", en: "4 card corners" },
  },
  {
    title: {
      th: "หาตำแหน่งช่องข้อมูลและรูปใบหน้า",
      en: "Locate the fields and the face",
    },
    result: {
      th: "พบ 11 ช่องข้อความ (โมเดลรู้จัก 56 แบบ) และรูปใบหน้า",
      en: "11 text fields (the model knows 56) and the face photo",
    },
  },
  {
    title: { th: "อ่านทีละช่อง", en: "Read each field" },
    result: { th: "OCR ภาษาไทยและอังกฤษ", en: "Thai and English OCR" },
  },
  {
    title: { th: "ตรวจด้วยกฎของบัตรไทย", en: "Check with Thai card rules" },
    result: { th: "แก้ 6 ช่อง", en: "6 fields fixed" },
  },
];

const FIELDS: {
  label: Bi;
  boxes: Box[];
  raw: string;
  /** The parts of `raw` the OCR got wrong, highlighted in the result. */
  wrong?: string[];
  final: string;
  rule?: Bi;
}[] = [
  {
    label: { th: "เลขบัตรประชาชน", en: "ID number" },
    boxes: [[372, 95, 332, 42]],
    raw: "1 2345 6789O 12 1",
    wrong: ["O"],
    final: "1 2345 67890 12 1",
    rule: {
      th: "แก้ตัว O เป็น 0 แล้วตรวจ checksum 13 หลักผ่าน",
      en: "O becomes 0, then the 13-digit checksum passes",
    },
  },
  {
    label: { th: "ชื่อ-นามสกุล", en: "Name (Thai)" },
    boxes: [[312, 158, 300, 42]],
    raw: "น.ส. ตัวอย่าง ใจดี",
    final: "น.ส. ตัวอย่าง ใจดี",
  },
  {
    label: { th: "ชื่อภาษาอังกฤษ", en: "Name (English)" },
    boxes: [
      [316, 206, 260, 30],
      [316, 242, 190, 30],
    ],
    raw: "Mlss Tuayang / Jaidee",
    wrong: ["Mlss"],
    final: "Miss Tuayang Jaidee",
    rule: {
      th: "คำนำหน้าจับคู่กับรายการที่เป็นไปได้ และตรงกับ น.ส.",
      en: "Title snapped to the known list; matches the Thai title",
    },
  },
  {
    label: { th: "วันเกิด", en: "Date of birth" },
    boxes: [
      [324, 278, 260, 30],
      [324, 312, 300, 30],
    ],
    raw: "เกิดวันที่ 15 มี.A. 2540 / 15 Mar. 1997",
    wrong: ["เกิดวันที่", "มี.A."],
    final: "15 มีนาคม 2540 · 1997-03-15",
    rule: {
      th: "ตัดคำว่า เกิดวันที่ จับคู่ชื่อเดือน แล้วเทียบกับวันที่ภาษาอังกฤษ",
      en: "Caption removed, month snapped, checked against the English date",
    },
  },
  {
    label: { th: "ศาสนา", en: "Religion" },
    boxes: [[324, 346, 130, 28]],
    raw: "พNธ",
    wrong: ["พNธ"],
    final: "พุทธ",
    rule: {
      th: "จับคู่กับรายชื่อศาสนา",
      en: "Snapped to the list of religions",
    },
  },
  {
    label: { th: "ที่อยู่", en: "Address" },
    boxes: [
      [54, 382, 360, 32],
      [54, 416, 290, 32],
    ],
    raw: "ทีอยู 123 ถ.ตัวอย่าง แขางลุมพินี / เขตปทุมวน กรุงเทพมหานคร",
    wrong: ["ทีอยู", "แขาง", "ปทุมวน"],
    final: "123 ถ.ตัวอย่าง แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร",
    rule: {
      th: "ตัดคำว่า ที่อยู่ แล้วเทียบจังหวัด → เขต → แขวง จาก 7,436 ตำบล",
      en: "Caption removed, then matched province → district → subdistrict (7,436 subdistricts)",
    },
  },
  {
    label: { th: "วันออกบัตร", en: "Issue date" },
    boxes: [[54, 455, 160, 30]],
    raw: "15 มี.ค. 2565",
    final: "15 มีนาคม 2565",
  },
  {
    label: { th: "วันหมดอายุ", en: "Expiry date" },
    boxes: [[434, 455, 160, 30]],
    raw: "14 ม.ค. 2573",
    wrong: ["ม.ค."],
    final: "14 มีนาคม 2573",
    rule: {
      th: "บัตรหมดอายุวันก่อนวันเกิด เดือนจึงต้องเป็น มี.ค. ไม่ใช่ ม.ค.",
      en: "Cards expire the day before the birthday, so the month must be March, not January",
    },
  },
];

const RESULT_JSON = {
  doc_type: "id_card",
  id_number: "1234567890121",
  id_number_valid: true,
  full_name_th: "น.ส. ตัวอย่าง ใจดี",
  full_name_en: "Miss Tuayang Jaidee",
  birth_date: { th: "15 มีนาคม 2540", en: "15 March 1997", iso: "1997-03-15" },
  issue_date: { th: "15 มีนาคม 2565", en: "15 March 2022", iso: "2022-03-15" },
  expiry_date: { th: "14 มีนาคม 2573", en: "14 March 2030", iso: "2030-03-14" },
  religion: "พุทธ",
  address: {
    full: "123 ถ.ตัวอย่าง แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร",
    subdistrict: "ลุมพินี",
    district: "ปทุมวัน",
    province: "กรุงเทพมหานคร",
  },
  best_person_crop_url: "/static/<request-id>/…_seg_warp_person1_ID_person.jpg",
  warnings: [
    "แก้วันหมดอายุจาก 14 มกราคม 2573 ตามวันเกิด (บัตรหมดอายุก่อนวันเกิด 1 วัน)",
  ],
};

const COPY = {
  run: { th: "อ่านบัตร", en: "Read the card" },
  again: { th: "เริ่มใหม่", en: "Start over" },
  idle: {
    th: "กดปุ่มเพื่อดูว่าระบบอ่านบัตรทีละขั้นยังไง",
    en: "Press the button to watch the system read the card step by step",
  },
  specimen: {
    th: "บัตรตัวอย่าง ข้อมูลสมมติทั้งหมด",
    en: "Specimen card; all data is made up",
  },
  colField: { th: "ช่อง", en: "Field" },
  colRaw: { th: "OCR อ่านได้", en: "OCR read" },
  colFinal: { th: "หลังตรวจ", en: "After checks" },
  json: { th: "ดู JSON ที่ API ตอบกลับ", en: "See the JSON the API returns" },
  face: { th: "รูปใบหน้าบนบัตร", en: "Face photo from the card" },
  faceNote: {
    th: "โมเดลอีกตัวหารูปบุคคลบนบัตรที่ดัดตรงแล้ว แล้วตัดจากภาพก่อนปรับความคม เพื่อไม่ให้หน้ามีเงาซ้อน",
    en: "A separate model finds the photo on the flattened card; it's cut from the image before sharpening, so the face has no ghosting.",
  },
  note: {
    th: "ข้อมูลในตัวอย่างนี้สมมติขึ้นทั้งหมด ค่าที่ OCR อ่านได้จำลองความผิดพลาดแบบที่เจอจริงกับบัตรที่ถ่ายด้วยมือถือ ส่วนการแก้คือกฎเดียวกับในระบบจริง จังหวะในตัวอย่างนี้ย่อให้สั้นลง บน GPU ระบบจริงใช้ราว 2–7 วินาทีต่อใบ",
    en: "Everything in this example is made up. The OCR values copy the kinds of mistakes the real system made on phone photos; the fixes are the same rules the real system applies. Timing is shortened here; the real system takes about 2–7 seconds a card on a GPU.",
  },
};

export function OcrDemo({ lang }: { lang: Locale }) {
  // -1 = idle; 0..4 = step in progress; 5 = done
  const [step, setStep] = useState(-1);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setStep(STEPS.length);
      return;
    }
    setStep(0);
    for (let i = 1; i <= STEPS.length; i++) {
      timers.current.push(window.setTimeout(() => setStep(i), i * 650));
    }
  };

  const running = step >= 0 && step < STEPS.length;
  const done = step >= STEPS.length;
  const flattened = step >= 2;
  const showFields = step >= 3;
  const showCardBox = step === 0 || step === 1;

  return (
    <div className="border-2 border-rule bg-label">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* the "photo" */}
        <div
          className={`relative overflow-hidden p-5 transition-colors duration-500 sm:p-8 ${flattened ? "bg-label" : "bg-[#cfc9bd]"}`}
        >
          <div
            className="transition-transform duration-700 ease-out"
            style={{
              transform: flattened ? "none" : "rotate(-6deg) scale(0.9)",
            }}
          >
            <SpecimenCard
              lang={lang}
              showCardBox={showCardBox}
              showFields={showFields}
            />
          </div>
          <p className="mt-3 text-center text-xs text-ink-3">
            {t(COPY.specimen, lang)}
          </p>
        </div>

        {/* the pipeline */}
        <div className="border-t-2 border-rule p-5 sm:p-6 lg:border-l-2 lg:border-t-0">
          <ol className="space-y-3" aria-live="polite">
            {STEPS.map((s, i) => {
              const state = step > i ? "done" : step === i ? "active" : "todo";
              return (
                <li key={s.title.en} className="flex gap-3">
                  <span
                    aria-hidden
                    className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center border-2 font-mono text-xs ${
                      state === "done"
                        ? "border-ink bg-ink text-label"
                        : state === "active"
                          ? "animate-pulse border-scan text-scan"
                          : "border-hair text-ink-3"
                    }`}
                  >
                    {state === "done" ? "✓" : i + 1}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold ${state === "todo" ? "text-ink-3" : ""}`}
                    >
                      {t(s.title, lang)}
                    </p>
                    {state === "done" && (
                      <p className="text-xs text-ink-2">{t(s.result, lang)}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={run}
              disabled={running}
              className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-sm font-semibold text-label transition-colors hover:bg-scan disabled:opacity-50"
            >
              {done ? t(COPY.again, lang) : t(COPY.run, lang)}
            </button>
            {step < 0 && (
              <p className="text-sm text-ink-3">{t(COPY.idle, lang)}</p>
            )}
          </div>
        </div>
      </div>

      {done && (
        <div className="grid gap-6 border-t-2 border-rule p-5 sm:p-6 lg:grid-cols-[10rem_minmax(0,1fr)]">
          <figure className="max-w-40">
            <svg
              viewBox="650 250 170 210"
              className="block w-full border-2 border-rule"
              role="img"
              aria-label={t(COPY.face, lang)}
            >
              <PhotoPlaceholder />
            </svg>
            <figcaption className="mt-2">
              <span className="block text-sm font-semibold">
                {t(COPY.face, lang)}
              </span>
              <span className="mt-1 block text-xs leading-snug text-ink-3">
                {t(COPY.faceNote, lang)}
              </span>
            </figcaption>
          </figure>
          <div className="min-w-0">
            <div className="hidden grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] gap-4 border-b-2 border-rule pb-2 text-xs font-semibold text-ink-3 sm:grid">
              <span>{t(COPY.colField, lang)}</span>
              <span>{t(COPY.colRaw, lang)}</span>
              <span>{t(COPY.colFinal, lang)}</span>
            </div>
            <ul>
              {FIELDS.map((f) => (
                <li
                  key={f.label.en}
                  className="grid gap-x-4 gap-y-1 border-b border-hair py-3 sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)]"
                >
                  <span className="text-sm font-semibold">
                    {t(f.label, lang)}
                  </span>
                  <span
                    className="font-mono text-sm break-words text-ink-2"
                  >
                    <span className="sr-only">{t(COPY.colRaw, lang)}: </span>
                    <Marked text={f.raw} parts={f.wrong} />
                  </span>
                  <span className="text-sm break-words">
                    <span className="sr-only">{t(COPY.colFinal, lang)}: </span>
                    <span className="font-mono font-semibold">{f.final}</span>
                    {f.rule && (
                      <span className="mt-1 block text-xs leading-snug text-ink-3">
                        {t(f.rule, lang)}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <details className="mt-5">
              <summary className="cursor-pointer text-sm font-medium">
                {t(COPY.json, lang)}
              </summary>
              <pre className="mt-3 max-h-80 overflow-auto border-2 border-rule bg-[#f6f5f1] p-4 font-mono text-xs leading-relaxed">
                {JSON.stringify(RESULT_JSON, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      <p className="border-t-2 border-rule px-5 py-3 text-xs leading-relaxed text-ink-3 sm:px-6">
        {t(COPY.note, lang)}
      </p>
    </div>
  );
}

// A drawn Thai national ID card with specimen data only. Layout follows the real card so
// the field boxes land where the real detector finds them.
function SpecimenCard({
  lang,
  showCardBox,
  showFields,
}: {
  lang: Locale;
  showCardBox: boolean;
  showFields: boolean;
}) {
  const blue = "#1f4e8c";
  const ink = "#1a1a1a";
  return (
    <svg
      viewBox="0 0 860 540"
      className="block w-full drop-shadow-[0_10px_18px_rgb(0_0_0/0.25)]"
      role="img"
      aria-label={t(COPY.specimen, lang)}
      fontFamily="inherit"
    >
      <rect x="0" y="0" width="860" height="540" rx="34" fill="#e3eef5" />
      <rect
        x="0"
        y="0"
        width="860"
        height="540"
        rx="34"
        fill="none"
        stroke="#b9cfdd"
        strokeWidth="3"
      />
      {/* emblem placeholder */}
      <circle
        cx="82"
        cy="82"
        r="46"
        fill="none"
        stroke="#b44"
        strokeWidth="3"
        opacity="0.5"
      />
      <text
        x="82"
        y="90"
        textAnchor="middle"
        fontSize="22"
        fill="#b44"
        opacity="0.6"
      >
        ตรา
      </text>

      <text x="150" y="72" fontSize="34" fontWeight="700" fill={ink}>
        บัตรประจำตัวประชาชน
      </text>
      <text x="520" y="72" fontSize="27" fontWeight="700" fill={blue}>
        Thai National ID Card
      </text>
      <text x="150" y="108" fontSize="16" fill={ink}>
        เลขประจำตัวประชาชน
      </text>
      <text x="150" y="130" fontSize="15" fill={blue}>
        Identification Number
      </text>
      <text
        x="382"
        y="128"
        fontSize="34"
        fontWeight="600"
        fill={ink}
        letterSpacing="1"
      >
        1 2345 67890 12 1
      </text>

      <text x="150" y="186" fontSize="16" fill={ink}>
        ชื่อตัวและชื่อสกุล
      </text>
      <text x="320" y="190" fontSize="32" fontWeight="700" fill={ink}>
        น.ส. ตัวอย่าง ใจดี
      </text>

      {/* chip */}
      <rect x="60" y="210" width="112" height="86" rx="12" fill="#d8b75e" />
      <path
        d="M60 253h112M116 210v86M88 210v86M144 210v86"
        stroke="#b8963f"
        strokeWidth="2"
      />

      <text x="250" y="228" fontSize="16" fill={blue}>
        Name
      </text>
      <text x="322" y="230" fontSize="25" fill={blue}>
        Miss Tuayang
      </text>
      <text x="230" y="264" fontSize="16" fill={blue}>
        Last name
      </text>
      <text x="322" y="266" fontSize="25" fill={blue}>
        Jaidee
      </text>
      <text x="246" y="302" fontSize="18" fill={ink}>
        เกิดวันที่
      </text>
      <text x="330" y="302" fontSize="24" fill={ink}>
        15 มี.ค. 2540
      </text>
      <text x="200" y="336" fontSize="16" fill={blue}>
        Date of Birth
      </text>
      <text x="330" y="336" fontSize="24" fill={blue}>
        15 Mar. 1997
      </text>
      <text x="270" y="368" fontSize="16" fill={ink}>
        ศาสนา
      </text>
      <text x="330" y="368" fontSize="20" fill={ink}>
        พุทธ
      </text>

      <text x="60" y="406" fontSize="18" fill={ink}>
        ที่อยู่ 123 ถ.ตัวอย่าง แขวงลุมพินี
      </text>
      <text x="60" y="440" fontSize="20" fill={ink}>
        เขตปทุมวัน กรุงเทพมหานคร
      </text>
      <text x="60" y="478" fontSize="19" fill={ink}>
        15 มี.ค. 2565
      </text>
      <text x="60" y="500" fontSize="14" fill={ink}>
        วันออกบัตร
      </text>
      <text x="440" y="478" fontSize="19" fill={ink}>
        14 มี.ค. 2573
      </text>
      <text x="440" y="500" fontSize="14" fill={ink}>
        วันบัตรหมดอายุ
      </text>

      <PhotoPlaceholder />

      {/* specimen watermark */}
      <text
        x="430"
        y="300"
        textAnchor="middle"
        fontSize="70"
        fontWeight="700"
        fill="#c0392b"
        opacity="0.16"
        transform="rotate(-16 430 300)"
      >
        ตัวอย่าง · SPECIMEN
      </text>

      {/* step 1-2: whole-card box */}
      {showCardBox && (
        <rect
          x="6"
          y="6"
          width="848"
          height="528"
          rx="30"
          fill="none"
          stroke="#08705f"
          strokeWidth="6"
          strokeDasharray="14 10"
        />
      )}

      {/* step 3+: field boxes */}
      {showFields && (
        <g>
          {FIELDS.flatMap((f) => f.boxes).map(([x, y, w, h], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width={w}
              height={h}
              fill="rgb(8 112 95 / 0.08)"
              stroke="#08705f"
              strokeWidth="2.5"
            />
          ))}
          <rect
            x="646"
            y="246"
            width="178"
            height="218"
            fill="none"
            stroke="#08705f"
            strokeWidth="5"
          />
        </g>
      )}
    </svg>
  );
}

// The photo area of the specimen card: a silhouette, never a real face. Drawn in card
// coordinates so the same shapes serve the card and the cropped face (viewBox 650 250 170 210).
function PhotoPlaceholder() {
  return (
    <g>
      <rect x="650" y="250" width="170" height="210" fill="#d6dde3" />
      <circle cx="735" cy="320" r="38" fill="#a7b2bb" />
      <path d="M672 460c6-54 32-82 63-82s57 28 63 82z" fill="#a7b2bb" />
    </g>
  );
}

// Highlights the parts of an OCR reading that were wrong.
function Marked({ text, parts }: { text: string; parts?: string[] }) {
  if (!parts?.length) return <>{text}</>;
  const escaped = parts.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "g");
  return (
    <>
      {text.split(re).map((piece, i) =>
        parts.includes(piece) ? (
          <mark key={i} className="bg-[#f6d7cf] px-0.5 text-[#a3361f]">
            {piece}
          </mark>
        ) : (
          piece
        ),
      )}
    </>
  );
}
