// Research papers shown on the home page and at /research/[slug].
// Every number below is copied from the paper's own tables; don't round or "improve" them.

type Bi = { th: string; en: string };

export type PaperStat = { value: number; decimals?: number; prefix?: string; suffix?: string; label: Bi };

export type Comparison = {
  title: Bi;
  note: Bi;
  baselineLabel: Bi;
  proposedLabel: Bi;
  rows: { label: string; baseline: number; proposed: number }[];
};

export type Paper = {
  slug: string;
  kind: "journal" | "conference";
  award?: Bi;
  title: string;
  authors: string[];
  me: string;
  venue: string;
  doiUrl?: string;
  articleUrl?: string;
  pdf: { path: string; pages: number; credit: Bi; licenseUrl?: string };
  summary: Bi;
  stats: PaperStat[];
  comparison: Comparison;
  findings: Bi[];
};

export const papers: Paper[] = [
  {
    slug: "pixel-adjacency-continual-learning",
    kind: "conference",
    award: { th: "Best Paper Award, ICCT 2024", en: "Best Paper Award, ICCT 2024" },
    title: "Refining Class Confusion with Pixel Adjacency and Continual Learning in Medical Image Segmentation",
    authors: ["H. Lee", "P. Puttimit", "W. Thongsopa", "S. Roh", "Y. R. Lee", "S. Y. Park", "W. Y. Tak", "S. K. Jung"],
    me: "W. Thongsopa",
    venue: "Proceedings of the 7th International Conference on Culture Technology (ICCT 2024), pp. 86-92",
    pdf: {
      path: "/papers/pixel-adjacency-continual-learning-icct-2024.pdf",
      pages: 6,
      credit: {
        th: "ฉบับต้นฉบับของผู้เขียน งานวิจัยร่วมกับ Kyungpook National University และโรงพยาบาลมหาวิทยาลัย Kyungpook",
        en: "Author's manuscript. Joint work with Kyungpook National University and Kyungpook National University Hospital.",
      },
    },
    summary: {
      th: "ในภาพ CT อวัยวะที่อยู่ติดกันมักทำให้โมเดลแยกไม่ออก งานนี้วัดว่าพิกเซลของแต่ละคลาสติดกับคลาสไหนมากแค่ไหน เลือกคู่ที่โมเดลสับสนบ่อย ให้มันเรียนคู่นั้นเป็นคลาสเดียวก่อน แล้วค่อยแยกออกด้วย continual segmentation ที่ใช้ class-specific head กับ CLIP text embedding ทดลองกับ 3 ชุดข้อมูล: KNUH Body Composition, MM-WHS และ FLARE22",
      en: "Organs that touch in a CT scan get confused with each other. This work measures pixel adjacency between classes to pick the pairs a model mixes up, trains each pair as one merged class first, then separates them with continual segmentation using class-specific heads and CLIP text embeddings. Tested on three datasets: KNUH Body Composition, MM-WHS and FLARE22.",
    },
    stats: [
      { value: 10.27, decimals: 2, prefix: "+", label: { th: "จุด DSC ของกล้ามเนื้อหัวใจ (MYO) บน MM-WHS จาก 80.19 เป็น 90.46", en: "DSC points on myocardium (MYO), MM-WHS: 80.19 to 90.46" } },
      { value: 85.68, decimals: 2, suffix: "%", label: { th: "DSC เฉลี่ยบน MM-WHS จาก baseline 84.81", en: "average DSC on MM-WHS, up from a 84.81 baseline" } },
      { value: 3, label: { th: "ชุดข้อมูลที่ทดลอง รวม CT จากโรงพยาบาล 1,004 ภาพ", en: "datasets, including 1,004 hospital CT slices" } },
    ],
    comparison: {
      title: { th: "DSC ต่อคลาสบน MM-WHS: baseline เทียบกับการรวม LVC กับ MYO แล้วแยก", en: "Per-class DSC on MM-WHS: baseline vs merging LVC with MYO, then separating" },
      note: { th: "จากตาราง III ในบทความ", en: "From Table III of the paper" },
      baselineLabel: { th: "U-Net baseline", en: "U-Net baseline" },
      proposedLabel: { th: "รวมแล้วแยก (LVC + MYO)", en: "Merge then separate (LVC + MYO)" },
      rows: [
        { label: "LVC", baseline: 89.33, proposed: 93.12 },
        { label: "RVC", baseline: 84.1, proposed: 85.44 },
        { label: "LAC", baseline: 90.02, proposed: 84.03 },
        { label: "RAC", baseline: 81.63, proposed: 82.1 },
        { label: "MYO", baseline: 80.19, proposed: 90.46 },
        { label: "AA", baseline: 91.64, proposed: 93.84 },
        { label: "PA", baseline: 76.79, proposed: 70.76 },
        { label: "AVG", baseline: 84.81, proposed: 85.68 },
      ],
    },
    findings: [
      {
        th: "ได้ผลเมื่อสองคลาสมีค่า HU ต่างกันชัด อย่าง LVC กับ MYO ตรงนี้ MYO ดีขึ้นกว่า 10 จุด และคลาสข้าง ๆ ก็ขยับขึ้นนิดหน่อย",
        en: "It works when the two classes have clearly different HU values: merging LVC with MYO lifted MYO by over 10 points and nudged neighbouring classes up too.",
      },
      {
        th: "บน KNUH Body Composition ค่า IMAT ซึ่งโมเดลชอบแยกไม่ออกจากกล้ามเนื้อ ขยับจาก 77.55 เป็น 77.85 ส่วนค่าเฉลี่ยแทบไม่เปลี่ยน",
        en: "On KNUH Body Composition, IMAT (often mistaken for muscle) moved from 77.55 to 77.85; the average barely changed.",
      },
      {
        th: "บน FLARE22 ค่าเฉลี่ยลดลงทุกการทดลอง (จาก 90.39 เหลือ 87.96 ถึง 89.46) ถ้า HU ใกล้กันแต่ขนาดต่างกันมาก โมเดลจะเอนไปทางอวัยวะใหญ่ และอวัยวะที่รูปร่างเปลี่ยนมากระหว่างสไลซ์ก็แยกขอบยาก",
        en: "On FLARE22 the average dropped in every experiment (baseline 90.39 vs 87.96 to 89.46). With similar HU and a big size gap the model favours the larger organ, and organs whose shape changes a lot between slices are hard to separate.",
      },
    ],
  },
  {
    slug: "cardiac-ct",
    kind: "journal",
    title: "Improving Cardiac Computed Tomography Scan Segmentation Using a U-Net Model with Continual Learning Techniques",
    authors: ["W. Khamprapai", "W. Thongsopa", "C. Deejaiwong", "J. Charoensuk", "S. Mathulaprangsan", "C. Chootong"],
    me: "W. Thongsopa",
    venue: "Proceedings of Engineering and Technology Innovation, vol. 33, pp. 22-32, 2026",
    doiUrl: "https://doi.org/10.46604/peti.2026.15705",
    articleUrl: "https://ojs.imeti.org/index.php/PETI/article/view/15705",
    pdf: {
      path: "/papers/cardiac-ct-segmentation-peti-2026.pdf",
      pages: 11,
      credit: {
        th: "© ผู้เขียน เผยแพร่ใน Proceedings of Engineering and Technology Innovation ภายใต้สัญญาอนุญาต CC BY-NC 4.0",
        en: "© the authors. Published in Proceedings of Engineering and Technology Innovation under CC BY-NC 4.0.",
      },
      licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
    },
    summary: {
      th: "ต่อยอดจากงาน ICCT 2024 มาที่หัวใจ แบ่งโครงสร้างหัวใจ 7 ส่วนจากภาพ CT ด้วย U-Net Partial ให้โมเดลเรียนอวัยวะที่ติดกันเป็นกลุ่มก่อนแล้วค่อยแยกด้วย continual learning ใช้ CLIP ช่วยแยกแต่ละคลาส และเทียบ optimizer กับ learning rate บน MM-WHS 2017",
      en: "Takes the ICCT 2024 method to the heart. Seven cardiac structures are segmented from CT with U-Net Partial: adjacent organs are learned as merged classes first and separated with continual learning, with CLIP embeddings to tell classes apart, comparing optimizers and learning rates on MM-WHS 2017.",
    },
    stats: [
      { value: 94.08, decimals: 2, suffix: "%", label: { th: "DSC สูงสุดที่รายงานในบทคัดย่อ", en: "top DSC reported in the abstract" } },
      { value: 92.03, decimals: 2, suffix: "%", label: { th: "IoU สูงสุดที่รายงานในบทคัดย่อ", en: "top IoU reported in the abstract" } },
      { value: 87.85, decimals: 2, suffix: "%", label: { th: "DSC ของกลุ่มที่รวม PA กับ RVC ดีที่สุดในขั้นรวมคลาส", en: "DSC for the PA + RVC group, best in the merging stage" } },
    ],
    comparison: {
      title: { th: "DSC ของขั้นรวมคลาส: Adam lr 1e-5 เทียบกับ AdamW lr 1e-4", en: "Merged-class DSC: Adam at 1e-5 vs AdamW at 1e-4" },
      note: {
        th: "จากตาราง 2 ในบทความ ขั้นที่ให้โมเดลเรียนอวัยวะที่ติดกันเป็นกลุ่มก่อนแยก AdamW lr 1e-4 ดีกว่าในทั้ง 4 กลุ่ม",
        en: "From Table 2 of the paper: the stage where adjacent organs are learned as one group before they are separated. AdamW at 1e-4 is higher in all four groups.",
      },
      baselineLabel: { th: "Adam lr 1e-5", en: "Adam, lr 1e-5" },
      proposedLabel: { th: "AdamW lr 1e-4", en: "AdamW, lr 1e-4" },
      rows: [
        { label: "LVC + MYO", baseline: 83.23, proposed: 83.76 },
        { label: "MYO + RVC", baseline: 81.34, proposed: 84.91 },
        { label: "PA + RVC", baseline: 83.51, proposed: 87.85 },
        { label: "RAC + RVC", baseline: 75.54, proposed: 79.74 },
      ],
    },
    findings: [
      {
        th: "AdamW ที่ learning rate 1e-4 ได้ผลดีสุดในภาพรวม เห็นชัดที่ aorta (AA) ได้ DSC 94.75",
        en: "AdamW at a 1e-4 learning rate was the strongest setting overall, most clearly on the aorta (AA) at 94.75 DSC.",
      },
      {
        th: "PA กับ LAC ยังยาก PA เล็กและรูปร่างต่างกันมากในแต่ละคน ส่วน LAC ขอบไม่ชัดในภาพ CT วิธีนี้ช่วยเรื่องอวัยวะใหญ่ที่ติดกัน แต่อาจทำให้ขอบของโครงสร้างเล็กเบลอลง",
        en: "PA and LAC remain hard: PA is small and varies a lot between patients, and LAC has weak boundaries in CT. The method reduces confusion between large neighbours but can blur the edges of small structures.",
      },
      {
        th: "ข้อจำกัด: ใช้ชุดข้อมูลสาธารณะชุดเดียวที่มี CT ไม่มาก และเทียบแค่กับ U-Net baseline",
        en: "Limits: one public dataset with few CT volumes, compared only against a U-Net baseline.",
      },
    ],
  },
];

export function getPaper(slug: string): Paper | undefined {
  return papers.find((p) => p.slug === slug);
}
