import type { Metadata } from "next";
import { UseCasePageLayout } from "@/components/landing/use-case-page";

export const metadata: Metadata = {
  title: "QR Code for Events — Track Attendance & Update Links Anytime",
  description:
    "Create trackable QR codes for your events. Link to registration, schedules, or live updates — and track engagement in real time. Free plan available.",
  alternates: { canonical: "/qr-code-for-events" },
  openGraph: {
    title: "QR Code for Events | AnalogQR",
    description:
      "Create trackable QR codes for your events. Track attendance engagement in real time. Free plan available.",
    url: "/qr-code-for-events",
    type: "website",
  },
};

const RELATED = [
  { label: "QR Code for Restaurant Menu", href: "/qr-code-for-restaurant-menu" },
  { label: "QR Code for Flyer Tracking", href: "/qr-code-for-flyer-tracking" },
  { label: "QR Code for Business Card", href: "/qr-code-for-business-card" },
  { label: "QR Code for Packaging", href: "/qr-code-for-packaging" },
  { label: "QR Code for Real Estate", href: "/qr-code-for-real-estate" },
  { label: "QR Code Analytics", href: "/qr-code-analytics" },
];

const FAQS = [
  {
    q: "Can I change the QR destination before and after the event?",
    a: "Yes. Update the link anytime from your dashboard: point to the registration page before the event, the live stream during, and a recap or feedback survey afterwards.",
  },
  {
    q: "Can I use the same QR code on all my event materials?",
    a: "Yes. Print it on banners, programs, name badges, and social posts. One QR code, one link you fully control.",
  },
  {
    q: "How do I track which venue signage gets the most scans?",
    a: "Create a separate QR code for each placement (entrance banner, registration desk, programs), then compare scan counts in your dashboard to see what drives engagement.",
  },
  {
    q: "Is there a limit to how many scans I can track?",
    a: "No. All plans include unlimited scan tracking with no cap on the number of scans recorded.",
  },
  {
    q: "Can attendees scan the QR without a special app?",
    a: "Yes. Any modern smartphone camera on iOS or Android can scan a QR code natively, no app download required.",
  },
];

export default function EventsPage() {
  return (
    <UseCasePageLayout
      canonicalPath="/qr-code-for-events"
      headline="QR Code for Events"
      subheadline="Drive registrations, share schedules, and measure engagement. All from a single scannable QR code."
      description="From conferences to community meetups, AnalogQR gives event organizers a dynamic QR code that works before, during, and after the event. Update the destination as the event evolves: from registration to agenda to post-event recap, without changing a single printed material."
      ctaHref="/create?type=website&usecase=events"
      ctaLabel="Create My Event QR Code"
      benefits={[
        "Link to registration, agenda, or live event stream in one code",
        "Update the destination as the event evolves, no reprint needed",
        "Track how many attendees scan your event materials",
        "Use on banners, programs, badges, and social posts",
        "Branded QR colors to match your event identity",
        "Redirect to post-event recap or survey after the event ends",
      ]}
      steps={[
        {
          title: "Paste your event link",
          body: "Enter your registration page, event website, or live stream URL.",
        },
        {
          title: "Generate your event QR code",
          body: "AnalogQR creates a dynamic code you can print on all your event materials.",
        },
        {
          title: "Track attendance engagement",
          body: "See scan data in real time. Update the destination as the event progresses.",
        },
      ]}
      faqs={FAQS}
      relatedPages={RELATED}
    />
  );
}
