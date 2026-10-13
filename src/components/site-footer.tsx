import { profile } from "@/content/profile";
import type { Dictionary } from "@/i18n/dictionaries";

export function SiteFooter({ dict }: { dict: Dictionary }) {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs text-muted sm:px-6">
        <p>
          © {profile.name}. {dict.footer.builtWith}
        </p>
        <a href="https://github.com/fonewspyy/wassaphas" target="_blank" rel="noreferrer" className="font-mono hover:text-text">
          {dict.footer.source} ↗
        </a>
      </div>
    </footer>
  );
}
