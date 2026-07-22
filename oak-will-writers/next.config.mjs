/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export served at northbytes.org/demos/oak-will-writers/site/
  // (the demos repo is a submodule of main-website's frontend/public/).
  output: "export",
  basePath: "/demos/oak-will-writers/site",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
