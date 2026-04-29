import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "Dynamic QR Code Generator — Edit After Printing",
  description:
    "Create dynamic QR codes you can edit anytime. Change the destination URL without reprinting. Track every scan by device, location, and time. Free plan available.",
  alternates: { canonical: "/dynamic-qr-code-generator" },
  openGraph: {
    title: "Dynamic QR Code Generator | AnalogQR",
    description:
      "Create dynamic QR codes you can edit anytime. Change destination URLs without reprinting. Free plan available.",
    url: "/dynamic-qr-code-generator",
    type: "website",
  },
};

const RELATED = [
  { label: "Free QR Code Generator", href: "/free-qr-code-generator" },
  { label: "QR Code with Logo", href: "/qr-code-with-logo" },
  { label: "QR Code Analytics", href: "/qr-code-analytics" },
  { label: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
  { label: "QR Code for Marketing", href: "/qr-code-for-marketing" },
  { label: "QR Code for Business Card", href: "/qr-code-for-business-card" },
];

const FAQS = [
  {
    q: "What is a dynamic QR code?",
    a: "A dynamic QR code redirects through a short link you control. The code itself never changes — only the destination URL. You can update where it points anytime from your dashboard, even after printing.",
  },
  {
    q: "What is the difference between a static and dynamic QR code?",
    a: "A static QR code encodes the destination URL directly into the pattern — it can never change. A dynamic QR code encodes a short redirect URL, so you can change the final destination anytime without generating a new code.",
  },
  {
    q: "Can I track scans on a dynamic QR code?",
    a: "Yes. Dynamic QR codes support full scan analytics: total scans, device types, approximate locations, and scan trends over time.",
  },
  {
    q: "Are dynamic QR codes more expensive than static ones?",
    a: "AnalogQR offers one free dynamic QR code with no credit card required. Paid plans start at $10/month for 5 codes with full analytics.",
  },
  {
    q: "Do dynamic QR codes look different from static ones?",
    a: "No. Scanners cannot tell the difference between a dynamic and static QR code just by looking at it. Both scan and redirect identically from the user's perspective.",
  },
  {
    q: "Can I add a logo to a dynamic QR code?",
    a: "Yes. AnalogQR lets you add your logo and customize the QR color on Starter and Pro plans.",
  },
];

export default function DynamicQRCodeGeneratorPage() {
  return (
    <UseCasePageLayout
      canonicalPath="/dynamic-qr-code-generator"
      headline="Dynamic QR Code Generator"
      subheadline="Create QR codes you can edit after printing. Change the destination, track every scan, and never reprint."
      description="A dynamic QR code is the only QR code worth printing. Unlike static QR codes, dynamic codes let you update the destination URL at any time — so yesterday's printed flyer can point to today's offer. AnalogQR makes it free to start."
      ctaHref="/sign-up"
      ctaLabel="Create a Dynamic QR Code"
      benefits={[
        "Edit the destination URL anytime — even after printing",
        "Track scans by device, location, and time",
        "One printed code works forever — no reprints when things change",
        "Customize colors and add your logo for a branded look",
        "Works with any URL: websites, PDFs, videos, and more",
        "Free plan available — no credit card required",
      ]}
      steps={[
        {
          title: "Enter your URL",
          body: "Paste the link you want your QR code to point to. Any publicly accessible URL works.",
        },
        {
          title: "Generate your dynamic QR code",
          body: "AnalogQR creates a short-link backed QR code in seconds. Customize the color and download.",
        },
        {
          title: "Print, share, and update",
          body: "Use the QR anywhere. Update the destination from your dashboard whenever you need — no new code required.",
        },
      ]}
      faqs={FAQS}
      relatedPages={RELATED}
    />
  );
}
