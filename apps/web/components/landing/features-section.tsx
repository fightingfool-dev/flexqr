import { Zap, BarChart2, Palette, RefreshCw, Globe, QrCode } from "lucide-react";

const FEATURES = [
  {
    icon: RefreshCw,
    title: "Update anytime",
    body: "Change the destination URL of any QR code after it's printed. No reprinting needed.",
  },
  {
    icon: BarChart2,
    title: "Real-time analytics",
    body: "See scans, devices, cities, and trends the moment they happen, all in one dashboard.",
  },
  {
    icon: Palette,
    title: "Custom colors & logos",
    body: "Brand every QR code with your colors and logo. Available on Starter and Pro plans.",
  },
  {
    icon: Zap,
    title: "Instant generation",
    body: "Paste a link and get a production-ready QR code in under 3 seconds.",
  },
  {
    icon: Globe,
    title: "Works everywhere",
    body: "Menus, flyers, business cards, billboards. One code that works on any surface.",
  },
  {
    icon: QrCode,
    title: "Dynamic redirects",
    body: "Every QR code routes through a short link you own, so you're never locked in.",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-t px-4 sm:px-6 py-20">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Built for marketers, businesses, and creators who need real results
            from their QR codes.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl border bg-card px-5 py-5 shadow-sm space-y-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">{title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
