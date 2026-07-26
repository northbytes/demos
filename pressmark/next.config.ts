import type { NextConfig } from "next";

// Static export served at northbytes.org/demos/pressmark/site/ — nginx
// on the main site proxies /demos/*/site/ straight to GitHub Pages. basePath
// MUST match that served path or every asset and link 404s.
// Same pattern as oak-will-writers.
const BASE_PATH = "/demos/pressmark/site";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
  images: { unoptimized: true },
  // The client router normalises /clothing to /clothing/. Without this the
  // export writes clothing.html, so refreshing or sharing that URL 404s on
  // GitHub Pages. trailingSlash emits clothing/index.html instead.
  trailingSlash: true,
  // basePath covers <Link>, the router and /_next/*, but NOT raw string paths
  // handed to <img src>. lib/utils.ts `asset()` reads this to prefix those.
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
};

export default nextConfig;
