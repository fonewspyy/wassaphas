import { recordEvent, trackSchema, isBot } from "@/lib/analytics";
import { isAdmin } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";
import { clientIp } from "@/lib/request";

// POST /api/track — sent by <Analytics /> via navigator.sendBeacon (text/plain JSON).
// Always answers 204 so the page never cares whether an event was kept.
export async function POST(request: Request) {
  const noContent = new Response(null, { status: 204 });
  const userAgent = request.headers.get("user-agent") ?? "";
  if (!hasDatabase() || isBot(userAgent) || (await isAdmin())) return noContent;

  let body: unknown;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return noContent;
  }
  const parsed = trackSchema.safeParse(body);
  if (!parsed.success) return noContent;

  try {
    await recordEvent(parsed.data, {
      ip: clientIp(request.headers),
      userAgent,
      country: request.headers.get("cf-ipcountry"),
      host: request.headers.get("host"),
    });
  } catch (error) {
    console.error("analytics: failed to record event", error);
  }
  return noContent;
}
