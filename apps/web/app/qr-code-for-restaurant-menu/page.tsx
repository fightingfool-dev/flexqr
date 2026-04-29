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
      description="A printed menu is out of date the moment anything changes. A dynamic QR code from AnalogQR points to your live online menu and can be updated in seconds from your dashboard. Print once, update forever."
      ctaHref="/create?type=website&usecase=restaurant-menu"
      ctaLabel="Create My Menu QR Code"
      benefits={[
        "Update your menu URL anytime — no reprint ever required",
        "Track how many customers scan your menu each day",
        "Works with any platform: Google Docs, PDF, or your own site",
        "Custom QR colors and your logo to match your brand",
        "See scan trends by time of day to understand peak service hours",
        "One QR code works on tables, windows, takeout bags, and flyers",
      ]}
      steps={[
        {
          title: "Paste your menu link",
          body: "Enter the URL of your online menu — a website, hosted PDF, or Google Doc.",
        },
        {
          title: "Generate your QR code",
          body: "AnalogQR creates a trackable, dynamic QR code in seconds. Customize colors to match your brand.",
        },
        {
          title: "Print and track",
          body: "Place the QR on tables and menus. Update the destination anytime from your dashboard — no reprint needed.",
        },
      ]}
      faqs={FAQS}
      relatedPages={RELATED}
    />
  );
}
