import type { MetadataRoute } from "next";

const BASE = "https://www.analogqr.com";

const USE_CASE_PAGES = [
  "qr-code-for-restaurant-menu",
  "qr-code-for-business-card",
  "qr-code-for-events",
  "qr-code-for-flyer-tracking",
  "qr-code-for-packaging",
  "qr-code-for-real-estate",
  "free-qr-code-generator",
  "dynamic-qr-code-generator",
  "qr-code-with-logo",
  "qr-code-for-wifi",
  "qr-code-for-social-media",
  "qr-code-for-pdf",
  "qr-code-for-whatsapp",
  "qr-code-analytics",
  "qr-code-for-marketing",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...USE_CASE_PAGES.map((slug) => ({
      url: `${BASE}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
