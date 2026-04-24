import { Badge } from "@/components/ui/badge";
import { TrackedButton } from "@/components/landing/tracked-button";
import { TryItInput } from "@/components/landing/try-it-input";

type Props = { isLoggedIn: boolean; qrSvg: string };

const SPARKLINE = [24, 45, 32, 67, 89, 54, 78];
const MAX_SPARK = 89;

function QRCard({ qrSvg }: { qrSvg: string }) {
  return (
    <div className="rounded-2xl border bg-white shadow-md p-5 flex flex-col items-center gap-3 w-full sm:w-56">
      <div
        className="w-36 h-36 shrink-0"
        dangerouslySetInnerHTML={{ __html: qrSvg }}
      />
      <div className="text-center space-y-1">
        <p className="text-xs font-mono text-muted-foreground">
          flexqr.app/r/summer24
        </p>
        <Badge variant="secondary" className="text-xs">
          Active · 1,284 scans
        </Badge>
      </div>
    </div>
  );
}

function AnalyticsMockCard() {
  return (
    <div className="rounded-2xl border bg-card shadow-md p-5 space-y-4 w-full sm:w-72 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Last 30 days
        </span>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
          Live
        </span>
      </div>

      <div>
        <p className="text-3xl font-bold tabular-nums">1,284</p>
        <p className="text-xs text-muted-foreground">total scans</p>
      </div>

      {/* Sparkline */}
      <div className="flex items-end gap-1 h-10">
        {SPARKLINE.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-primary"
            style={{ height: `${(v / MAX_SPARK) * 100}%`, opacity: 0.4 + (v / MAX_SPARK) * 0.6 }}
          />
        ))}
      </div>

      {/* Devices */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Devices</p>
        {[
          { label: "Mobile", pct: 68 },
          { label: "Desktop", pct: 28 },
          { label: "Tablet", pct: 4 },
        ].map(({ label, pct }) => (
          <div key={label}>
            <div className="flex justify-between text-xs mb-0.5">
              <span>{label}</span>
              <span className="text-muted-foreground">{pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Countries */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Top Countries</p>
        {[
          { flag: "🇺🇸", label: "United States", pct: 41 },
          { flag: "🇬🇧", label: "United Kingdom", pct: 18 },
          { flag: "🇨🇦", label: "Canada", pct: 12 },
        ].map(({ flag, label, pct }) => (
          <div key={label} className="flex items-center justify-between text-xs">
            <span>
              {flag} {label}
            </span>
            <span className="text-muted-foreground tabular-nums">{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSection({ isLoggedIn, qrSvg }: Props) {
  return (
    <section className="px-4 sm:px-6 py-20 sm:py-28 mx-auto max-w-6xl text-center">
      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto">
        Create QR Codes That Actually Tell You What Happens After the Scan
      </h1>

      {/* Subheadline */}
      <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Generate dynamic QR codes, change the destination anytime, and track
        every scan: devices, locations, and performance, from one dashboard.
      </p>

      {/* CTAs */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {isLoggedIn ? (
          <TrackedButton
            href="/dashboard"
            size="lg"
            className="text-base px-7"
            trackEvent="cta_click"
            trackProps={{ label: "Go to Dashboard", location: "hero_primary" }}
          >
            Go to Dashboard
          </TrackedButton>
        ) : (
          <TrackedButton
            href="/sign-up"
            size="lg"
            className="text-base px-7"
            trackEvent="cta_click"
            trackProps={{ label: "Create Free QR Code", location: "hero_primary" }}
          >
            Create Free QR Code →
          </TrackedButton>
        )}
        <TrackedButton
          href="#how-it-works"
          variant="outline"
          size="lg"
          className="text-base px-7"
          trackEvent="cta_click"
          trackProps={{ label: "See How It Works", location: "hero_secondary" }}
        >
          See How It Works
        </TrackedButton>
      </div>

      {/* Microcopy */}
      <p className="mt-3 text-sm text-muted-foreground">
        Free plan available · No credit card required
      </p>

      {/* Try it now */}
      <div className="mt-8 space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Try it now
        </p>
        <TryItInput />
      </div>

      {/* Demo preview */}
      <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
        <QRCard qrSvg={qrSvg} />
        <AnalyticsMockCard />
      </div>
    </section>
  );
}
