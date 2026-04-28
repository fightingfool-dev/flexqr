import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "QR Code for Flyer Tracking",
  description:
    "Add a trackable QR code to your flyers. See exactly how many people scan, when, and where: and update the destination link anytime.",
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
];

export default function FlyerTrackingPage() {
  return (
    <UseCasePageLayout
      headline="QR Code for Flyer Tracking"
      subheadline="Know exactly which flyers are driving results. Track every scan and prove your offline campaigns are working."
      description="Flyers are one of the most cost-effective marketing tools: but without tracking, you're flying blind. AnalogQR adds a scannable, trackable QR code to your flyers so you can measure real-world engagement and optimize your campaigns."
      ctaHref="/create?type=website&usecase=flyer-tracking"
      ctaLabel="Create My Flyer QR Code"
      benefits={[
        "See exactly how many people scan your flyer each day",
        "Change the destination URL after printing: redirect to new campaigns",
        "Compare performance across different flyer placements",
        "Track scans by time and date to understand when your audience engages",
        "Custom-branded QR codes that look professional on print materials",
        "Prove ROI on print marketing with real scan data",
      ]}
      steps={[
        {
          title: "Paste your campaign link",
          body: "Enter the URL you want your flyer to point to: a landing page, offer, or sign-up form.",
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
      relatedPages={RELATED}
    />
  );
}
