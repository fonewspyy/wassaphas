import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs text-muted sm:px-6">
        <p>
          © {profile.name}. Built with Next.js &amp; MariaDB.
        </p>
        <a href="https://github.com/fonewspyy/wassaphas" target="_blank" rel="noreferrer" className="font-mono hover:text-text">
          source ↗
        </a>
      </div>
    </footer>
  );
}
