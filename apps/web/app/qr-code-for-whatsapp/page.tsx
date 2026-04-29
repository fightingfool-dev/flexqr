import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "QR Code for WhatsApp — Start a Chat with One Scan",
  description:
    "Create a QR code that opens a WhatsApp chat with your number. Perfect for business, customer support, or direct messaging. Free to start.",
  alternates: { canonical: "/qr-code-for-whatsapp" },
  openGraph: {
    title: "QR Code for WhatsApp | AnalogQR",
    description:
      "Create a QR code that opens a WhatsApp chat with your number. Free to start.",
    url: "/qr-code-for-whatsapp",
    type: "website",
  },
};

const RELATED = [
  { label: "QR Code for Business Card", href: "/qr-code-for-business-card" },
  { label: "QR Code for Social Media", href: "/qr-code-for-social-media" },
  { label: "QR Code for Marketing", href: "/qr-code-for-marketing" },
  { label: "Free QR Code Generator", href: "/free-qr-code-generator" },
  { label: "Dynamic QR Code Generator", href: "/dynamic-qr-code-generator" },
  { label: "QR Code with Logo", href: "/qr-code-with-logo" },
];

const FAQS = [
  {
    q: "How does a WhatsApp QR code work?",
    a: "Scanning the QR code opens WhatsApp on the user's phone with your number pre-filled and optionally a pre-written message. They just tap 'Send' to start a conversation.",
  },
  {
    q: "Do I need a WhatsApp Business account?",
    a: "No. A WhatsApp QR code works with any WhatsApp number — personal or business. WhatsApp Business adds features like automated replies and business profiles.",
  },
  {
    q: "Can I include a pre-filled message in the QR code?",
    a: "Yes. Include a pre-written message in the link so the customer sees a ready-to-send opener when they scan — for example, 'Hi, I'd like to book a table for 2.'",
  },
  {
    q: "Can I change the phone number or message after printing?",
    a: "Yes. With a dynamic QR code, update the destination link anytime. If your WhatsApp number changes, just update the link in your dashboard.",
  },
  {
    q: "Where should I use a WhatsApp QR code?",
    a: "Business cards, restaurant menus, product packaging, retail signage, event badges, and any place where customers might want to reach you quickly.",
  },
  {
    q: "Can I track how many people scan my WhatsApp QR code?",
    a: "Yes. AnalogQR tracks every scan — total count, device types, locations, and timing.",
  },
];

export default function QRCodeForWhatsappPage() {
  return (
    <UseCasePageLayout
      canonicalPath="/qr-code-for-whatsapp"
      headline="QR Code for WhatsApp"
      subheadline="Let anyone start a WhatsApp conversation with you in one scan. No searching for your number, no typing."
      description="Give customers, clients, and leads the easiest way to reach you. A WhatsApp QR code opens a pre-addressed chat to your number instantly. Add it to your business card, menu, packaging, or signage and start more conversations."
      ctaHref="/create?type=website&usecase=whatsapp"
      ctaLabel="Create My WhatsApp QR Code"
      benefits={[
        "Opens a WhatsApp chat to your number with a single scan",
        "Works with any WhatsApp number — personal or business",
        "Include a pre-filled message to lower the reply barrier",
        "Dynamic: update the number or message without reprinting",
        "Track how many scans convert to conversations",
        "Add to business cards, menus, packaging, and signage",
      ]}
      steps={[
        {
          title: "Enter your WhatsApp number",
          body: "Paste your WhatsApp link (wa.me/YOURNUMBER) with an optional pre-filled message.",
        },
        {
          title: "Generate your QR code",
          body: "AnalogQR creates a trackable QR code. Add your logo and brand colors for a professional look.",
        },
        {
          title: "Print and start conversations",
          body: "Place the QR on your materials. Customers scan and a WhatsApp chat opens instantly.",
        },
      ]}
      faqs={FAQS}
      relatedPages={RELATED}
    />
  );
}
