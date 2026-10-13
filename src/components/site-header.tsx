import Link from "next/link";
import { profile } from "@/content/profile";
import { GitHubIcon } from "./icons";

const NAV = [
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
          <span className="text-accent">~/</span>
          wassaphas
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden rounded-md px-3 py-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-text sm:inline-block"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="rounded-md p-2 text-muted transition-colors hover:bg-surface-2 hover:text-text"
          >
            <GitHubIcon />
          </a>
        </nav>
      </div>
    </header>
  );
}
