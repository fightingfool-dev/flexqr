import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/sign-in", "/sign-up", "/onboarding"],
      },
    ],
    sitemap: "https://www.analogqr.com/sitemap.xml",
  };
}
