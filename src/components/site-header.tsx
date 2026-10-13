import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LanguageSwitch } from "./language-switch";
import { MobileMenu } from "./mobile-menu";
import { ScrollProgress } from "./motion/scroll-progress";

export function SiteHeader({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const nav = [
    { hash: "experience", label: dict.nav.experience },
    { hash: "case-studies", label: dict.nav.caseStudies },
    { hash: "work", label: dict.nav.work },
    { hash: "skills", label: dict.nav.skills },
    { hash: "research", label: dict.nav.research },
    { hash: "contact", label: dict.nav.contact },
  ];
  return (
    <header className="sticky top-0 z-30 border-b-2 border-rule bg-bench/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={localePath(lang, "/")} className="text-sm font-bold tracking-[0.18em]">
          WASSAPHAS
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-[15px]">
          {nav.map((item) => (
            <Link
              key={item.hash}
              href={`${localePath(lang, "/")}#${item.hash}`}
              className="hidden px-3 py-1.5 font-medium text-ink-2 hover:text-ink md:inline-block"
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitch current={lang} label={dict.nav.switchTo} />
          <MobileMenu
            label={dict.nav.menu}
            items={nav.map((item) => ({ href: `${localePath(lang, "/")}#${item.hash}`, label: item.label }))}
          />
        </nav>
      </div>
      <ScrollProgress />
    </header>
  );
}
