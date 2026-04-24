import { Separator } from "@/components/ui/separator";

const FAQS = [
  {
    q: "What is a dynamic QR code?",
    a: "A QR code whose destination you can change anytime, even after printing.",
  },
  {
    q: "Can I track scans?",
    a: "Yes. You'll see how many scans, where they came from, and what device was used.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. Start with 5 QR codes at no cost.",
  },
  {
    q: "Do I need a credit card?",
    a: "No. You can start free instantly.",
  },
];

export function FaqSection() {
  return (
    <section className="border-t bg-muted/30 px-4 sm:px-6 py-20">
      <div className="mx-auto max-w-2xl space-y-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">
          FAQ
        </h2>

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
