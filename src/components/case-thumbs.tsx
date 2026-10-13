// Small drawings for the case study list, so a reader can tell the stories apart at a glance.
// Drawn rather than screenshotted: the real screens hold company and personal data.

const INK = "#111111";
const SCAN = "#08705f";
const PAPER = "#f7f6f2";
const SOFT = "#d5d5d1";

function Transport() {
  return (
    <>
      {/* back office window */}
      <rect x="112" y="18" width="110" height="70" rx="3" fill={PAPER} stroke={INK} strokeWidth="2.5" />
      <path d="M112 30h110" stroke={INK} strokeWidth="2" />
      <rect x="122" y="40" width="40" height="38" fill={SOFT} />
      <path d="M172 44h40M172 54h32M172 64h40M172 74h24" stroke={INK} strokeWidth="2.5" />
      {/* driver phone with route */}
      <rect x="26" y="34" width="56" height="100" rx="8" fill={PAPER} stroke={INK} strokeWidth="2.5" />
      <path d="M38 116c10-14 2-26 14-34s18-12 18-26" fill="none" stroke={SCAN} strokeWidth="3" strokeDasharray="4 4" />
      <circle cx="38" cy="116" r="4" fill={INK} />
      <path d="M70 46c-6 0-9 4-9 8 0 6 9 14 9 14s9-8 9-14c0-4-3-8-9-8z" fill={SCAN} />
      {/* link phone -> back office */}
      <path d="M86 70h22" stroke={INK} strokeWidth="2" strokeDasharray="3 3" />
      {/* truck */}
      <rect x="124" y="104" width="58" height="26" fill={INK} />
      <path d="M182 110h18l12 12v8h-30z" fill={INK} />
      <circle cx="140" cy="132" r="7" fill={PAPER} stroke={INK} strokeWidth="3" />
      <circle cx="200" cy="132" r="7" fill={PAPER} stroke={INK} strokeWidth="3" />
    </>
  );
}

function Warehouse() {
  const box = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="52" height="40" fill={PAPER} stroke={INK} strokeWidth="2.5" />
      <path d={`M${x + 10} ${y + 12}v16M${x + 14} ${y + 12}v16M${x + 19} ${y + 12}v16M${x + 22} ${y + 12}v16M${x + 27} ${y + 12}v16`} stroke={INK} strokeWidth="2" />
    </g>
  );
  return (
    <>
      {box(130, 92)}
      {box(184, 92)}
      {box(157, 50)}
      {/* scan beam */}
      <path d="M86 70L157 58L157 92Z" fill={SCAN} opacity="0.18" />
      <path d="M157 64v24" stroke={SCAN} strokeWidth="3" />
      {/* handheld scanner */}
      <rect x="26" y="48" width="64" height="40" rx="6" fill={INK} />
      <rect x="34" y="56" width="34" height="20" rx="2" fill={PAPER} />
      <path d="M40 88h22l-6 46h-12z" fill={INK} />
      {/* check */}
      <circle cx="214" cy="40" r="16" fill={SCAN} />
      <path d="M206 40l6 6 10-12" fill="none" stroke={PAPER} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

function IdCard() {
  return (
    <>
      <g transform="rotate(-6 120 75)">
        <rect x="30" y="22" width="180" height="112" rx="10" fill="#e3eef5" stroke={INK} strokeWidth="2.5" />
        <rect x="44" y="34" width="70" height="8" fill={INK} />
        <rect x="120" y="34" width="62" height="8" fill="#1f4e8c" />
        <rect x="44" y="64" width="28" height="22" rx="3" fill="#d8b75e" />
        <path d="M80 56h70M80 68h54M80 80h60M80 92h44M44 106h90M44 116h70" stroke={INK} strokeWidth="3" />
        <rect x="160" y="62" width="38" height="48" fill="#d6dde3" />
        <circle cx="179" cy="80" r="9" fill="#a7b2bb" />
        <path d="M165 110c2-12 7-18 14-18s12 6 14 18z" fill="#a7b2bb" />
        {/* detection boxes */}
        <rect x="76" y="50" width="78" height="12" fill="none" stroke={SCAN} strokeWidth="2.5" />
        <rect x="76" y="74" width="68" height="12" fill="none" stroke={SCAN} strokeWidth="2.5" />
        <rect x="40" y="100" width="98" height="20" fill="none" stroke={SCAN} strokeWidth="2.5" />
        <rect x="156" y="58" width="46" height="56" fill="none" stroke={SCAN} strokeWidth="3" />
      </g>
      {/* scan line */}
      <path d="M18 92h204" stroke={SCAN} strokeWidth="3" opacity="0.6" />
    </>
  );
}

const DRAWINGS: Record<string, () => React.JSX.Element> = {
  "beger-transport": Transport,
  "beger-warehouse-scanning": Warehouse,
  "thai-id-card-ocr": IdCard,
};

export function CaseThumb({ slug }: { slug: string }) {
  const Drawing = DRAWINGS[slug];
  if (!Drawing) return null;
  return (
    <svg viewBox="0 0 240 150" aria-hidden className="block h-auto w-full">
      <rect width="240" height="150" fill={PAPER} />
      <Drawing />
    </svg>
  );
}
