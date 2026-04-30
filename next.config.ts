import type { NextConfig } from "next";

import { getConfiguredBasePath } from "./src/lib/site-config";

export function createNextConfig(basePath = getConfiguredBasePath()): NextConfig {
  return {
    output: "export",
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
    basePath: basePath || undefined,
    assetPrefix: basePath || undefined,
  };
}

const nextConfig = createNextConfig();

export default nextConfig;
