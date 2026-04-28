import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Build the canonical HTTPS origin from APP_URL (set in Vercel env vars).
// Falls back safely so the dev server keeps working on http://localhost.
function prodOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_APP_URL;
  if (!raw) return null;
  try {
    const u = new URL(raw);
    return u.protocol === "https:" ? u.origin : null;
  } catch {
    return null;
  }
}

const nextConfig: NextConfig = {
  transpilePackages: ["@flexqr/db"],

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Tell browsers to always use HTTPS for this origin (2 years).
          // Browsers that have visited before won't even attempt HTTP.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  async redirects() {
    // Vercel already redirects HTTP→HTTPS at the edge, but this adds an
    // application-level guarantee using x-forwarded-proto which Vercel sets
    // on every request it proxies.
    const origin = isProd ? prodOrigin() : null;
    if (!origin) return [];
    return [
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
        destination: `${origin}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
