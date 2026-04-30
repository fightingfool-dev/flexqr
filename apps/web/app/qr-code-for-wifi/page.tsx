import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "QR Code for WiFi — Let Guests Connect Instantly",
  description:
    "Create a QR code for your WiFi network. Guests scan once and connect automatically — no typing passwords. Dynamic, brandable, and free to start.",
  alternates: { canonical: "/qr-code-for-wifi" },
  openGraph: {
    title: "QR Code for WiFi | AnalogQR",
    description:
      "Create a QR code for your WiFi network. Guests scan once and connect automatically. Free to start.",
    url: "/qr-code-for-wifi",
    type: "website",
  },
};

const RELATED = [
  { label: "Free QR Code Generator", href: "/free-qr-code-generator" },
  { label: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
  { label: "QR Code for Business Card", href: "/qr-code-for-business-card" },
  { label: "QR Code for Events", href: "/qr-code-for-events" },
  { label: "QR Code with Logo", href: "/qr-code-with-logo" },
  { label: "Dynamic QR Code Generator", href: "/dynamic-qr-code-generator" },
];

const FAQS = [
  {
    q: "How does a WiFi QR code work?",
    a: "A WiFi QR code encodes your network name (SSID), password, and security type. When scanned, the phone offers to join the network automatically, no typing required.",
  },
  {
    q: "Is it safe to share a WiFi QR code?",
    a: "For guest networks, yes. Anyone who scans the code can see the encoded password, so only share it in contexts where you'd normally give out the password (on a sign at a cafe, for example).",
  },
  {
    q: "What happens if I change my WiFi password?",
    a: "You'll need to generate a new WiFi QR code with the updated credentials. For dynamic destination links (websites, menus) you can update without regenerating; WiFi QR codes encode credentials directly.",
  },
  {
    q: "Can I add my logo to the WiFi QR code?",
    a: "Yes. AnalogQR lets you add your logo and brand colors to any QR code, including WiFi codes, on Starter and Pro plans.",
  },
  {
    q: "Which devices support WiFi QR codes?",
    a: "iOS 11+ and Android 10+ support WiFi QR scanning natively with the camera app. Older devices may need a QR scanner app.",
  },
  {
    q: "Can I track how many guests scan the WiFi QR code?",
    a: "Yes. AnalogQR's WiFi QR codes support scan analytics: total scans, scan times, and device types.",
  },
];

export default function QRCodeForWifiPage() {
  return (
    <UseCasePageLayout
      canonicalPath="/qr-code-for-wifi"
      headline="QR Code for WiFi"
      subheadline="Let guests connect to your WiFi instantly. One scan, no passwords to type, no awkward spelling out your network name."
      description="Typing a WiFi password on a phone keypad is frustrating for everyone. A WiFi QR code eliminates the friction entirely: guests scan once and they're connected. Perfect for cafes, restaurants, hotels, offices, and events."
      ctaHref="/create?type=wifi"
      ctaLabel="Create My WiFi QR Code"
      benefits={[
        "Guests connect to WiFi with a single scan, no typing",
        "Works on all modern iOS and Android devices",
        "Add your logo and brand colors for a professional look",
        "Print on table tents, wall signs, or add to your menu QR",
        "Track how many guests scan the code each day",
        "Update the design anytime without changing your WiFi password",
      ]}
      steps={[
        {
          title: "Enter your WiFi credentials",
          body: "Type your network name (SSID), password, and select the security type (WPA2 is most common).",
        },
        {
          title: "Customize and generate",
          body: "Add your logo and brand color. AnalogQR generates a branded WiFi QR code ready for print.",
        },
        {
          title: "Print and display",
          body: "Place the QR code at your venue. Guests scan once with their camera and connect instantly.",
        },
      ]}
      faqs={FAQS}
      relatedPages={RELATED}
    />
  );
}
