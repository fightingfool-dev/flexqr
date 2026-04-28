import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "QR Code for Business Card",
  description:
    "Add a dynamic QR code to your business card. Link to your portfolio, LinkedIn, or contact page: and update the destination whenever you need.",
  alternates: { canonical: "/qr-code-for-business-card" },
  openGraph: {
    title: "QR Code for Business Card | AnalogQR",
    description:
      "Add a dynamic QR code to your business card. Update your link anytime without reprinting.",
    url: "/qr-code-for-business-card",
    type: "website",
  },
};

const RELATED = [
  { label: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
  { label: "QR Code for Flyer Tracking", href: "/qr-code-for-flyer-tracking" },
  { label: "QR Code for Events", href: "/qr-code-for-events" },
  { label: "QR Code for Packaging", href: "/qr-code-for-packaging" },
  { label: "QR Code for Real Estate", href: "/qr-code-for-real-estate" },
];

export default function BusinessCardPage() {
  return (
    <UseCasePageLayout
      headline="QR Code for Business Card"
      subheadline="Make every business card smarter. One scan connects people to your portfolio, LinkedIn, or booking page."
      description="Your business card has limited space: your QR code doesn't. Point people to your full portfolio, contact form, or calendar in one tap. Change where it points anytime without ordering new cards."
      ctaHref="/create?type=vcard&usecase=business-card"
      ctaLabel="Create My Business Card QR"
      benefits={[
        "Link to your portfolio, LinkedIn, or personal site in one scan",
        "Update the destination anytime: no new cards to order",
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
      relatedPages={RELATED}
    />
  );
}
