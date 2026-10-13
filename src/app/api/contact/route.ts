import { hasDatabase } from "@/lib/db";
import { contactSchema, saveContactMessage } from "@/lib/messages";
import { clientIp } from "@/lib/request";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    // A filled honeypot means a bot: pretend it worked so it doesn't retry.
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return Response.json({ ok: true });
    }
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return Response.json({ error: "Validation failed", fieldErrors }, { status: 422 });
  }

  if (!hasDatabase()) {
    return Response.json({ error: "Contact form is not configured" }, { status: 503 });
  }

  const result = await saveContactMessage(parsed.data, clientIp(request.headers));
  if (!result.ok) {
    return Response.json(
      { error: "Too many messages. Please try again in a few minutes." },
      { status: 429 },
    );
  }
  return Response.json({ ok: true }, { status: 201 });
}
