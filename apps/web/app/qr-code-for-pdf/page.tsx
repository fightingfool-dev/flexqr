import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "QR Code for PDF — Share Documents with a Single Scan",
  description:
    "Create a QR code that links to your PDF. Share menus, brochures, manuals, or catalogs via QR code. Update the file anytime without reprinting. Free to start.",
  alternates: { canonical: "/qr-code-for-pdf" },
  openGraph: {
    title: "QR Code for PDF | AnalogQR",
    description:
      "Create a QR code linking to your PDF. Update the file anytime without reprinting. Free to start.",
    url: "/qr-code-for-pdf",
    type: "website",
  },
};

const RELATED = [
  { label: "Free QR Code Generator", href: "/free-qr-code-generator" },
  { label: "Dynamic QR Code Generator", href: "/dynamic-qr-code-generator" },
  { label: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
  { label: "QR Code for Packaging", href: "/qr-code-for-packaging" },
  { label: "QR Code for Marketing", href: "/qr-code-for-marketing" },
  { label: "QR Code with Logo", href: "/qr-code-with-logo" },
];

const FAQS = [
  {
    q: "Can I update the PDF without changing the QR code?",
    a: "Yes. With a dynamic QR code, you update the destination URL in your dashboard. Upload the new PDF to any hosting service, paste the new link, and the printed QR code instantly points to the updated document.",
  },
  {
    q: "Where should I host the PDF?",
    a: "Any publicly accessible file hosting works: Google Drive (with sharing set to 'Anyone with the link'), Dropbox, OneDrive, Notion, or your own website.",
  },
  {
    q: "Can I track how many people open my PDF via QR?",
    a: "Yes. Every scan of the QR code is tracked: total opens, device types, locations, and timing. See exactly how many people access your document.",
  },
  {
    q: "Does the PDF open on mobile?",
    a: "Yes. Modern iOS and Android devices open PDFs natively in the browser or a PDF viewer app. No extra app is required for most users.",
  },
  {
    q: "Can I use a QR code for a confidential document?",
    a: "Only host confidential documents behind a login or with a password-protected link. The QR code itself is public. Anyone who scans it can access the destination URL.",
  },
];

export default function QRCodeForPdfPage() {
  return (
    <UseCasePageLayout
      canonicalPath="/qr-code-for-pdf"
      headline="QR Code for PDF"
      subheadline="Share any document with a single scan. Menus, brochures, manuals, catalogs. Link to your PDF and update it anytime."
      description="Printing a document and printing a QR code are two different things. With AnalogQR, your QR code points to your hosted PDF. When you update the document, you just swap the link. No reprinting, no new QR code, no hassle."
      ctaHref="/create?type=website&usecase=pdf"
      ctaLabel="Create My PDF QR Code"
      benefits={[
        "Share any hosted PDF with a single scan",
        "Update the document without reprinting the QR code",
        "Track how many people open your PDF and when",
        "Works with Google Drive, Dropbox, OneDrive, or your website",
        "Perfect for menus, brochures, manuals, and catalogs",
        "Branded QR with your logo and colors",
      ]}
      steps={[
        {
          title: "Upload and host your PDF",
          body: "Upload your PDF to Google Drive, Dropbox, or any file host and copy the shareable link.",
        },
        {
          title: "Generate your PDF QR code",
          body: "Paste the link into AnalogQR. Customize and download your QR code for print.",
        },
        {
          title: "Print and update anytime",
          body: "Add the QR to your materials. When the document changes, update the link, no new QR code needed.",
        },
      ]}
      faqs={FAQS}
      relatedPages={RELATED}
    />
  );
}
