import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";

// Unmatched URLs skip every layout, so this page brings its own <html>.
// It can't know the visitor's language, so it shows both.

export const metadata: Metadata = {
  title: "404",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="th" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center px-4 py-24 sm:px-6">
          <p className="font-mono text-sm text-accent">404</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">ไม่พบหน้านี้</h1>
          <p className="mt-1 text-muted">This page doesn&apos;t exist.</p>
          {/* Plain anchors on purpose: this page renders outside the app router. */}
          {/* eslint-disable @next/next/no-html-link-for-pages */}
          <div className="mt-6 flex gap-6 text-sm font-medium text-accent">
            <a href="/">← กลับหน้าแรก</a>
            <a href="/en">English home</a>
          </div>
          {/* eslint-enable @next/next/no-html-link-for-pages */}
        </main>
      </body>
    </html>
  );
}
