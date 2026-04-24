import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: "⚡",
    title: "Dynamic QR Codes",
    body: "Change your destination anytime, even after printing",
  },
  {
    icon: "📊",
    title: "Real-Time Analytics",
    body: "See scans, devices, countries, and trends instantly",
  },
  {
    icon: "🎯",
    title: "Built for Action",
    body: "Know what works. Double down. Stop guessing.",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-t px-4 sm:px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-5 sm:grid-cols-3">
          {FEATURES.map(({ icon, title, body }) => (
            <Card key={title} className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="text-2xl mb-1">{icon}</div>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
