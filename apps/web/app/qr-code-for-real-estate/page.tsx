import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "QR Code for Real Estate — Track Buyer Interest on Every Listing",
  description:
    "Create dynamic QR codes for property listings, yard signs, and flyers. Track buyer interest, update links anytime, and connect print to digital instantly. Free plan available.",
  alternates: { canonical: "/qr-code-for-real-estate" },
  openGraph: {
    title: "QR Code for Real Estate | AnalogQR",
    description:
      "Track buyer interest on every property. Dynamic QR codes for listings, signs, and flyers — update the destination anytime.",
    url: "/qr-code-for-real-estate",
    type: "website",
  },
};

const RELATED = [
  { label: "QR Code for Flyer Tracking", href: "/qr-code-for-flyer-tracking" },
  { label: "QR Code for Business Card", href: "/qr-code-for-business-card" },
  { label: "QR Code for Events", href: "/qr-code-for-events" },
  { label: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
  { label: "QR Code for Packaging", href: "/qr-code-for-packaging" },
  { label: "QR Code Analytics", href: "/qr-code-analytics" },
  { label: "QR Code for Marketing", href: "/qr-code-for-marketing" },
];

const FAQS = [
  {
    q: "How many QR codes do I need per property listing?",
    a: "One per listing is typical. Print it on all materials — yard signs, flyers, brochures — and all scans are counted together in your dashboard.",
  },
  {
    q: "Can I redirect the QR code after a property sells?",
    a: "Yes. Once a property sells, update the destination to your agent profile, similar active listings, or a 'sold' landing page — without touching the printed materials.",
  },
  {
    q: "Can I see which listing gets the most buyer interest?",
    a: "Yes. Each QR code has its own analytics so you can compare scan counts, peak times, and device data across all your active listings.",
  },
  {
    q: "Does the QR code work on yard sign materials?",
    a: "Yes. A high-contrast QR code printed on any material — corrugated plastic, metal, vinyl — will scan reliably with any smartphone camera.",
  },
  {
    q: "Can I use the same QR code on multiple marketing materials for the same listing?",
    a: "Yes. One QR code can appear on signs, flyers, postcards, and digital ads simultaneously. All scans are tracked under the same code.",
  },
];

export default function RealEstatePage() {
  return (
    <UseCasePageLayout
      canonicalPath="/qr-code-for-real-estate"
      headline="QR Code for Real Estate"
      subheadline="Know exactly which listings are getting attention. Track every scan from yard signs, flyers, and print ads — and update the link anytime."
      description="Print is still one of the most powerful tools in real estate — but it gives you zero data. AnalogQR adds a trackable, dynamic QR code to every listing so you can measure buyer interest in real time, update links without reprinting, and prove your marketing is working."
      ctaHref="/create?type=website&usecase=real-estate"
      ctaLabel="Create My Listing QR Code"
      benefits={[
        "Track how many buyers scan each property listing",
        "Update the destination URL without reprinting signs or flyers",
        "Works on yard signs, flyers, window stickers, and mailers",
        "See scan counts by time and date to gauge buyer interest",
        "Custom-branded QR colors to match your agency identity",
        "One QR code per listing — redirect to virtual tour, photos, or contact form",
      ]}
      steps={[
        {
          title: "Paste your listing link",
          body: "Enter the URL of the property listing, virtual tour, or agent contact page.",
        },
        {
          title: "Generate your listing QR code",
          body: "AnalogQR creates a trackable dynamic code in seconds. Style it to match your brand.",
        },
        {
          title: "Print and track buyer interest",
          body: "Add the QR to signs, flyers, and brochures. See real-time scan data from your dashboard.",
        },
      ]}
      faqs={FAQS}
      relatedPages={RELATED}
    />
  );
}
