// Thai is the default and lives at the root (/projects/x); English is prefixed (/en/projects/x).
// next.config.ts rewrites Thai URLs to /th internally, so every page sits under app/[lang].
// A new public route needs a matching rewrite there.

export const LOCALES = ["th", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "th";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Public URL for a path in a locale: localePath("en", "/projects/x") -> "/en/projects/x". */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Strip a visible locale prefix: "/en/projects/x" -> "/projects/x". */
export function stripLocale(pathname: string): string {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}
