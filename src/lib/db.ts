import "server-only";
import mysql from "mysql2/promise";

// One pool per server process. In dev, HMR re-evaluates modules, so keep it on globalThis.
const globalForDb = globalThis as unknown as { dbPool?: mysql.Pool };

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function db(): mysql.Pool {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  globalForDb.dbPool ??= mysql.createPool({
    uri: url,
    connectionLimit: 5,
    // DATETIME columns come back as JS Dates in server-local time; keep them as strings
    // so formatting never shifts by the process's TZ.
    dateStrings: true,
  });
  return globalForDb.dbPool;
}

// MariaDB stores JSON as LONGTEXT, so the driver may hand back a string.
export function parseJsonArray(value: unknown): string[] {
  const parsed = typeof value === "string" ? JSON.parse(value) : value;
  return Array.isArray(parsed) ? parsed.map(String) : [];
}
