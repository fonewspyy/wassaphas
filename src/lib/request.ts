import "server-only";

// Traffic arrives Cloudflare -> nginx -> Next. Cloudflare sets cf-connecting-ip;
// nginx sets x-real-ip. Used only for rate limiting, so a spoofed value just
// moves the caller into a different bucket.
export function clientIp(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip") ??
    headers.get("x-real-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
