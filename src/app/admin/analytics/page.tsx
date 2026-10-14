import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/section";
import { getAnalyticsReport, type CountRow } from "@/lib/analytics";
import { requireAdmin } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";

const RANGES = [1, 7, 30, 90, 365] as const;

export default function AnalyticsPage({ searchParams }: PageProps<"/admin/analytics">) {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <Report searchParams={searchParams} />
    </Suspense>
  );
}

async function Report({ searchParams }: { searchParams: PageProps<"/admin/analytics">["searchParams"] }) {
  await requireAdmin();
  const requested = Number((await searchParams).days);
  const days = RANGES.find((d) => d === requested) ?? 30;

  if (!hasDatabase()) {
    return <p className="text-sm text-muted">Analytics needs DATABASE_URL.</p>;
  }
  const r = await getAnalyticsReport(days);
  const maxDaily = Math.max(1, ...r.daily.map((d) => d.pageviews));

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <nav className="flex gap-1 text-sm">
          {RANGES.map((d) => (
            <Link
              key={d}
              href={`/admin/analytics?days=${d}`}
              className={`rounded-lg px-3 py-1.5 ${d === days ? "bg-accent text-accent-text" : "text-muted hover:text-text"}`}
            >
              {d === 1 ? "24h" : `${d}d`}
            </Link>
          ))}
        </nav>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Page views" value={r.totals.pageviews} />
        <Stat label="Visitors" value={r.totals.visitors} hint="counted per day" />
        <Stat label="Clicks" value={r.totals.clicks} />
      </div>

      <Panel title="By day">
        {r.daily.length === 0 ? (
          <Empty />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Day</th>
                <th className="px-4 py-2 font-medium">Views</th>
                <th className="px-4 py-2 font-medium">Visitors</th>
                <th className="px-4 py-2 font-medium">Clicks</th>
                <th className="w-1/2 px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {r.daily.map((d) => (
                <tr key={d.day} className="border-t border-border">
                  <td className="px-4 py-2 font-mono text-xs">{d.day}</td>
                  <td className="px-4 py-2">{d.pageviews}</td>
                  <td className="px-4 py-2">{d.visitors}</td>
                  <td className="px-4 py-2">{d.clicks}</td>
                  <td className="px-4 py-2">
                    <div className="h-2 rounded bg-accent/70" style={{ width: `${(d.pageviews / maxDaily) * 100}%` }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      <div className="grid gap-8 lg:grid-cols-2">
        <Counts title="Top pages" rows={r.pages} unit="views" />
        <Counts title="Traffic sources" rows={r.referrers} unit="views" />
        <Counts title="Countries" rows={r.countries} unit="visitors" />
        <Counts title="Devices" rows={r.devices} unit="visitors" />
        <Counts title="Browsers" rows={r.browsers} unit="visitors" />
      </div>

      <Counts title="What people click" rows={r.clicks} unit="clicks" />

      <Panel title="Latest activity">
        {r.recent.length === 0 ? (
          <Empty />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-2 font-medium">Time</th>
                  <th className="px-4 py-2 font-medium">Visitor</th>
                  <th className="px-4 py-2 font-medium">Event</th>
                  <th className="px-4 py-2 font-medium">Where</th>
                </tr>
              </thead>
              <tbody>
                {r.recent.map((e, i) => (
                  <tr key={i} className="border-t border-border align-top">
                    <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-muted">{e.createdAt}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-xs">
                      <span className="font-mono">#{e.visitor}</span>{" "}
                      <span className="text-muted">
                        {e.country ?? "??"} · {e.device} · {e.browser}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {e.type === "pageview" ? "View" : <span className="text-accent">Click: {e.target ?? "—"}</span>}
                      {e.referrer && <span className="text-xs text-muted"> from {e.referrer}</span>}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">{e.path}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums">{value.toLocaleString()}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">{children}</div>
    </section>
  );
}

function Counts({ title, rows, unit }: { title: string; rows: CountRow[]; unit: string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <Panel title={title}>
      {rows.length === 0 ? (
        <Empty />
      ) : (
        <ul className="divide-y divide-border text-sm">
          {rows.map((row) => (
            <li key={row.label} className="relative px-4 py-2">
              <div className="absolute inset-y-0 left-0 bg-accent/10" style={{ width: `${(row.count / max) * 100}%` }} />
              <div className="relative flex justify-between gap-4">
                <span className="break-all">{row.label}</span>
                <span className="shrink-0 tabular-nums text-muted">
                  {row.count} {unit}
                  {row.visitors !== undefined && ` · ${row.visitors} people`}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function Empty() {
  return <p className="p-4 text-sm text-muted">No data yet.</p>;
}
