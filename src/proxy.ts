import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE } from "@/i18n/config";

// Thai is served without a prefix. Internally every public page lives under app/[lang],
// so "/projects/x" is rewritten to "/th/projects/x". A visible "/th/..." URL is
// redirected to its unprefixed form so each page has exactly one Thai URL.
// "/en/..." passes straight through.

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip the API, the admin, Next internals and any file with an extension (icons, robots.txt).
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
