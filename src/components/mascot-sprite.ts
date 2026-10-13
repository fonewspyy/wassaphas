// 8-bit version of the site's mascot: cat-ear hood, black visor with glowing ^ ^ eyes,
// headphones, a pixel "W" on the chest, white-soled sneakers.
// Each frame is 16 × 19 pixels; one character per pixel, "." is transparent.

export const PALETTE: Record<string, string> = {
  K: "#151515", // hood / jacket
  D: "#2c2c2c", // hood shading
  S: "#c9ccd1", // silver trim
  V: "#050505", // visor
  T: "#3cf0d0", // glow
  W: "#f4f4f4", // sole highlight
};

const HOOD = [
  "..K..........K..",
  ".KTK........KTK.",
  ".KKKKKKKKKKKKKK.",
  "KKDSSSSSSSSSSDKK",
  "KKSVVVVVVVVVVSKK",
];

const FACE = {
  open: [
    "KTSVVTTVVTTVVSTK",
    "KTSVTVVTTVVTVSTK",
  ],
  blink: [
    "KTSVVVVVVVVVVSTK",
    "KTSVTTTVVTTTVSTK",
  ],
};

const CHIN = [
  "KKSVVVVVVVVVVSKK",
  ".KKSSSSSSSSSSKK.",
  "..KKKKKKKKKKKK..",
];

const TORSO = {
  down: [
    ".DKKSKKKKKKSKKD.",
    "DDKKKTKTKTKKKKDD",
    "DDKKKKTKTKKKKKDD",
    ".SKKKKKKKKKKKKS.",
  ],
  // right arm up in a peace sign
  wave: [
    ".DKKSKKKKKKSKKTT",
    "DDKKKTKTKTKKKKSS",
    "DDKKKKTKTKKKKKS.",
    ".SKKKKKKKKKKKK..",
  ],
};

const LEGS = {
  stand: [
    "..KKKKK..KKKKK..",
    "..KKKK....KKKK..",
    ".KKTKK....KKTKK.",
    ".WWWWW....WWWWW.",
  ],
  stepA: [
    "..KKKKK..KKKKK..",
    ".KKKK......KKKK.",
    "KKTKK......KKTKK",
    "WWWWW.......WWWW",
  ],
  stepB: [
    "...KKKKKKKKKK...",
    "....KKKKKKKK....",
    "...KKTKKKKTKK...",
    "...WWWWWWWWWW...",
  ],
};

const frame = (face: string[], torso: string[], legs: string[]) => [...HOOD, ...face, ...CHIN, ...torso, ...legs];

export const FRAMES = {
  idle: frame(FACE.open, TORSO.down, LEGS.stand),
  blink: frame(FACE.blink, TORSO.down, LEGS.stand),
  walkA: frame(FACE.open, TORSO.down, LEGS.stepA),
  walkB: frame(FACE.open, TORSO.down, LEGS.stepB),
  wave: frame(FACE.open, TORSO.wave, LEGS.stand),
} as const;

export type FrameName = keyof typeof FRAMES;
export const SPRITE_W = 16;
export const SPRITE_H = FRAMES.idle.length;
