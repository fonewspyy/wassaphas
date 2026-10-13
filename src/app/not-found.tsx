import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center px-4 py-24 sm:px-6">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Nothing here</h1>
      <p className="mt-2 text-muted">That page doesn&apos;t exist or isn&apos;t published.</p>
      <Link href="/" className="mt-6 text-sm font-medium text-accent">
        ← Back home
      </Link>
    </main>
  );
}
