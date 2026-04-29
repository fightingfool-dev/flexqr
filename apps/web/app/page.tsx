import type { Metadata } from "next";
import { getUser } from "@/lib/auth";
import { generateQRSvg } from "@/lib/qr";
import { LandingNav } from "@/components/landing/landing-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { AnalyticsPreviewSection } from "@/components/landing/analytics-preview-section";
import { UseCasesSection } from "@/components/landing/use-cases-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { MobileStickyCta } from "@/components/landing/mobile-sticky-cta";
import { JsonLd } from "@/components/seo/json-ld";

const BASE = "https://www.analogqr.com";

export const metadata: Metadata = {
  title: { absolute: "Free QR Code Generator with Analytics | AnalogQR" },
  description:
    "Create free dynamic QR codes you can edit anytime. Track scans by device, location, and time. Add your logo, customize colors, and never reprint. Free plan available.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Free QR Code Generator with Analytics | AnalogQR",
    description:
      "Create free dynamic QR codes you can edit anytime. Track every scan — device, location, and time. No reprinting ever.",
    url: "/",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Free QR Code Generator with Analytics | AnalogQR",
    description:
      "Create free dynamic QR codes you can edit anytime. Track every scan — device, location, and time.",
    images: ["/opengraph-image"],
  },
};

const APP_FAQS = [
  {
    q: "What is a dynamic QR code?",
    a: "A dynamic QR code redirects through a short link you control. You can change the destination URL anytime, even after the code is printed, without generating a new QR code.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. You can create 1 QR code for free with no credit card required. It includes basic analytics and dynamic redirects.",
  },
  {
    q: "What do I get on the Starter plan?",
    a: "For $10/month you get 5 QR codes, full analytics, custom QR colors, and the ability to add your logo to every code.",
  },
  {
    q: "What does Pro include?",
    a: "Pro is $29/month and gives you 50 QR codes, everything in Starter, plus custom domains and priority support.",
  },
  {
    q: "Can I change the destination URL after printing?",
    a: "Yes, that's the whole point. Edit the URL from your dashboard at any time. The printed QR code keeps working.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. Cancel your subscription from the dashboard at any time. You keep access until the end of your billing period.",
  },
  {
    q: "Can I track scans?",
    a: "Yes. Every plan includes scan tracking. You will see total scans, devices, countries, and trends over time.",
  },
];

export default async function HomePage() {
  const [user, qrSvg] = await Promise.all([
    getUser(),
    generateQRSvg("https://www.analogqr.com/r/summer24"),
  ]);

  const isLoggedIn = !!user;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "AnalogQR",
          url: BASE,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description:
            "Free dynamic QR code generator. Create QR codes you can edit anytime, track scans by device and location, add your logo, and never reprint.",
          offers: [
            {
              "@type": "Offer",
              name: "Free",
              price: "0",
              priceCurrency: "USD",
              description: "1 dynamic QR code, basic analytics.",
            },
            {
              "@type": "Offer",
              name: "Starter",
              price: "10",
              priceCurrency: "USD",
              description: "5 QR codes, full analytics, custom colors, logo.",
            },
            {
              "@type": "Offer",
              name: "Pro",
              price: "29",
              priceCurrency: "USD",
              description: "50 QR codes, everything in Starter, custom domains.",
            },
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "128",
            bestRating: "5",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: APP_FAQS.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }}
      />

      <LandingNav isLoggedIn={isLoggedIn} />

      <main className="pb-24 md:pb-0">
        <HeroSection isLoggedIn={isLoggedIn} qrSvg={qrSvg} />
        <HowItWorksSection />
        <FeaturesSection />
        <AnalyticsPreviewSection />
        <UseCasesSection />
        <PricingSection />
        <FaqSection />
        <FinalCtaSection />
      </main>

      <MobileStickyCta isLoggedIn={isLoggedIn} />
    </>
  );
}
