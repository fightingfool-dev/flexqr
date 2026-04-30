import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function FinalCtaSection() {
  return (
    <>
      <section className="relative border-t overflow-hidden bg-foreground text-background px-4 sm:px-6 py-28">

        {/* Subtle radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(99,102,241,0.25) 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/40">Get started</p>
            <h2 className="text-5xl sm:text-6xl font-bold tracking-[-0.04em] leading-[1.05]">
              Your first QR code is free.
            </h2>
          </div>
          <p className="text-lg text-background/60 leading-relaxed max-w-md mx-auto">
            No credit card. No commitment. Start tracking real-world engagement in under a minute.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-sm font-semibold bg-white text-foreground hover:bg-white/90 w-full sm:w-auto shadow-lg"
            >
              <Link href="/sign-up">Create Free QR Code</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-8 text-sm font-medium bg-transparent text-background border-white/20 hover:bg-white/10 hover:text-background w-full sm:w-auto"
            >
              <Link href="#pricing">See pricing</Link>
            </Button>
          </div>
          <p className="text-xs text-background/30">
            Free plan. No credit card. Cancel anytime.
          </p>
        </div>
      </section>

      <footer className="border-t px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <Logo size="sm" href={null} />
          <span className="text-xs">© {new Date().getFullYear()} AnalogQR. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="#" className="text-xs hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="text-xs hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
