import Link from "next/link";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    n: "01",
    label: "Paste your link",
    detail: "Drop in any URL: website, menu, file, or social profile.",
  },
  {
    n: "02",
    label: "Generate your QR",
    detail: "Customize colors and logo, then download in seconds.",
  },
  {
    n: "03",
    label: "Track every scan",
    detail: "See real-time data on who scanned, where, and on what device.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t bg-zinc-50/60 px-4 sm:px-6 py-24">
      <div className="mx-auto max-w-6xl space-y-16">

        <div className="text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">How it works</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em]">
            Link to QR in seconds
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            No design skills required. No complicated setup.
          </p>
        </div>

        <div className="grid gap-0 sm:grid-cols-3 max-w-4xl mx-auto relative">
          {/* Connector lines (desktop) */}
          <div className="absolute top-8 left-[calc(33.33%+2rem)] right-[calc(33.33%+2rem)] h-px bg-border hidden sm:block" />

          {STEPS.map(({ n, label, detail }, i) => (
            <div key={n} className="relative flex flex-col items-center text-center gap-5 px-6 pb-10 sm:pb-0">
              {/* Mobile connector */}
              {i < STEPS.length - 1 && (
                <div className="absolute top-16 left-1/2 h-10 w-px bg-border sm:hidden" />
              )}
              {/* Step number */}
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-border shadow-sm">
                <span className="text-xl font-bold tabular-nums tracking-[-0.04em] text-foreground">{n}</span>
              </div>
              <div className="space-y-2">
                <p className="text-base font-semibold tracking-[-0.01em]">{label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-3">
          <Button asChild size="lg" className="h-12 px-8 text-sm font-semibold shadow-md shadow-primary/20">
            <Link href="/sign-up">Create your first QR code free</Link>
          </Button>
          <p className="text-xs text-muted-foreground">No credit card required</p>
        </div>
      </div>
    </section>
  );
}
