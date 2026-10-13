import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CI ships .next/standalone to the VPS, so the server needs no npm install there.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Thai is the default language and has no URL prefix; English lives under /en.
  // Every public page is really app/[lang]/..., so Thai URLs are rewritten to /th/...
  // internally. This is config, not src/proxy.ts, on purpose: a proxy rewrite built from
  // request.nextUrl carries the public https:// origin, which Next treats as an external
  // URL and tries to fetch over TLS from the plain-http server behind nginx.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/th" },
        { source: "/projects/:slug", destination: "/th/projects/:slug" },
        { source: "/research/:slug", destination: "/th/research/:slug" },
        { source: "/case-studies/:slug", destination: "/th/case-studies/:slug" },
        { source: "/tools/:slug", destination: "/th/tools/:slug" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  // One Thai URL per page: /th/... is only an internal path.
  async redirects() {
    return [
      { source: "/th", destination: "/", permanent: true },
      { source: "/th/:path*", destination: "/:path*", permanent: true },
    ];
  },
  experimental: {
    // Public pages live under app/[lang] and the admin has its own root layout,
    // so unmatched URLs need a 404 that doesn't depend on either.
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
