import type { Metadata } from "next";
import { Mail, Clock, MessageCircle } from "lucide-react";
import { LandingNav } from "@/components/landing/landing-nav";
import { ContactForm } from "@/components/contact/contact-form";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Contact Us — AnalogQR",
  description:
    "Get in touch with the AnalogQR team. Questions about your plan, a feature request, or just want to say hello — we read every message.",
  alternates: { canonical: "/contact" },
};

const HIGHLIGHTS = [
  {
    icon: Clock,
    title: "Fast replies",
    body: "We typically respond within one business day.",
  },
  {
    icon: MessageCircle,
    title: "Real people",
    body: "No bots. Every message goes straight to the team.",
  },
  {
    icon: Mail,
    title: "Or email directly",
    body: "hello@analogqr.com",
    href: "mailto:hello@analogqr.com",
  },
];

export default async function ContactPage() {
  const user = await getUser();

  return (
    <>
      <LandingNav isLoggedIn={!!user} />

      <main className="min-h-[calc(100vh-3.5rem)]">
        {/* Hero */}
        <section className="border-b bg-muted/30 px-4 sm:px-6 py-16 sm:py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-4">
            Contact
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] mb-4">
            Get in touch
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Questions, feedback, or a bug report. We read every message and
            reply within one business day.
          </p>
        </section>

        {/* Content */}
        <section className="px-4 sm:px-6 py-14">
          <div className="mx-auto max-w-5xl grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-16">

            {/* Left: info */}
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">
                  We're here to help
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Whether you have a question about pricing, need help with a
                  QR code, or want to share feedback, reach out and we'll get
                  back to you.
                </p>
              </div>

              <div className="space-y-4">
                {HIGHLIGHTS.map(({ icon: Icon, title, body, href }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted border">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold">{title}</p>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm text-primary hover:underline underline-offset-4"
                        >
                          {body}
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">{body}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
