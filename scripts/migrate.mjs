// Applies db/migrations/*.sql in filename order, once each.
// Usage: DATABASE_URL=mysql://user:pass@127.0.0.1:3306/db node scripts/migrate.mjs
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const dir = path.join(import.meta.dirname, "..", "db", "migrations");
const conn = await mysql.createConnection({ uri: url, multipleStatements: true });

try {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       VARCHAR(200) NOT NULL PRIMARY KEY,
      applied_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  const [rows] = await conn.query("SELECT name FROM schema_migrations");
  const applied = new Set(rows.map((r) => r.name));
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = await readFile(path.join(dir, file), "utf8");
    // MariaDB DDL auto-commits, so a failed migration can be half-applied.
    // Keep each file small and idempotent-safe to fix forward.
    console.log(`applying ${file}`);
    await conn.query(sql);
    await conn.query("INSERT INTO schema_migrations (name) VALUES (?)", [file]);
  }
  console.log("migrations up to date");
} finally {
  await conn.end();
}
