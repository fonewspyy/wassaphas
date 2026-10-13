// Language-independent identity. Translated copy (role, tagline, about) lives in
// src/i18n/dictionaries.ts; projects, skills and experience live in the database.
export const profile = {
  name: "Wassaphas Thongsopa",
  handle: "fonewspyy",
  // Shown in the contact section next to the form.
  email: "wassaphas.th@gmail.com" as string | null,
  links: {
    github: "https://github.com/fonewspyy",
    linkedin: "https://www.linkedin.com/in/wassaphas20",
  },
  // Black-and-white portrait for the ID badge in the hero (public/). Null shows the mascot.
  photo: "/me.jpg" as string | null,
  // Put the PDF at public/resume.pdf and set this to "/resume.pdf" to show the button.
  resumeUrl: null as string | null,
  siteUrl: "https://wassaphas.com",
} as const;
