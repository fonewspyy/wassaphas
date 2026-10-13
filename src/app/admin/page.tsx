import Link from "next/link";
import { Suspense } from "react";
import { ConfirmButton } from "@/components/confirm-button";
import { Skeleton } from "@/components/section";
import { requireAdmin } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";
import { listMessages } from "@/lib/messages";
import { getAllProjects } from "@/lib/portfolio";
import { logout, removeMessage, toggleMessageRead } from "./actions";

export default function AdminPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  await requireAdmin();
  const [projects, messages] = await Promise.all([
    getAllProjects(),
    hasDatabase() ? listMessages() : Promise.resolve([]),
  ]);
  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <form action={logout}>
          <button className="text-sm text-muted hover:text-text">Sign out</button>
        </form>
      </div>

      {!hasDatabase() && (
        <p className="rounded-lg border border-border bg-surface-2 p-4 text-sm">
          No DATABASE_URL is set, so this shows seed data read-only and saving will fail.
        </p>
      )}

      <section aria-labelledby="projects-h">
        <div className="flex items-center justify-between">
          <h2 id="projects-h" className="text-lg font-semibold">
            Projects <span className="font-normal text-muted">({projects.length})</span>
          </h2>
          <Link href="/admin/projects/new" className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-text hover:opacity-90">
            New project
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2.5 font-medium">Title</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Order</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.title}</p>
                    <p className="font-mono text-xs text-muted">/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.published ? "text-accent" : "text-muted"}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                    {p.featured && <span className="ml-2 text-xs text-muted">★ featured</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{p.sortOrder}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/projects/${p.id}`} className="font-medium text-accent">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="messages" aria-labelledby="messages-h">
        <h2 id="messages-h" className="text-lg font-semibold">
          Messages <span className="font-normal text-muted">({unread} unread)</span>
        </h2>
        {messages.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No messages yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {messages.map((m) => (
              <li
                key={m.id}
                className={`rounded-xl border bg-surface p-4 ${m.isRead ? "border-border" : "border-accent/40"}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium">
                    {m.name}{" "}
                    <a href={`mailto:${m.email}`} className="font-normal text-accent">
                      {m.email}
                    </a>
                  </p>
                  <span className="font-mono text-xs text-muted">{m.createdAt}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
                <div className="mt-3 flex gap-4 text-sm">
                  <form action={toggleMessageRead.bind(null, m.id, !m.isRead)}>
                    <button className="text-muted hover:text-text">
                      Mark {m.isRead ? "unread" : "read"}
                    </button>
                  </form>
                  <form action={removeMessage.bind(null, m.id)}>
                    <ConfirmButton message="Delete this message?" className="text-danger">
                      Delete
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
