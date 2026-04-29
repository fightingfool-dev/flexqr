import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "QR Code for Flyer Tracking — Measure Print Campaign ROI",
  description:
    "Add a trackable QR code to your flyers. See exactly how many people scan, when, and where — and update the destination link anytime. Free to start.",
  alternates: { canonical: "/qr-code-for-flyer-tracking" },
  openGraph: {
    title: "QR Code for Flyer Tracking | AnalogQR",
    description:
      "Add a trackable QR code to your flyers. See scan analytics and update the destination anytime.",
    url: "/qr-code-for-flyer-tracking",
    type: "website",
  },
};

const RELATED = [
  { label: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
  { label: "QR Code for Business Card", href: "/qr-code-for-business-card" },
  { label: "QR Code for Events", href: "/qr-code-for-events" },
  { label: "QR Code for Packaging", href: "/qr-code-for-packaging" },
  { label: "QR Code for Real Estate", href: "/qr-code-for-real-estate" },
  { label: "QR Code Analytics", href: "/qr-code-analytics" },
  { label: "QR Code for Marketing", href: "/qr-code-for-marketing" },
];

const FAQS = [
  {
    q: "How do I prove my flyer campaign is working?",
    a: "Each QR code has its own scan counter in your dashboard. You see total scans, scan times, and device types — concrete data to prove real-world engagement from your print campaign.",
  },
  {
    q: "Can I use different QR codes for different flyer placements?",
    a: "Yes. Create a separate QR code for each placement — coffee shops, bulletin boards, direct mail — and compare their scan counts to see which locations perform best.",
  },
  {
    q: "What if I want to redirect to a new offer after printing?",
    a: "Just update the destination URL in your dashboard. The printed QR code immediately starts pointing to the new link — no reprinting required.",
  },
  {
    q: "Do people need an app to scan the QR code?",
    a: "No. Any modern smartphone camera on iOS or Android can scan a QR code natively without downloading anything.",
  },
  {
    q: "Can I add my logo to the QR code on my flyer?",
    a: "Yes. AnalogQR lets you add a logo and customize colors so the QR code matches your flyer's branding.",
  },
];

export default function FlyerTrackingPage() {
  return (
    <UseCasePageLayout
      canonicalPath="/qr-code-for-flyer-tracking"
      headline="QR Code for Flyer Tracking"
      subheadline="Know exactly which flyers are driving results. Track every scan and prove your offline campaigns are working."
      description="Flyers are one of the most cost-effective marketing tools — but without tracking, you're flying blind. AnalogQR adds a scannable, trackable QR code to your flyers so you can measure real-world engagement and optimize your campaigns."
      ctaHref="/create?type=website&usecase=flyer-tracking"
      ctaLabel="Create My Flyer QR Code"
      benefits={[
        "See exactly how many people scan your flyer each day",
        "Change the destination URL after printing — redirect to new campaigns",
        "Compare performance across different flyer placements",
        "Track scans by time and date to understand when your audience engages",
        "Custom-branded QR codes that look professional on print materials",
        "Prove ROI on print marketing with real scan data",
      ]}
      steps={[
        {
          title: "Paste your campaign link",
          body: "Enter the URL you want your flyer to point to — a landing page, offer, or sign-up form.",
        },
        {
          title: "Generate your trackable QR code",
          body: "AnalogQR creates a dynamic QR code with full scan analytics built in.",
        },
        {
          title: "Print, distribute, and measure",
          body: "Add the QR to your flyers. Watch scan data roll in from your dashboard in real time.",
        },
      ]}
      faqs={FAQS}
      relatedPages={RELATED}
    />
  );
}
