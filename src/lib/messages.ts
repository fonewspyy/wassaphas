import "server-only";
import { createHmac } from "node:crypto";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { db } from "./db";
import { appSecret } from "./secret";
import type { ContactMessage } from "./types";

// Messages are error codes, not prose: the form translates them (ContactErrorCode).
export const contactSchema = z.object({
  name: z.string().trim().min(1, "name_required").max(120, "too_long"),
  email: z.email("email_invalid").max(200, "email_invalid"),
  message: z.string().trim().min(10, "message_too_short").max(5000, "too_long"),
  // Honeypot: real users never see this field, bots fill it in.
  website: z.string().max(0).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

const WINDOW_MINUTES = 10;
const MAX_PER_WINDOW = 3;

export function hashIp(ip: string): string {
  return createHmac("sha256", appSecret()).update(`ip:${ip}`).digest("hex");
}

export type SaveResult = { ok: true } | { ok: false; reason: "rate_limited" };

export async function saveContactMessage(input: ContactInput, ip: string): Promise<SaveResult> {
  const ipHash = hashIp(ip);
  const [[recent]] = await db().query<RowDataPacket[]>(
    `SELECT COUNT(*) AS n FROM contact_messages
     WHERE ip_hash = ? AND created_at > NOW() - INTERVAL ? MINUTE`,
    [ipHash, WINDOW_MINUTES],
  );
  if (Number(recent.n) >= MAX_PER_WINDOW) return { ok: false, reason: "rate_limited" };

  await db().execute(
    "INSERT INTO contact_messages (name, email, message, ip_hash) VALUES (?, ?, ?, ?)",
    [input.name, input.email, input.message, ipHash],
  );
  return { ok: true };
}

export async function listMessages(): Promise<ContactMessage[]> {
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT id, name, email, message, is_read, created_at
     FROM contact_messages ORDER BY created_at DESC LIMIT 200`,
  );
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    message: r.message,
    isRead: Boolean(r.is_read),
    createdAt: r.created_at,
  }));
}

export async function setMessageRead(id: number, isRead: boolean): Promise<void> {
  await db().execute("UPDATE contact_messages SET is_read = ? WHERE id = ?", [isRead ? 1 : 0, id]);
}

export async function deleteMessage(id: number): Promise<void> {
  await db().execute("DELETE FROM contact_messages WHERE id = ?", [id]);
}
