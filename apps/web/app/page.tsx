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

export const metadata: Metadata = {
  title: { absolute: "QR Code Generator with Analytics" },
  description:
    "Create dynamic QR codes and track scans in real time. Update destination URLs anytime without reprinting.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "QR Code Generator with Analytics | AnalogQR",
    description: "Create dynamic QR codes and track scans in real time",
    url: "/",
    type: "website",
  },
  twitter: {
    title: "QR Code Generator with Analytics | AnalogQR",
    description: "Create dynamic QR codes and track scans in real time",
  },
};

export default async function HomePage() {
  const [user, qrSvg] = await Promise.all([
    getUser(),
    generateQRSvg("https://www.analogqr.com/r/summer24"),
  ]);

  const isLoggedIn = !!user;

  return (
    <>
      <LandingNav isLoggedIn={isLoggedIn} />

      <main className="pb-16 md:pb-0">
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
