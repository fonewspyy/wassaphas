// Identity and links. Changes here ship with a deploy; projects, skills and
// experience live in the database and are edited from /admin.
export const profile = {
  name: "Wassaphas Thongsopa",
  handle: "fonewspyy",
  role: "Full-Stack Developer & AI Builder",
  location: "Bangkok, Thailand",
  tagline: "I build web systems end to end — front end, API and database — and the AI agents that help ship them.",
  about: [
    "I work across the whole stack: React and Next.js on the front, Node.js and Python services behind it, and SQL databases underneath — from MariaDB and PostgreSQL to SQL Server stored procedures.",
    "Lately most of my time goes into AI agents that do real engineering work safely: orchestration across accounts, permission gates that stop a risky SQL statement before it runs, and skill packs that make agents think before they code.",
    "My rule of thumb: prototype fast, then make it hold up.",
  ],
  // Shown publicly when set. Left empty: visitors use the contact form instead.
  email: null as string | null,
  links: {
    github: "https://github.com/fonewspyy",
  },
  // Put the PDF at public/resume.pdf and set this to "/resume.pdf" to show the button.
  resumeUrl: null as string | null,
  siteUrl: "https://wassaphas.com",
} as const;
