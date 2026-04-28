import { Separator } from "@/components/ui/separator";

const FAQS = [
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

export function FaqSection() {
  return (
    <section className="border-t bg-muted/30 px-4 sm:px-6 py-20">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a
              href="mailto:support@analogqr.com"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Email us
            </a>
          </p>
        </div>

        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          {FAQS.map(({ q, a }, i) => (
            <div key={q}>
              {i > 0 && <Separator />}
              <div className="px-6 py-5">
                <p className="font-semibold text-sm mb-1.5">{q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
