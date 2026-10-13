import type { Dictionary } from "@/i18n/dictionaries";

export function SiteFooter({ dict }: { dict: Dictionary }) {
  return (
    <footer className="mt-auto border-t-2 border-rule">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-ink-3 sm:px-6">
        <p>
          © {dict.profile.name} · {dict.footer.builtWith}
        </p>
        <a href="https://github.com/fonewspyy/wassaphas" target="_blank" rel="noreferrer" className="hover:text-ink">
          {dict.footer.source} ↗
        </a>
      </div>
    </footer>
  );
}
