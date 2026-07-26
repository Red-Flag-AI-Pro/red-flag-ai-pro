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
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/blog/ai-content-disclosure-eu-ai-act-2026",
        destination: "/blog/eu-ai-act-article-50-marketing-agencies",
        permanent: true,
      },
      {
        source: "/blog/who-owns-ai-compliance-marketing-governance-gap",
        destination: "/blog/ai-compliance-vs-ai-governance",
        permanent: true,
      },
      {
        source: "/blog/dpo-nobody-knows-invisible-governance",
        destination: "/blog/ai-compliance-vs-ai-governance",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
