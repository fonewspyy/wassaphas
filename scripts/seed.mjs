// Loads db/seed.json.
// - Empty tables are filled in full.
// - Tables that already have rows are left alone, so content edited in /admin is never
//   overwritten, EXCEPT for one-time content refreshes listed in CONTENT_REFRESHES below.
//   A refresh only touches rows nobody has edited (projects.updated_at = created_at) and
//   is recorded in schema_migrations so it never runs twice.
// Usage: DATABASE_URL=... node scripts/seed.mjs
import { readFile } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const seed = JSON.parse(
  await readFile(path.join(import.meta.dirname, "..", "db", "seed.json"), "utf8"),
);
const conn = await mysql.createConnection({ uri: url });

const json = (v) => (v == null ? null : JSON.stringify(v));

function projectValues(p) {
  return [
    p.title, p.summary, p.summary_th, p.description, p.description_th, p.role, p.role_th,
    json(p.tech), json(p.highlights), json(p.highlights_th), p.repo_url, p.live_url, p.year,
  ];
}

async function insertExperiences() {
  for (const [i, e] of seed.experiences.entries()) {
    await conn.execute(
      `INSERT INTO experiences (company, title, title_th, period, period_th, summary, summary_th,
         highlights, highlights_th, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        e.company, e.title, e.title_th, e.period, e.period_th, e.summary, e.summary_th,
        json(e.highlights), json(e.highlights_th), (i + 1) * 10,
      ],
    );
  }
}

async function insertSkills() {
  for (const [category, names] of Object.entries(seed.skills)) {
    for (const [i, name] of names.entries()) {
      await conn.execute(
        "INSERT INTO skills (category, name, sort_order) VALUES (?, ?, ?)",
        [category, name, (i + 1) * 10],
      );
    }
  }
}

async function isEmpty(table) {
  const [[row]] = await conn.query(`SELECT COUNT(*) AS n FROM ${table}`);
  return Number(row.n) === 0;
}

// 2026-10: Thai translations plus rewritten English copy for the first seed.
async function refreshContentV2() {
  let projects = 0;
  for (const p of seed.projects) {
    const [res] = await conn.execute(
      `UPDATE projects SET
         title = ?, summary = ?, summary_th = ?, description = ?, description_th = ?,
         role = ?, role_th = ?, tech = ?, highlights = ?, highlights_th = ?,
         repo_url = ?, live_url = ?, year = ?, updated_at = created_at
       WHERE slug = ? AND updated_at = created_at`,
      [...projectValues(p), p.slug],
    );
    projects += res.affectedRows;
  }
  let experiences = 0;
  for (const e of seed.experiences) {
    const [res] = await conn.execute(
      `UPDATE experiences SET title_th = ?, period = ?, period_th = ?, summary = ?, summary_th = ?
       WHERE company = ? AND title = ? AND title_th IS NULL`,
      [e.title_th, e.period, e.period_th, e.summary, e.summary_th, e.company, e.title],
    );
    experiences += res.affectedRows;
  }
  // Skills have no admin editor, so seed.json is their only source: replace them outright.
  await conn.query("DELETE FROM skills");
  await insertSkills();
  console.log(`content-v2: refreshed ${projects} unedited projects, ${experiences} experiences, all skills`);
}

// 2026-10: career history from the real résumé replaces the placeholder roles.
// Experiences and skills have no admin editor, so seed.json is their only source.
async function refreshContentV3() {
  await conn.query("DELETE FROM experiences");
  await insertExperiences();
  await conn.query("DELETE FROM skills");
  await insertSkills();
  console.log("content-v3: replaced experiences and skills");
}

// 2026-10: plainer Thai and English wording for the career history.
async function refreshContentV4() {
  await conn.query("DELETE FROM experiences");
  await insertExperiences();
  console.log("content-v4: rewrote experiences");
}

// 2026-10: adds the stored-procedure snapshot work to the Beger entry.
async function refreshContentV5() {
  await conn.query("DELETE FROM experiences");
  await insertExperiences();
  console.log("content-v5: rewrote experiences");
}

// 2026-10: Beger entry checked against the repos; claims narrowed to what they show.
async function refreshContentV6() {
  await conn.query("DELETE FROM experiences");
  await insertExperiences();
  console.log("content-v6: rewrote experiences");
}

// 2026-10: Beger entry cut to its four strongest items; production scale added, the
// query-tuning claim dropped because its source couldn't be traced.
async function refreshContentV7() {
  await conn.query("DELETE FROM experiences");
  await insertExperiences();
  console.log("content-v7: rewrote experiences");
}

// 2026-10: Beger entry reworded after review (AI-agent item added, repetition and a
// customer-impact detail removed); "Query Store tuning" dropped from skills.
async function refreshContentV8() {
  await conn.query("DELETE FROM experiences");
  await insertExperiences();
  await conn.query("DELETE FROM skills");
  await insertSkills();
  console.log("content-v8: rewrote experiences and skills");
}

// 2026-10: content audit. Fuller tech stack (C#/.NET, Dart, testing, integrations),
// "per 3 months" made a dated window, all three research datasets named.
async function refreshContentV9() {
  await conn.query("DELETE FROM experiences");
  await insertExperiences();
  await conn.query("DELETE FROM skills");
  await insertSkills();
  console.log("content-v9: replaced experiences and skills");
}

// 2026-10: Beger entry rewritten for HR readers: outcome first, technical detail after.
async function refreshContentV10() {
  await conn.query("DELETE FROM experiences");
  await insertExperiences();
  console.log("content-v10: rewrote experiences");
}

// 2026-10: 5.4M corrected to 5.3M successful write requests (5,347,492 rounds down);
// skills he hasn't used (PostgreSQL, SQLite, Prisma, DbUp) removed.
async function refreshContentV11() {
  await conn.query("DELETE FROM experiences");
  await insertExperiences();
  await conn.query("DELETE FROM skills");
  await insertSkills();
  console.log("content-v11: replaced experiences and skills");
}

// 2026-10: Beger entry rewritten in plain language with fewer figures; handheld item
// reframed around the rule checks, AI ticket-fixing item added.
async function refreshContentV12() {
  await conn.query("DELETE FROM experiences");
  await insertExperiences();
  console.log("content-v12: rewrote experiences");
}

// 2026-10: AI taken out of the career story: the agent-ticket item and the AI coding
// tools in skills removed.
async function refreshContentV13() {
  await conn.query("DELETE FROM experiences");
  await insertExperiences();
  await conn.query("DELETE FROM skills");
  await insertSkills();
  console.log("content-v13: replaced experiences and skills");
}

const CONTENT_REFRESHES = [
  ["seed:content-v2", refreshContentV2],
  ["seed:content-v3", refreshContentV3],
  ["seed:content-v4", refreshContentV4],
  ["seed:content-v5", refreshContentV5],
  ["seed:content-v6", refreshContentV6],
  ["seed:content-v7", refreshContentV7],
  ["seed:content-v8", refreshContentV8],
  ["seed:content-v9", refreshContentV9],
  ["seed:content-v10", refreshContentV10],
  ["seed:content-v11", refreshContentV11],
  ["seed:content-v12", refreshContentV12],
  ["seed:content-v13", refreshContentV13],
];

try {
  await conn.beginTransaction();

  if (await isEmpty("projects")) {
    for (const [i, p] of seed.projects.entries()) {
      await conn.execute(
        `INSERT INTO projects
           (title, summary, summary_th, description, description_th, role, role_th,
            tech, highlights, highlights_th, repo_url, live_url, year,
            slug, featured, published, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [...projectValues(p), p.slug, p.featured ? 1 : 0, p.published ? 1 : 0, (i + 1) * 10],
      );
    }
    console.log(`seeded ${seed.projects.length} projects`);
  }

  if (await isEmpty("skills")) {
    await insertSkills();
    console.log("seeded skills");
  }

  if (await isEmpty("experiences")) {
    await insertExperiences();
    console.log("seeded experiences");
  }

  // On a fresh database a refresh rewrites the values it just inserted, which is harmless.
  const [doneRows] = await conn.query("SELECT name FROM schema_migrations WHERE name LIKE 'seed:%'");
  const done = new Set(doneRows.map((r) => r.name));
  for (const [name, run] of CONTENT_REFRESHES) {
    if (done.has(name)) continue;
    await run();
    await conn.execute("INSERT INTO schema_migrations (name) VALUES (?)", [name]);
  }

  await conn.commit();
} catch (err) {
  await conn.rollback();
  throw err;
} finally {
  await conn.end();
}
