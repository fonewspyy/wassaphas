import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CI ships .next/standalone to the VPS, so the server needs no npm install there.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
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
