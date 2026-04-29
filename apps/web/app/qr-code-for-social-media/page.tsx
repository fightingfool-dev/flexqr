import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "QR Code for Social Media — Grow Your Following Offline",
  description:
    "Create a QR code that links to your social media profiles. Turn offline audiences into online followers. Dynamic, trackable, and free to start.",
  alternates: { canonical: "/qr-code-for-social-media" },
  openGraph: {
    title: "QR Code for Social Media | AnalogQR",
    description:
      "Create a QR code linking to your social profiles. Turn offline audiences into online followers. Free to start.",
    url: "/qr-code-for-social-media",
    type: "website",
  },
};

const RELATED = [
  { label: "QR Code for Business Card", href: "/qr-code-for-business-card" },
  { label: "QR Code with Logo", href: "/qr-code-with-logo" },
  { label: "QR Code for Marketing", href: "/qr-code-for-marketing" },
  { label: "QR Code for Events", href: "/qr-code-for-events" },
  { label: "Dynamic QR Code Generator", href: "/dynamic-qr-code-generator" },
  { label: "Free QR Code Generator", href: "/free-qr-code-generator" },
];

const FAQS = [
  {
    q: "Can one QR code link to multiple social profiles?",
    a: "Yes. Link your QR code to a landing page (like Linktree or a custom page) that lists all your social profiles, so one scan reaches all your accounts.",
  },
  {
    q: "Can I change which social profile the QR links to?",
    a: "Yes. With a dynamic QR code from AnalogQR, you can update the destination URL anytime — switch platforms, update usernames, or change to a new link without reprinting.",
  },
  {
    q: "Where should I put a social media QR code?",
    a: "Business cards, product packaging, event signage, retail displays, print ads, restaurant menus, and any physical location where customers might want to follow you online.",
  },
  {
    q: "Can I track how many people scanned my social QR code?",
    a: "Yes. Every scan is tracked — total counts, device types, locations, and time of day. See which placements drive the most social follows.",
  },
  {
    q: "Which social platforms work with QR codes?",
    a: "Any platform with a public profile URL: Instagram, TikTok, YouTube, LinkedIn, Facebook, X (Twitter), Pinterest, Snapchat, and more.",
  },
];

export default function QRCodeForSocialMediaPage() {
  return (
    <UseCasePageLayout
      canonicalPath="/qr-code-for-social-media"
      headline="QR Code for Social Media"
      subheadline="Bridge the gap between offline and online. Let anyone follow you on Instagram, TikTok, YouTube, or LinkedIn with a single scan."
      description="Every physical touchpoint — a business card, product package, event sign — is a missed opportunity to grow your social following. A social media QR code from AnalogQR turns those moments into new followers. Change the destination anytime, and track every scan."
      ctaHref="/create?type=website&usecase=social-media"
      ctaLabel="Create My Social Media QR Code"
      benefits={[
        "Turn any physical touchpoint into a follower growth opportunity",
        "Link to any platform: Instagram, TikTok, YouTube, LinkedIn, and more",
        "Dynamic: update the destination without reprinting",
        "Track how many people follow through from each placement",
        "Branded QR with your logo and colors",
        "Works on business cards, packaging, signage, and print ads",
      ]}
      steps={[
        {
          title: "Paste your social profile link",
          body: "Enter your Instagram, TikTok, LinkedIn, or any social profile URL — or a Linktree-style page with all your profiles.",
        },
        {
          title: "Customize your QR code",
          body: "Add your logo, pick brand colors, and download a print-ready QR code in seconds.",
        },
        {
          title: "Place it everywhere and track",
          body: "Add the QR to your print materials. Watch follower-driving scans roll into your dashboard.",
        },
      ]}
      faqs={FAQS}
      relatedPages={RELATED}
    />
  );
}
