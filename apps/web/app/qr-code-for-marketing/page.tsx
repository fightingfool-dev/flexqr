import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "QR Code for Marketing — Track Print Campaign ROI",
  description:
    "Add trackable QR codes to every marketing campaign. Measure scan rates, update destinations without reprinting, and prove print marketing ROI. Free to start.",
  alternates: { canonical: "/qr-code-for-marketing" },
  openGraph: {
    title: "QR Code for Marketing | AnalogQR",
    description:
      "Add trackable QR codes to every marketing campaign. Measure ROI and update destinations without reprinting.",
    url: "/qr-code-for-marketing",
    type: "website",
  },
};

const RELATED = [
  { label: "QR Code for Flyer Tracking", href: "/qr-code-for-flyer-tracking" },
  { label: "QR Code Analytics", href: "/qr-code-analytics" },
  { label: "QR Code with Logo", href: "/qr-code-with-logo" },
  { label: "Dynamic QR Code Generator", href: "/dynamic-qr-code-generator" },
  { label: "QR Code for Real Estate", href: "/qr-code-for-real-estate" },
  { label: "QR Code for Events", href: "/qr-code-for-events" },
];

const FAQS = [
  {
    q: "How do I use QR codes in a marketing campaign?",
    a: "Add a unique QR code to each channel — flyers, mailers, billboards, in-store signage, packaging — and track scan counts per code to measure which channel performs best.",
  },
  {
    q: "Can I A/B test different QR code destinations?",
    a: "Yes. Create two QR codes pointing to different landing pages, print them on different materials, and compare scan and conversion data.",
  },
  {
    q: "Can I update the campaign landing page after printing?",
    a: "Yes. With a dynamic QR code, update the destination URL in your dashboard. The printed QR code immediately starts pointing to the new page.",
  },
  {
    q: "Can I use QR codes in digital marketing too?",
    a: "Yes. QR codes work in digital ads, email newsletters, social posts, and presentation slides — anywhere a user can scan a screen or printout.",
  },
  {
    q: "How do I prove QR code marketing ROI?",
    a: "Track scan counts per QR code and correlate them with conversion data from your landing page analytics. AnalogQR's CSV export makes it easy to combine with other data sources.",
  },
  {
    q: "How many QR codes can I use in a marketing campaign?",
    a: "As many as your plan allows. The Starter plan includes 5 codes, Pro includes 50. Create one per channel, per location, or per campaign for granular tracking.",
  },
];

export default function QRCodeForMarketingPage() {
  return (
    <UseCasePageLayout
      canonicalPath="/qr-code-for-marketing"
      headline="QR Code for Marketing"
      subheadline="Track every offline impression. Add dynamic, trackable QR codes to your campaigns and finally measure print marketing ROI."
      description="Print advertising has always been hard to measure — until now. AnalogQR gives every marketing channel its own trackable QR code so you can compare scan rates across flyers, mailers, signage, and packaging. Update campaign links without reprinting. Prove what works."
      ctaHref="/sign-up"
      ctaLabel="Start Tracking My Campaigns"
      benefits={[
        "One unique QR per channel — compare scan rates across campaigns",
        "Update campaign landing pages without reprinting materials",
        "Track scans by device, location, and time of day",
        "Branded QR codes with your logo and colors",
        "Export scan data as CSV for campaign reporting",
        "Works across flyers, mailers, signage, packaging, and digital",
      ]}
      steps={[
        {
          title: "Create a QR per campaign channel",
          body: "Generate a separate QR code for each marketing channel — flyers, mailers, in-store displays — to track each independently.",
        },
        {
          title: "Deploy across your materials",
          body: "Add each branded QR code to the corresponding material. Print, mail, or display as normal.",
        },
        {
          title: "Measure and optimize",
          body: "Compare scan counts across channels in your dashboard. Update destinations to optimize campaigns in real time.",
        },
      ]}
      faqs={FAQS}
      relatedPages={RELATED}
    />
  );
}
