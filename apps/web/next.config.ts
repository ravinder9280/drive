import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

/** This repo root (`drive/`), not a parent folder that happens to have another lockfile. */
const monorepoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
  transpilePackages: ["@monorepo/ui","@monorepo/types"],
  outputFileTracingRoot: monorepoRoot,
  webpack: (config) => {
    config.watchOptions = {
      ignored: [
        "**/.git/**",
        "**/.next/**",
        "**/.turbo/**",
        "**/node_modules/**",
        "**/dist/**",
      ],
    };
    return config;
  }
};

export default nextConfig;
