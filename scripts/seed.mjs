// Loads db/seed.json into an EMPTY database. Tables that already have rows are
// left alone, so running this after editing content in /admin never overwrites it.
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

async function isEmpty(table) {
  const [[row]] = await conn.query(`SELECT COUNT(*) AS n FROM ${table}`);
  return Number(row.n) === 0;
}

try {
  await conn.beginTransaction();

  if (await isEmpty("projects")) {
    for (const [i, p] of seed.projects.entries()) {
      await conn.execute(
        `INSERT INTO projects
           (slug, title, summary, description, role, tech, highlights,
            repo_url, live_url, year, featured, published, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.slug, p.title, p.summary, p.description, p.role,
          JSON.stringify(p.tech), JSON.stringify(p.highlights),
          p.repo_url, p.live_url, p.year, p.featured ? 1 : 0, p.published ? 1 : 0,
          (i + 1) * 10,
        ],
      );
    }
    console.log(`seeded ${seed.projects.length} projects`);
  }

  if (await isEmpty("skills")) {
    for (const [category, names] of Object.entries(seed.skills)) {
      for (const [i, name] of names.entries()) {
        await conn.execute(
          "INSERT INTO skills (category, name, sort_order) VALUES (?, ?, ?)",
          [category, name, (i + 1) * 10],
        );
      }
    }
    console.log("seeded skills");
  }

  if (await isEmpty("experiences")) {
    for (const [i, e] of seed.experiences.entries()) {
      await conn.execute(
        "INSERT INTO experiences (company, title, period, summary, sort_order) VALUES (?, ?, ?, ?, ?)",
        [e.company, e.title, e.period, e.summary, (i + 1) * 10],
      );
    }
    console.log("seeded experiences");
  }

  await conn.commit();
} catch (err) {
  await conn.rollback();
  throw err;
} finally {
  await conn.end();
}
