import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "QR Code for Product Packaging — Dynamic & Updatable",
  description:
    "Add a dynamic QR code to your product packaging. Link to instructions, warranty registration, or promotions — and update the destination anytime without reprinting.",
  alternates: { canonical: "/qr-code-for-packaging" },
  openGraph: {
    title: "QR Code for Packaging | AnalogQR",
    description:
      "Add a dynamic QR code to your product packaging. Update the destination without changing the label.",
    url: "/qr-code-for-packaging",
    type: "website",
  },
};

const RELATED = [
  { label: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
  { label: "QR Code for Flyer Tracking", href: "/qr-code-for-flyer-tracking" },
  { label: "QR Code for Business Card", href: "/qr-code-for-business-card" },
  { label: "QR Code for Events", href: "/qr-code-for-events" },
  { label: "QR Code for Real Estate", href: "/qr-code-for-real-estate" },
  { label: "Dynamic QR Code Generator", href: "/dynamic-qr-code-generator" },
];

const FAQS = [
  {
    q: "Can I update the QR destination after packaging is already shipped?",
    a: "Yes. The QR code redirects through AnalogQR's short link. Change the destination URL in your dashboard and every existing package immediately points to the new link.",
  },
  {
    q: "What is the minimum QR code size for product packaging?",
    a: "A minimum of 2 cm × 2 cm (about 0.8 inches) is recommended for reliable scanning. Larger is always better, especially for small product labels.",
  },
  {
    q: "Can I link to a video tutorial instead of a text manual?",
    a: "Absolutely. Link to any publicly accessible URL: a YouTube video, hosted PDF, product webpage, or support portal. You can change it anytime.",
  },
  {
    q: "Can I track how many customers scan my product?",
    a: "Yes. Every scan is logged. See total scans, the devices used, approximate locations, and when customers scan most.",
  },
  {
    q: "Can I use one QR code across multiple product SKUs?",
    a: "You can, but creating a separate QR per SKU lets you track engagement for each product individually and redirect them to different pages.",
  },
];

export default function PackagingPage() {
  return (
    <UseCasePageLayout
      canonicalPath="/qr-code-for-packaging"
      headline="QR Code for Packaging"
      subheadline="Turn your product packaging into a live touchpoint. Link to instructions, promotions, or support. Update anytime."
      description="Printed packaging is permanent — but what's behind your QR code doesn't have to be. AnalogQR lets you point your packaging QR to instructions today, a seasonal promotion tomorrow, and a warranty registration next month. One printed code, infinite flexibility."
      ctaHref="/create?type=website&usecase=packaging"
      ctaLabel="Create My Packaging QR Code"
      benefits={[
        "Update where your QR points without reprinting packaging",
        "Link to instructions, videos, warranty registration, or promotions",
        "Track how many customers actually scan your products",
        "Use scan data to measure product engagement by SKU",
        "Branded QR code design that looks great on packaging",
        "Redirect to seasonal offers or new product pages over time",
      ]}
      steps={[
        {
          title: "Paste your product link",
          body: "Enter the URL for your product page, instruction manual, or support resource.",
        },
        {
          title: "Generate your packaging QR code",
          body: "AnalogQR creates a dynamic code sized for print. Customize to fit your packaging design.",
        },
        {
          title: "Print and update anytime",
          body: "Print the QR on your packaging. Update the destination whenever your content or campaigns change.",
        },
      ]}
      faqs={FAQS}
      relatedPages={RELATED}
    />
  );
}
