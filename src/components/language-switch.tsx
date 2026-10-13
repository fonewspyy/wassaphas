"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { localePath, stripLocale, type Locale } from "@/i18n/config";

const className =
  "ml-1 border-2 border-rule px-2.5 py-0.5 text-sm font-semibold hover:bg-ink hover:text-label";

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
