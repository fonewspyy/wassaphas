import "server-only";
import { createHmac } from "node:crypto";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { db } from "./db";
import { appSecret } from "./secret";

// First-party page view + click counting. Visitors are identified only by a hash
// that changes every UTC day (see db/migrations/004_analytics.sql).

export const trackSchema = z.object({
  type: z.enum(["pageview", "click"]),
  path: z.string().startsWith("/").max(300),
  target: z.string().trim().max(200).optional(),
  href: z.string().max(300).optional(),
  referrer: z.string().max(500).optional(),
  lang: z.string().max(5).optional(),
});

export type TrackInput = z.infer<typeof trackSchema>;

const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|curl|wget|python|go-http|java\//i;
// Enough for any real person clicking around; stops a script from filling the table.
const MAX_EVENTS_PER_MINUTE = 60;

export function isBot(userAgent: string): boolean {
  return !userAgent || BOT_UA.test(userAgent);
}

function visitorHash(ip: string, userAgent: string): string {
  const day = new Date().toISOString().slice(0, 10);
  return createHmac("sha256", appSecret()).update(`visitor:${day}:${ip}:${userAgent}`).digest("hex");
}

function device(ua: string): "mobile" | "tablet" | "desktop" {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android/i.test(ua)) return "mobile";
  return "desktop";
}

function browser(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\/|opera/i.test(ua)) return "Opera";
  if (/samsungbrowser/i.test(ua)) return "Samsung Internet";
  if (/line\//i.test(ua)) return "LINE";
  if (/fban|fbav/i.test(ua)) return "Facebook";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua)) return "Safari";
  return "Other";
}

// Only keep referrers from other sites; internal navigation isn't a traffic source.
function referrerHost(referrer: string | undefined, ownHost: string | null): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host && host !== ownHost?.replace(/^www\./, "") ? host.slice(0, 200) : null;
  } catch {
    return null;
  }
}

export type RequestMeta = { ip: string; userAgent: string; country: string | null; host: string | null };

export async function recordEvent(input: TrackInput, meta: RequestMeta): Promise<void> {
  const hash = visitorHash(meta.ip, meta.userAgent);
  const [[recent]] = await db().query<RowDataPacket[]>(
    `SELECT COUNT(*) AS n FROM analytics_events
     WHERE visitor_hash = ? AND created_at > NOW() - INTERVAL 1 MINUTE`,
    [hash],
  );
  if (Number(recent.n) >= MAX_EVENTS_PER_MINUTE) return;

  const country = meta.country && /^[A-Z]{2}$/.test(meta.country) && meta.country !== "XX" ? meta.country : null;
  await db().execute(
    `INSERT INTO analytics_events
       (type, path, target, href, referrer_host, country, device, browser, lang, visitor_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.type,
      input.path,
      input.type === "click" ? input.target || null : null,
      input.type === "click" ? input.href || null : null,
      input.type === "pageview" ? referrerHost(input.referrer, meta.host) : null,
      country,
      device(meta.userAgent),
      browser(meta.userAgent),
      input.lang ?? null,
      hash,
    ],
  );
}

// ---- Admin reporting ----

export type CountRow = { label: string; count: number; visitors?: number };
export type DailyRow = { day: string; pageviews: number; visitors: number; clicks: number };
export type RecentEvent = {
  createdAt: string;
  type: "pageview" | "click";
  path: string;
  target: string | null;
  country: string | null;
  device: string;
  browser: string;
  referrer: string | null;
  visitor: string;
};

export type AnalyticsReport = {
  totals: { pageviews: number; visitors: number; clicks: number };
  daily: DailyRow[];
  pages: CountRow[];
  clicks: CountRow[];
  referrers: CountRow[];
  countries: CountRow[];
  devices: CountRow[];
  browsers: CountRow[];
  recent: RecentEvent[];
};

const toCounts = (rows: RowDataPacket[]): CountRow[] =>
  rows.map((r) => ({
    label: String(r.label ?? "—"),
    count: Number(r.n),
    ...(r.v !== undefined && { visitors: Number(r.v) }),
  }));

export async function getAnalyticsReport(days: number): Promise<AnalyticsReport> {
  const since = "created_at > NOW() - INTERVAL ? DAY";
  const q = (sql: string) => db().query<RowDataPacket[]>(sql, [days]).then(([rows]) => rows);

  const [totals, daily, pages, clicks, referrers, countries, devices, browsers, recent] = await Promise.all([
    q(`SELECT SUM(type = 'pageview') AS pv, SUM(type = 'click') AS cl,
              COUNT(DISTINCT IF(type = 'pageview', visitor_hash, NULL)) AS v
       FROM analytics_events WHERE ${since}`),
    q(`SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day, SUM(type = 'pageview') AS pv,
              COUNT(DISTINCT IF(type = 'pageview', visitor_hash, NULL)) AS v, SUM(type = 'click') AS cl
       FROM analytics_events WHERE ${since} GROUP BY day ORDER BY day DESC`),
    q(`SELECT path AS label, COUNT(*) AS n, COUNT(DISTINCT visitor_hash) AS v
       FROM analytics_events WHERE type = 'pageview' AND ${since}
       GROUP BY path ORDER BY n DESC LIMIT 20`),
    q(`SELECT CONCAT(COALESCE(target, '(no label)'), IF(href IS NULL, '', CONCAT('  →  ', href))) AS label,
              COUNT(*) AS n, COUNT(DISTINCT visitor_hash) AS v
       FROM analytics_events WHERE type = 'click' AND ${since}
       GROUP BY target, href ORDER BY n DESC LIMIT 30`),
    q(`SELECT COALESCE(referrer_host, '(direct / unknown)') AS label, COUNT(*) AS n
       FROM analytics_events WHERE type = 'pageview' AND ${since}
       GROUP BY referrer_host ORDER BY n DESC LIMIT 15`),
    q(`SELECT COALESCE(country, '??') AS label, COUNT(DISTINCT visitor_hash) AS n
       FROM analytics_events WHERE ${since} GROUP BY country ORDER BY n DESC LIMIT 20`),
    q(`SELECT device AS label, COUNT(DISTINCT visitor_hash) AS n
       FROM analytics_events WHERE ${since} GROUP BY device ORDER BY n DESC`),
    q(`SELECT browser AS label, COUNT(DISTINCT visitor_hash) AS n
       FROM analytics_events WHERE ${since} GROUP BY browser ORDER BY n DESC`),
    q(`SELECT created_at, type, path, target, country, device, browser, referrer_host, visitor_hash
       FROM analytics_events WHERE ${since} ORDER BY id DESC LIMIT 100`),
  ]);

  return {
    totals: {
      pageviews: Number(totals[0]?.pv ?? 0),
      visitors: Number(totals[0]?.v ?? 0),
      clicks: Number(totals[0]?.cl ?? 0),
    },
    daily: daily.map((r) => ({
      day: r.day,
      pageviews: Number(r.pv),
      visitors: Number(r.v),
      clicks: Number(r.cl),
    })),
    pages: toCounts(pages),
    clicks: toCounts(clicks),
    referrers: toCounts(referrers),
    countries: toCounts(countries),
    devices: toCounts(devices),
    browsers: toCounts(browsers),
    recent: recent.map((r) => ({
      createdAt: r.created_at,
      type: r.type,
      path: r.path,
      target: r.target,
      country: r.country,
      device: r.device,
      browser: r.browser,
      referrer: r.referrer_host,
      // Short tag so the admin can see which events came from the same visitor that day.
      visitor: String(r.visitor_hash).slice(0, 6),
    })),
  };
}
