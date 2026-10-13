import Link from "next/link";
import { profile } from "@/content/profile";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { GitHubIcon } from "./icons";
import { LanguageSwitch } from "./language-switch";

export function SiteHeader({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const nav = [
    { hash: "skills", label: dict.nav.skills },
    { hash: "projects", label: dict.nav.projects },
    { hash: "experience", label: dict.nav.experience },
    { hash: "contact", label: dict.nav.contact },
  ];
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={localePath(lang, "/")} className="font-mono text-sm font-semibold tracking-tight">
          <span className="text-accent">~/</span>wassaphas
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm">
          {nav.map((item) => (
            <Link
              key={item.hash}
              href={`${localePath(lang, "/")}#${item.hash}`}
              className="hidden rounded-md px-3 py-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-text sm:inline-block"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="rounded-md p-2 text-muted transition-colors hover:bg-surface-2 hover:text-text"
          >
            <GitHubIcon />
          </a>
          <LanguageSwitch current={lang} label={dict.nav.switchTo} />
        </nav>
      </div>
    </header>
  );
}
