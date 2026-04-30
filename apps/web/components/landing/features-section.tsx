import { Zap, BarChart2, Palette, RefreshCw, Globe, QrCode } from "lucide-react";

const FEATURES = [
  {
    icon: RefreshCw,
    title: "Update anytime",
    body: "Change the destination URL of any printed QR code from your dashboard. No reprinting needed.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: BarChart2,
    title: "Real-time analytics",
    body: "See scans, devices, cities, and trends the moment they happen. All in one clean dashboard.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Palette,
    title: "Custom colors and logos",
    body: "Brand every QR code with your colors and logo. Available on Starter and Pro plans.",
    color: "text-fuchsia-600",
    bg: "bg-fuchsia-50",
  },
  {
    icon: Zap,
    title: "Instant generation",
    body: "Paste a link and get a production-ready QR code in under three seconds.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Globe,
    title: "Works everywhere",
    body: "Menus, flyers, business cards, billboards. One code that works on any surface.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: QrCode,
    title: "Dynamic redirects",
    body: "Every QR code routes through a short link you own, so you are never locked in.",
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-t px-4 sm:px-6 py-24">
      <div className="mx-auto max-w-6xl space-y-14">

        <div className="text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Features</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em]">
            Everything you need.
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
            Built for marketers, businesses, and creators who need real results from their QR codes.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body, color, bg }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border/60 bg-card px-6 py-6 shadow-sm hover:shadow-md hover:border-border transition-all duration-200 space-y-4"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className="space-y-1.5">
                <p className="font-semibold text-[0.9375rem] tracking-[-0.01em]">{title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
