import { connection } from "next/server";
import { db, hasDatabase } from "@/lib/db";

// Used by the deploy workflow to decide whether a release is healthy.
export async function GET() {
  await connection();
  if (!hasDatabase()) {
    return Response.json({ status: "ok", db: "not-configured" });
  }
  try {
    await db().query("SELECT 1");
    return Response.json({ status: "ok", db: "ok" });
  } catch (err) {
    console.error("health: database check failed", err);
    return Response.json({ status: "degraded", db: "down" }, { status: 503 });
  }
}
