// Language-independent identity. Translated copy (role, tagline, about) lives in
// src/i18n/dictionaries.ts; projects, skills and experience live in the database.
export const profile = {
  name: "Wassaphas Thongsopa",
  handle: "fonewspyy",
  // Shown publicly when set. Left empty: visitors use the contact form instead.
  email: null as string | null,
  links: {
    github: "https://github.com/fonewspyy",
  },
  // Put the PDF at public/resume.pdf and set this to "/resume.pdf" to show the button.
  resumeUrl: null as string | null,
  siteUrl: "https://wassaphas.com",
} as const;
