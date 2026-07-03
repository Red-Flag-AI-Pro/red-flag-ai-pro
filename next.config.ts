import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-lib", "@remotion/vercel", "@vercel/sandbox", "@remotion/bundler", "puppeteer-core", "@sparticuz/chromium"],
  outputFileTracingIncludes: {
    "/api/**": ["./src/lib/fonts/**"],
    "/dashboard/**": ["./src/lib/fonts/**"],
    "/scans/**": ["./src/lib/fonts/**"],
    "/api/scans/[id]/pdf/**": ["./node_modules/@sparticuz/chromium/bin/**"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
