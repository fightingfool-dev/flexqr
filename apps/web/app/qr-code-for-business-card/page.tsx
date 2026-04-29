import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "QR Code for Business Card — Dynamic & Trackable",
  description:
    "Add a dynamic QR code to your business card. Link to your portfolio, LinkedIn, or contact page — and update the destination whenever you need. Free to start.",
  alternates: { canonical: "/qr-code-for-business-card" },
  openGraph: {
    title: "QR Code for Business Card | AnalogQR",
    description:
      "Add a dynamic QR code to your business card. Update your link anytime without reprinting. Free plan available.",
    url: "/qr-code-for-business-card",
    type: "website",
  },
};

const RELATED = [
  { label: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
  { label: "QR Code for Flyer Tracking", href: "/qr-code-for-flyer-tracking" },
  { label: "QR Code for Events", href: "/qr-code-for-events" },
  { label: "QR Code for Real Estate", href: "/qr-code-for-real-estate" },
  { label: "QR Code with Logo", href: "/qr-code-with-logo" },
  { label: "Dynamic QR Code Generator", href: "/dynamic-qr-code-generator" },
];

const FAQS = [
  {
    q: "Does a QR code look good on a business card?",
    a: "Yes. AnalogQR lets you customize the QR color and add your own logo so it matches your card design perfectly. Download as a high-resolution PNG or SVG for print.",
  },
  {
    q: "What can I link to with a business card QR code?",
    a: "Anything with a URL: your website, LinkedIn profile, portfolio, Calendly booking page, or a digital vCard. You can even change the destination after the cards are printed.",
  },
  {
    q: "What if I change jobs or update my website?",
    a: "Just update the destination URL in your dashboard. Everyone who scans your existing cards will automatically reach the new link — no reprinting needed.",
  },
  {
    q: "Can I see who scanned my business card?",
    a: "You see aggregate analytics: total scans, device types, and approximate locations. Individual identities are not tracked — it's privacy-friendly scan counting.",
  },
  {
    q: "Can I use the same QR on multiple card designs?",
    a: "Yes. One QR code can appear on as many card designs as you like. All scans are counted together in your dashboard.",
  },
];

export default function BusinessCardPage() {
  return (
    <UseCasePageLayout
      canonicalPath="/qr-code-for-business-card"
      headline="QR Code for Business Card"
      subheadline="Make every business card smarter. One scan connects people to your portfolio, LinkedIn, or booking page."
      description="Your business card has limited space — your QR code doesn't. Point people to your full portfolio, contact form, or calendar in one tap. Change where it points anytime without ordering new cards."
      ctaHref="/create?type=vcard&usecase=business-card"
      ctaLabel="Create My Business Card QR"
      benefits={[
        "Link to your portfolio, LinkedIn, or personal site in one scan",
        "Update the destination anytime — no new cards to order",
        "See how many people actually followed up after meeting you",
        "Custom-colored QR that looks premium on a printed card",
        "Works with any link: website, Calendly, email, or social profile",
        "Stand out with a modern, interactive business card experience",
      ]}
      steps={[
        {
          title: "Paste your profile link",
          body: "Enter the URL of your website, LinkedIn, portfolio, or booking page.",
        },
        {
          title: "Customize your QR code",
          body: "Pick colors that match your card design. Add your logo for a fully branded look.",
        },
        {
          title: "Print and track connections",
          body: "Add the QR to your business card. See how many people scan and follow up after every meeting.",
        },
      ]}
      faqs={FAQS}
      relatedPages={RELATED}
    />
  );
}
