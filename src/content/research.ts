// Citation details are the same in both languages; labels and notes live in the dictionary.
// Checked against the published PDF (PETI vol. 33, 2026).
export const publication = {
  title: "Improving Cardiac Computed Tomography Scan Segmentation Using a U-Net Model with Continual Learning Techniques",
  authors: ["W. Khamprapai", "W. Thongsopa", "C. Deejaiwong", "J. Charoensuk", "S. Mathulaprangsan", "C. Chootong"],
  me: "W. Thongsopa",
  venue: "Proceedings of Engineering and Technology Innovation, vol. 33, pp. 22-32, 2026",
  articleUrl: "https://ojs.imeti.org/index.php/PETI/article/view/15705",
  doiUrl: "https://doi.org/10.46604/peti.2026.15705",
  // Open access under CC BY-NC 4.0, which allows non-commercial redistribution with credit.
  pdfPath: "/papers/cardiac-ct-segmentation-peti-2026.pdf",
  licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
  pages: 11,
} as const;

// The ICCT 2024 Best Paper (cited as ref. [9] in the article above).
export const awardPaper = {
  title: "Refining Class Confusion with Pixel Adjacency and Continual Learning in Medical Image Segmentation",
  venue: "Proceedings of the 7th International Conference on Culture Technology (ICCT 2024), pp. 86-92",
} as const;
