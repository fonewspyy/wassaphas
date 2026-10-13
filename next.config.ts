import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CI ships .next/standalone to the VPS, so the server needs no npm install there.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
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
