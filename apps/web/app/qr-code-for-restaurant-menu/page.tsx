import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "QR Code for Restaurant Menu — Free Dynamic QR Generator",
  description:
    "Create a free dynamic QR code for your restaurant menu. Update dishes, prices, and daily specials in seconds — no reprinting ever needed. Track scans per table.",
  alternates: { canonical: "/qr-code-for-restaurant-menu" },
  openGraph: {
    title: "QR Code for Restaurant Menu | AnalogQR",
    description:
      "Create a dynamic QR code for your restaurant menu. Update anytime without reprinting. Free plan available.",
    url: "/qr-code-for-restaurant-menu",
    type: "website",
  },
};

const RELATED = [
  { label: "QR Code for Flyer Tracking", href: "/qr-code-for-flyer-tracking" },
  { label: "QR Code for Business Card", href: "/qr-code-for-business-card" },
  { label: "QR Code for Events", href: "/qr-code-for-events" },
  { label: "QR Code for Packaging", href: "/qr-code-for-packaging" },
  { label: "QR Code for Real Estate", href: "/qr-code-for-real-estate" },
  { label: "Free QR Code Generator", href: "/free-qr-code-generator" },
  { label: "QR Code with Logo", href: "/qr-code-with-logo" },
];

const FAQS = [
  {
    q: "Do I need to print a new QR code when I update my menu?",
    a: "No. With a dynamic QR code from AnalogQR, you simply update the destination URL in your dashboard. The printed QR code keeps working and immediately points to the new link.",
  },
  {
    q: "What format can my menu be in?",
    a: "Any publicly accessible URL works: a webpage, Google Doc, hosted PDF, or any online menu platform. If it has a URL, your QR code can point to it.",
  },
  {
    q: "Can I see how many customers scan my menu each day?",
    a: "Yes. Your dashboard shows total scans, peak scan times, device types, and location data so you can understand exactly when and how customers engage with your menu.",
  },
  {
    q: "Can one QR code work on all my tables?",
    a: "Yes. One dynamic QR code can be printed as many times as you like — on tables, windows, takeout bags, and flyers — and they all point to the same destination.",
  },
  {
    q: "Is there a free plan for restaurant owners?",
    a: "Yes. You can create your first QR code completely free with no credit card required. It includes scan tracking and dynamic redirects.",
  },
];

export default function RestaurantMenuPage() {
  return (
    <UseCasePageLayout
      canonicalPath="/qr-code-for-restaurant-menu"
      headline="QR Code for Restaurant Menu"
      subheadline="Update your menu daily — prices, specials, seasonal items — without reprinting a single QR code."
      description="A printed menu is out of date the moment anything changes. AnalogQR gives you a fully hosted digital menu — build it right in your dashboard with sections, items, prices, and photos. No website, no third-party app. Print the QR code and update the menu anytime."
      ctaHref="/dashboard/qr-codes/new"
      ctaLabel="Build My Hosted Menu"
      benefits={[
        "Build your menu directly in AnalogQR — no website or app needed",
        "Add sections, items, prices, descriptions, and photos",
        "Update dishes, prices, and specials in seconds — no reprint ever",
        "Track how many customers scan your menu each day",
        "Custom QR colors and your logo to match your brand",
        "Works on tables, windows, takeout bags, and flyers",
      ]}
      steps={[
        {
          title: "Build your menu",
          body: "Add sections (Starters, Mains, Drinks), items with prices, descriptions, and photos — all inside AnalogQR.",
        },
        {
          title: "Generate your QR code",
          body: "AnalogQR creates a hosted menu page and a trackable QR code in seconds. Customize colors to match your brand.",
        },
        {
          title: "Print and update anytime",
          body: "Place the QR on tables and menus. Update items, prices, or photos from your dashboard — no reprint needed.",
        },
      ]}
      faqs={FAQS}
      relatedPages={RELATED}
    />
  );
}
