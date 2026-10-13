import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import { DEFAULT_LOCALE, isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// not-found receives no params, so the locale comes from the root param.
export default async function NotFound() {
  const value = await rootLang();
  const lang = value && isLocale(value) ? value : DEFAULT_LOCALE;
  const copy = getDictionary(lang).notFound;
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center px-4 py-24 sm:px-6">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{copy.title}</h1>
      <p className="mt-2 text-muted">{copy.body}</p>
      <Link href={localePath(lang, "/")} className="mt-6 text-sm font-medium text-accent">
        ← {copy.back}
      </Link>
    </main>
  );
}
