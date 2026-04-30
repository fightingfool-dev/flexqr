import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "QR Code Analytics — Track Scans by Device, Location & Time",
  description:
    "Track every QR code scan in real time. See total scans, device types, countries, and time trends. Free plan includes basic analytics. No technical setup needed.",
  alternates: { canonical: "/qr-code-analytics" },
  openGraph: {
    title: "QR Code Analytics | AnalogQR",
    description:
      "Track every QR code scan in real time. Device, location, and time analytics. Free plan available.",
    url: "/qr-code-analytics",
    type: "website",
  },
};

const RELATED = [
  { label: "Free QR Code Generator", href: "/free-qr-code-generator" },
  { label: "Dynamic QR Code Generator", href: "/dynamic-qr-code-generator" },
  { label: "QR Code for Marketing", href: "/qr-code-for-marketing" },
  { label: "QR Code for Flyer Tracking", href: "/qr-code-for-flyer-tracking" },
  { label: "QR Code for Real Estate", href: "/qr-code-for-real-estate" },
  { label: "QR Code for Events", href: "/qr-code-for-events" },
];

const FAQS = [
  {
    q: "What analytics does AnalogQR track?",
    a: "AnalogQR tracks total scans, unique scans, scan timestamps, device types (iOS, Android, desktop), and approximate geographic locations based on IP address.",
  },
  {
    q: "Is scan tracking available on the free plan?",
    a: "Yes. The free plan includes basic scan analytics. Paid plans add more detailed breakdowns and longer history.",
  },
  {
    q: "Does scan tracking work without a redirect delay?",
    a: "Yes. AnalogQR uses an edge-cached redirect so scans are tracked and users are redirected in milliseconds, no visible delay.",
  },
  {
    q: "Can I export my QR code scan data?",
    a: "Yes. Scan data can be exported from your dashboard as a CSV for use in external reporting or spreadsheets.",
  },
  {
    q: "Are individual scanner identities tracked?",
    a: "No. AnalogQR tracks aggregate stats: scan counts, device types, and approximate locations. Individual user identities are never stored.",
  },
  {
    q: "Can I see which QR code got the most scans?",
    a: "Yes. Your dashboard shows per-code scan analytics so you can compare performance across all your QR codes.",
  },
];

export default function QRCodeAnalyticsPage() {
  return (
    <UseCasePageLayout
      canonicalPath="/qr-code-analytics"
      headline="QR Code Analytics"
      subheadline="See every scan in real time. Understand who's scanning, from where, on what device, and when. Prove your QR campaigns are working."
      description="A QR code without analytics is a guess. AnalogQR gives every QR code built-in scan tracking: total scans, device breakdown, geographic data, and time trends, so you can measure what's working and optimize accordingly."
      ctaHref="/sign-up"
      ctaLabel="Start Tracking My QR Scans"
      benefits={[
        "Track total scans, unique scans, and scan trends over time",
        "See device breakdown: iOS, Android, and desktop",
        "Approximate geographic data by country and city",
        "Per-code analytics to compare campaign performance",
        "Export scan data as CSV for external reporting",
        "No technical setup. Analytics work automatically on every code",
      ]}
      steps={[
        {
          title: "Create a QR code",
          body: "Generate any dynamic QR code on AnalogQR. Analytics are enabled automatically, no setup required.",
        },
        {
          title: "Share and deploy",
          body: "Print or share your QR code on any material. Every scan is recorded in real time.",
        },
        {
          title: "Review your analytics",
          body: "Open your dashboard to see scan counts, devices, locations, and time trends. Export anytime.",
        },
      ]}
      faqs={FAQS}
      relatedPages={RELATED}
    />
  );
}
