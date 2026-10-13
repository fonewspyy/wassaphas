import "server-only";

// Signs admin sessions and salts IP hashes. Rotating it logs the admin out and
// resets contact-form rate limits; nothing else depends on it.
export function appSecret(): string {
  const secret = process.env.APP_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV !== "production") return "dev-only-secret-do-not-use-in-production!!";
  throw new Error("APP_SECRET must be set (at least 32 characters)");
}
