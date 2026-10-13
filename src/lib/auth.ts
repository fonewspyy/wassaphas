import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { appSecret } from "./secret";

// Single-admin auth: one password from ADMIN_PASSWORD, a signed expiring cookie.
// No user table on purpose — this site has exactly one editor.

const COOKIE = "admin_session";
const SESSION_HOURS = 12;

function sign(payload: string): string {
  return createHmac("sha256", appSecret()).update(`session:${payload}`).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  // Hash first so lengths match and timingSafeEqual never throws.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false; // admin disabled until a password is configured
  return safeEqual(candidate, expected);
}

export async function startSession(): Promise<void> {
  const expires = Date.now() + SESSION_HOURS * 3600_000;
  const value = `${expires}.${sign(String(expires))}`;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expires),
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [expires, sig] = value.split(".");
  if (!expires || !sig || !safeEqual(sig, sign(expires))) return false;
  return Number(expires) > Date.now();
}

/** Guard for admin pages and every admin Server Action. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
