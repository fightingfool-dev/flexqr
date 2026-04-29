import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "QR Code with Logo — Custom Branded QR Code Generator",
  description:
    "Create a QR code with your logo and brand colors. Fully custom branded QR codes that are dynamic, trackable, and print-ready. Free trial available.",
  alternates: { canonical: "/qr-code-with-logo" },
  openGraph: {
    title: "QR Code with Logo | AnalogQR",
    description:
      "Create a QR code with your logo and brand colors. Dynamic, trackable, and print-ready. Free trial available.",
    url: "/qr-code-with-logo",
    type: "website",
  },
};

const RELATED = [
  { label: "Free QR Code Generator", href: "/free-qr-code-generator" },
  { label: "Dynamic QR Code Generator", href: "/dynamic-qr-code-generator" },
  { label: "QR Code for Business Card", href: "/qr-code-for-business-card" },
  { label: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
  { label: "QR Code for Marketing", href: "/qr-code-for-marketing" },
  { label: "QR Code for Packaging", href: "/qr-code-for-packaging" },
];

const FAQS = [
  {
    q: "Does adding a logo make the QR code harder to scan?",
    a: "No. QR codes have built-in error correction (up to 30%) which allows a logo to be placed in the center without affecting scannability. AnalogQR automatically sizes the logo to stay within the safe zone.",
  },
  {
    q: "What logo format should I upload?",
    a: "PNG with a transparent background works best. SVG is also supported. We recommend a square logo for the cleanest result.",
  },
  {
    q: "Can I change the QR code color to match my brand?",
    a: "Yes. AnalogQR lets you set a custom foreground color for the QR pattern. Use your brand's hex color for a perfectly on-brand result.",
  },
  {
    q: "Can I download the QR code as a vector for large print?",
    a: "Yes. AnalogQR supports SVG download for infinitely scalable, print-perfect QR codes alongside high-resolution PNG.",
  },
  {
    q: "Is the logo QR code also dynamic?",
    a: "Yes. Logo QR codes on AnalogQR are fully dynamic — you can update the destination URL anytime without regenerating or re-downloading the code.",
  },
  {
    q: "Which plan includes the logo feature?",
    a: "Logo support is available on the Starter plan ($10/month) and Pro plan ($29/month). The free plan includes basic QR codes without logo customization.",
  },
];

export default function QRCodeWithLogoPage() {
  return (
    <UseCasePageLayout
      canonicalPath="/qr-code-with-logo"
      headline="QR Code with Logo"
      subheadline="Add your brand to every scan. Custom colors, your logo, and a dynamic QR code that's print-ready."
      description="A plain black-and-white QR code works — but a branded QR code builds trust. AnalogQR lets you upload your logo, set your brand colors, and generate a custom QR code that looks as professional as your business. Still fully dynamic: edit the destination anytime."
      ctaHref="/sign-up"
      ctaLabel="Create My Branded QR Code"
      benefits={[
        "Upload your logo and embed it directly in the QR code",
        "Custom foreground color to match your brand palette",
        "Download as PNG or SVG for any size print",
        "Still fully dynamic — edit the destination URL anytime",
        "Track scans to measure branded QR code performance",
        "Works on business cards, packaging, flyers, and signage",
      ]}
      steps={[
        {
          title: "Enter your destination URL",
          body: "Paste the link you want your QR code to point to. Any URL works.",
        },
        {
          title: "Upload your logo and set colors",
          body: "Upload your logo PNG and choose a brand color. AnalogQR positions the logo automatically.",
        },
        {
          title: "Download and deploy",
          body: "Download your branded QR code as PNG or SVG. Use it on any print or digital material.",
        },
      ]}
      faqs={FAQS}
      relatedPages={RELATED}
    />
  );
}
