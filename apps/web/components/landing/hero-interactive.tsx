"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { normalizeUrl } from "@/lib/url";

const MOBILE_USE_CASES = [
  { label: "Restaurant Menu", href: "/create?type=website&usecase=restaurant-menu" },
  { label: "Flyer Tracking", href: "/create?type=website&usecase=flyer-tracking" },
  { label: "Business Card", href: "/create?type=vcard&usecase=business-card" },
  { label: "Events", href: "/create?type=website&usecase=events" },
  { label: "Packaging", href: "/create?type=website&usecase=packaging" },
  { label: "Real Estate", href: "/create?type=website&usecase=real-estate" },
];

const APP_ORIGIN = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://analogqr.com"
).replace(/\/$/, "");

const SAMPLE_CODE = "summer24";
const SAMPLE_URL = `${APP_ORIGIN}/r/${SAMPLE_CODE}`;

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
    <div className="rounded-2xl border bg-white shadow-lg p-6 flex flex-col items-center gap-4 w-full">
      {/* QR image */}
      <div
        className="w-44 h-44 shrink-0"
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />

      {/* Short link + badge */}
      <div className="text-center space-y-1.5">
        <p className="text-xs font-mono text-muted-foreground truncate max-w-[200px]">
          {APP_ORIGIN.replace(/^https?:\/\//, "")}/r/{shortCode}
        </p>
        <Badge variant="secondary" className="text-xs">
          Editable anytime
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex gap-2 w-full">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 mr-1.5 text-green-600" />
          ) : (
            <Copy className="h-3.5 w-3.5 mr-1.5" />
          )}
          {copied ? "Copied!" : "Copy link"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleDownload}
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
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
    return () => {
      cancelled = true;
    };
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
    <section className="px-4 sm:px-6 py-12 sm:py-20 lg:py-28 mx-auto max-w-6xl">
      <div className="grid gap-12 lg:gap-16 lg:grid-cols-[1fr,320px] lg:items-center">
        {/* Left column: copy + input */}
        <div className="space-y-8 min-w-0">
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground">
              Create dynamic QR codes and update anytime
            </h1>
            <p className="text-lg sm:text-xl font-bold leading-snug text-primary">
              Track every scan across devices, locations, and performance in one dashboard
            </p>
          </div>

          {/* Mobile use-case quick links */}
          <div className="md:hidden flex flex-wrap gap-2">
            {MOBILE_USE_CASES.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1.5",
                  "text-sm font-semibold text-foreground",
                  "bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary",
                  "transition-colors duration-150"
                )}
              >
                {label}
              </a>
            ))}
          </div>

          {/* URL input */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="your-website.com or https://your-link.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-11 text-base flex-1 min-w-0"
                autoComplete="off"
              />
              <Button
                type="submit"
                size="lg"
                className="h-11 px-4 shrink-0"
                disabled={!url.trim()}
              >
                <span className="hidden sm:inline mr-1.5">Generate</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {url.trim()
                ? "Press Generate to create your trackable QR code"
                : "Paste any link to see your QR preview update live"}
            </p>
          </form>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {isLoggedIn ? (
              <Button asChild size="lg" className="text-base px-7">
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            ) : (
              <Button asChild size="lg" className="text-base px-7">
                <a href="/sign-up">Create Free QR Code →</a>
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base px-7"
            >
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 -mt-4">
            <span className="text-sm text-muted-foreground">Free plan available</span>
            <span className="text-sm text-muted-foreground">No credit card required</span>
            <span className="text-sm text-muted-foreground">Cancel anytime</span>
          </div>
        </div>

        {/* Right column: live QR preview */}
        <div
          className={cn(
            "mx-auto w-full max-w-xs lg:max-w-none",
            "transition-opacity duration-300"
          )}
        >
          <QRPreviewCard
            svgMarkup={previewSvg}
            shortCode={previewCode}
            previewUrl={previewUrl}
          />
        </div>
      </div>
    </section>
  );
}
