"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { localePath, stripLocale, type Locale } from "@/i18n/config";

const className =
  "rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-text";

/**
 * Links to the same page in the other language. The current path is request-time data,
 * so the prerendered shell links to the other language's home until it streams in.
 */
export function LanguageSwitch({ current, label }: { current: Locale; label: string }) {
  const target: Locale = current === "th" ? "en" : "th";
  return (
    <Suspense fallback={<SwitchLink target={target} href={localePath(target, "/")} label={label} />}>
      <SamePageSwitch target={target} label={label} />
    </Suspense>
  );
}

function SamePageSwitch({ target, label }: { target: Locale; label: string }) {
  const pathname = usePathname();
  return <SwitchLink target={target} href={localePath(target, stripLocale(pathname))} label={label} />;
}

function SwitchLink({ target, href, label }: { target: Locale; href: string; label: string }) {
  return (
    <Link
      href={href}
      hrefLang={target}
      lang={target}
      className={className}
    >
      {label}
    </Link>
  );
}
