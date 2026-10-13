import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { profile } from "@/content/profile";
import { LOCALES, isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fontVariables } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  const title = `${dict.profile.name} | ${dict.profile.role}`;
  return {
    metadataBase: new URL(profile.siteUrl),
    title: { default: title, template: `%s | ${dict.profile.name}` },
    description: dict.meta.description,
    alternates: {
      canonical: localePath(lang, "/"),
      languages: { th: "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      url: localePath(lang, "/"),
      title,
      description: dict.meta.description,
      siteName: dict.profile.name,
      locale: lang === "th" ? "th_TH" : "en_US",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#f7f7f5",
  colorScheme: "light",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang} className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Before first paint: opt into motion styles unless the OS asks for reduced motion.
            The 3s fallback reveals the hero even if the animation script never runs. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("motion");setTimeout(function(){d.classList.add("motion-fallback")},3000)}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
