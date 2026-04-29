import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "Free QR Code Generator — No Sign-Up, No Expiry",
  description:
    "Generate a free dynamic QR code in seconds. No credit card required. Edit the destination URL anytime, track scans, and add your logo. Free forever plan available.",
  alternates: { canonical: "/free-qr-code-generator" },
  openGraph: {
    title: "Free QR Code Generator | AnalogQR",
    description:
      "Generate a free dynamic QR code in seconds. Edit anytime, track scans, add your logo. No credit card required.",
    url: "/free-qr-code-generator",
    type: "website",
  },
};

const RELATED = [
  { label: "Dynamic QR Code Generator", href: "/dynamic-qr-code-generator" },
  { label: "QR Code with Logo", href: "/qr-code-with-logo" },
  { label: "QR Code Analytics", href: "/qr-code-analytics" },
  { label: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
  { label: "QR Code for Business Card", href: "/qr-code-for-business-card" },
  { label: "QR Code for Marketing", href: "/qr-code-for-marketing" },
];

const FAQS = [
  {
    q: "Is the free QR code truly free forever?",
    a: "Yes. AnalogQR's free plan lets you create one dynamic QR code with no expiry and no credit card required. The QR code works indefinitely.",
  },
  {
    q: "Does the free QR code expire or get deactivated?",
    a: "No. Free QR codes on AnalogQR never expire or deactivate. Your code keeps redirecting as long as your account is active.",
  },
  {
    q: "Can I edit the URL after creating a free QR code?",
    a: "Yes. Dynamic QR codes let you change the destination URL anytime from your dashboard — even on the free plan.",
  },
  {
    q: "Does the free plan include scan tracking?",
    a: "Yes. The free plan includes basic scan analytics so you can see how many times your QR code has been scanned.",
  },
  {
    q: "What's the difference between the free plan and paid plans?",
    a: "The free plan includes 1 QR code. Paid plans unlock more QR codes (5 on Starter, 50 on Pro), advanced analytics, custom logo, and custom colors.",
  },
  {
    q: "Do I need to download software to generate a free QR code?",
    a: "No. AnalogQR is entirely web-based. Create, customize, and download your QR code directly in your browser.",
  },
];

export default function FreeQRCodeGeneratorPage() {
  return (
    <UseCasePageLayout
      canonicalPath="/free-qr-code-generator"
      headline="Free QR Code Generator"
      subheadline="Create a dynamic, trackable QR code in seconds. No credit card. No expiry. Edit the destination URL anytime."
      description="Most free QR code generators give you a static code that can never change. AnalogQR gives you a free dynamic QR code — one that lets you update the destination URL anytime without generating a new code. Track scans, customize the look, and never pay for reprints."
      ctaHref="/sign-up"
      ctaLabel="Generate My Free QR Code"
      benefits={[
        "Completely free — no credit card required to start",
        "Dynamic QR code: edit the destination URL anytime",
        "Built-in scan tracking on every free code",
        "Download as high-resolution PNG for print or digital use",
        "Works with websites, PDFs, YouTube videos, and more",
        "Upgrade anytime for more codes, logo support, and analytics",
      ]}
      steps={[
        {
          title: "Sign up for free",
          body: "Create a free AnalogQR account in seconds — no credit card required.",
        },
        {
          title: "Enter your destination URL",
          body: "Paste any link: a website, PDF, video, or social profile. AnalogQR generates a dynamic QR code instantly.",
        },
        {
          title: "Download and use",
          body: "Download your QR code as a PNG and use it anywhere. Update the destination anytime from your dashboard.",
        },
      ]}
      faqs={FAQS}
      relatedPages={RELATED}
    />
  );
}
