import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTracker } from "@/components/tracking/page-tracker";
import { JsonLd } from "@/components/seo/json-ld";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = "https://www.analogqr.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "AnalogQR — Free QR Code Generator with Analytics",
    template: "%s | AnalogQR",
  },
  description:
    "Free dynamic QR code generator. Create QR codes you can edit anytime, track scans by device and location, add your logo, and never reprint. Free plan available.",
  keywords: [
    "QR code generator",
    "free QR code generator",
    "dynamic QR code",
    "QR code with logo",
    "QR code analytics",
    "editable QR code",
    "trackable QR code",
  ],
  openGraph: {
    siteName: "AnalogQR",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@analogqr",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <PageTracker />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${APP_URL}/#organization`,
              name: "AnalogQR",
              url: APP_URL,
              logo: { "@type": "ImageObject", url: `${APP_URL}/icon.svg` },
              sameAs: [],
            },
            {
              "@type": "WebSite",
              "@id": `${APP_URL}/#website`,
              url: APP_URL,
              name: "AnalogQR",
              publisher: { "@id": `${APP_URL}/#organization` },
              potentialAction: {
                "@type": "SearchAction",
                target: { "@type": "EntryPoint", urlTemplate: `${APP_URL}/create?url={search_term_string}` },
                "query-input": "required name=search_term_string",
              },
            },
          ],
        }} />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
