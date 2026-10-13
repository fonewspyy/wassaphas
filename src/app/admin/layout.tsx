import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables } from "../fonts";
import "../globals.css";

// Separate root layout: the admin is English-only and sits outside the [lang] routes.

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <header className="border-b border-border bg-surface">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
            <Link href="/admin" className="font-mono text-sm font-semibold">
              <span className="text-accent">~/</span>admin
            </Link>
            <Link href="/" className="text-sm text-muted hover:text-text">
              View site ↗
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
