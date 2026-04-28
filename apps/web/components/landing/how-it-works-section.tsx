import Link from "next/link";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    n: 1,
    label: "Paste your link",
    detail: "Drop in any URL: website, menu, file, or social profile.",
  },
  {
    n: 2,
    label: "Generate your QR",
    detail: "Customize colors and logo, then download in seconds.",
  },
  {
    n: 3,
    label: "Track every scan",
    detail: "See real-time data on who scanned, where, and on what device.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-t bg-muted/30 px-4 sm:px-6 py-20"
    >
      <div className="mx-auto max-w-6xl text-center space-y-10">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            From link to trackable QR in seconds
          </h2>
          <p className="text-muted-foreground text-lg">
            No design skills required. No complicated setup.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
          {STEPS.map(({ n, label, detail }) => (
            <div key={n} className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary text-lg font-bold tabular-nums">
                {n}
              </div>
              <p className="text-base font-semibold leading-snug">{label}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {detail}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Button asChild size="lg" className="text-base px-8">
            <Link href="/sign-up">Create your first QR code for free</Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}
