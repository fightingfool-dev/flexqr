import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile workspace packages (TypeScript source, not pre-compiled)
  transpilePackages: ["@flexqr/db"],
};

export default nextConfig;
