import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-lib", "@remotion/vercel", "@vercel/sandbox", "@remotion/bundler", "puppeteer-core", "@sparticuz/chromium-min"],
  outputFileTracingIncludes: {
    "/api/**": ["./src/lib/fonts/**"],
    "/dashboard/**": ["./src/lib/fonts/**"],
    "/scans/**": ["./src/lib/fonts/**"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
