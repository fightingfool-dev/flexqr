"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Download, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { normalizeUrl } from "@/lib/url";

const APP_ORIGIN = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://analogqr.com"
).replace(/\/$/, "");

const SAMPLE_CODE = "summer24";
const SAMPLE_URL = `${APP_ORIGIN}/r/${SAMPLE_CODE}`;

const TRUST_ITEMS = [
  "Free plan, no card needed",
  "Update destination anytime",
  "Real-time scan analytics",
];

function derivePreviewCode(url: string): string {
  let h = 5381;
  for (let i = 0; i < url.length; i++) {
    h = (((h << 5) + h) ^ url.charCodeAt(i)) >>> 0;
  }
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  let state = h;
  for (let i = 0; i < 8; i++) {
    state = (state * 1664525 + 1013904223) >>> 0;
    out += chars[state % chars.length];
  }
  return out;
}

function QRPreviewCard({
  svgMarkup,
  shortCode,
  previewUrl,
}: {
  svgMarkup: string;
  shortCode: string;
  previewUrl: string;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleCopy() {
    navigator.clipboard.writeText(previewUrl).then(() => {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleDownload() {
    const QRCode = (await import("qrcode")).default;
    const dataUrl = await QRCode.toDataURL(previewUrl, { width: 1200 });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `analogqr-${shortCode}.png`;
    a.click();
  }

  return (
    <div className="relative rounded-2xl border border-border/60 bg-white shadow-2xl shadow-indigo-500/10 p-7 flex flex-col items-center gap-5 w-full">
      {/* Subtle glow behind card */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      {/* Live indicator */}
      <div className="flex items-center gap-1.5 self-end">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Live preview</span>
      </div>

      {/* QR image */}
      <div
        className="w-44 h-44 shrink-0 rounded-lg overflow-hidden"
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />

      {/* Short link */}
      <p className="text-xs font-mono text-muted-foreground truncate max-w-[200px] bg-muted/60 px-3 py-1.5 rounded-full">
        {APP_ORIGIN.replace(/^https?:\/\//, "")}/r/{shortCode}
      </p>

      {/* Actions */}
      <div className="flex gap-2 w-full">
        <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={handleCopy}>
          {copied ? <Check className="h-3 w-3 mr-1.5 text-emerald-600" /> : <Copy className="h-3 w-3 mr-1.5" />}
          {copied ? "Copied" : "Copy link"}
        </Button>
        <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={handleDownload}>
          <Download className="h-3 w-3 mr-1.5" />
          Download
        </Button>
      </div>
    </div>
  );
}

type Props = {
  initialQrSvg: string;
  isLoggedIn: boolean;
};

export function HeroInteractive({ initialQrSvg, isLoggedIn }: Props) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [previewSvg, setPreviewSvg] = useState(initialQrSvg);
  const [previewCode, setPreviewCode] = useState(SAMPLE_CODE);
  const [previewUrl, setPreviewUrl] = useState(SAMPLE_URL);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    const trimmed = url.trim();

    if (!trimmed) {
      setPreviewSvg(initialQrSvg);
      setPreviewCode(SAMPLE_CODE);
      setPreviewUrl(SAMPLE_URL);
      return;
    }

    const code = derivePreviewCode(trimmed);
    const qrTarget = `${APP_ORIGIN}/r/${code}`;

    async function generate() {
      const QRCode = (await import("qrcode")).default;
      const svg = await QRCode.toString(qrTarget, { type: "svg" });
      if (cancelled) return;
      setPreviewSvg(svg);
      setPreviewCode(code);
      setPreviewUrl(qrTarget);
    }

    generate().catch(console.error);
    return () => { cancelled = true; };
  }, [url, initialQrSvg]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    startTransition(() => {
      router.push(`/create?url=${encodeURIComponent(normalizeUrl(trimmed))}`);
    });
  }

  return (
    <section className="relative px-4 sm:px-6 pt-16 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32 mx-auto max-w-6xl overflow-hidden">

      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-20"
        style={{ background: "radial-gradient(ellipse at center, #4f46e5 0%, transparent 70%)" }}
      />

      <div className="relative grid gap-14 lg:gap-20 lg:grid-cols-[1fr,320px] lg:items-center">
        {/* ── Left column ── */}
        <div className="space-y-8 min-w-0">

          {/* Announcement badge */}
          <a
            href="/qr-code-for-business-card"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5",
              "px-4 py-1.5 text-xs font-semibold text-primary",
              "hover:bg-primary/10 transition-colors"
            )}
          >
            <Sparkles className="h-3 w-3 shrink-0" />
            New: Hosted digital business cards and menus
            <ArrowRight className="h-3 w-3 shrink-0 opacity-60" />
          </a>

          {/* Headline */}
          <div className="space-y-5">
            <h1 className="text-5xl sm:text-6xl lg:text-[4.25rem] font-bold tracking-[-0.03em] leading-[1.05] text-foreground">
              QR codes that work<br className="hidden sm:block" />
              <span className="text-primary"> after you print them</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Change the destination anytime. Track every scan by device, city, and time. No reprinting ever.
            </p>
          </div>

          {/* URL input */}
          <form onSubmit={handleSubmit} className="space-y-3 max-w-lg">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Paste any link to see a live preview"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12 text-sm flex-1 min-w-0 bg-background shadow-sm border-border/80 focus-visible:border-primary/60"
                autoComplete="off"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 px-5 shrink-0 font-semibold shadow-md shadow-primary/20"
                disabled={!url.trim()}
              >
                <span className="hidden sm:inline mr-1.5">Generate</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {isLoggedIn ? (
              <Button asChild size="lg" className="h-12 px-7 text-sm font-semibold shadow-md shadow-primary/25">
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            ) : (
              <Button asChild size="lg" className="h-12 px-7 text-sm font-semibold shadow-md shadow-primary/25">
                <a href="/sign-up">Start for free</a>
              </Button>
            )}
            <Button asChild variant="ghost" size="lg" className="h-12 px-7 text-sm font-medium text-muted-foreground hover:text-foreground">
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>

          {/* Trust line */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1">
            {TRUST_ITEMS.map((t, i) => (
              <span key={i} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right column: QR preview ── */}
        <div className={cn("mx-auto w-full max-w-xs lg:max-w-none", "transition-opacity duration-300")}>
          <QRPreviewCard svgMarkup={previewSvg} shortCode={previewCode} previewUrl={previewUrl} />
        </div>
      </div>
    </section>
  );
}
