import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-lib", "@remotion/renderer", "@remotion/bundler", "@remotion/compositor-linux-x64-gnu", "@remotion/compositor-linux-x64-musl"],
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
