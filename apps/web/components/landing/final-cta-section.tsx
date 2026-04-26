import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <>
      <section className="border-t bg-foreground text-background px-4 sm:px-6 py-24">
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Your first QR code is free.
          </h2>
          <p className="text-lg opacity-70 leading-relaxed">
            No credit card. No commitment. Start tracking real-world engagement
            in under a minute.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base px-8 bg-transparent text-background border-background/40 hover:bg-background/10 hover:text-background w-full sm:w-auto"
            >
              <Link href="/sign-up">Create Free QR Code</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="text-base px-8 bg-background text-foreground hover:bg-background/90 w-full sm:w-auto"
            >
              <Link href="#pricing">See pricing</Link>
            </Button>
          </div>
          <p className="text-xs opacity-50">
            Free plan · No credit card · Cancel anytime
          </p>
        </div>
      </section>

      <footer className="border-t px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">AnalogQR</span>
          <span>© {new Date().getFullYear()} AnalogQR. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
