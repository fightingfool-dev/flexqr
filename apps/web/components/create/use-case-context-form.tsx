"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUseCaseConfig } from "@/lib/use-cases";
import { normalizeUrl } from "@/lib/url";

// Fallbacks for when only `type` is provided (no usecase slug)
const TYPE_HEADINGS: Record<string, string> = {
  website: "Create a Website QR code",
  vcard: "Create a Business Card QR code",
  wifi: "Create a WiFi QR code",
  pdf: "Create a PDF QR code",
};

const TYPE_HELPERS: Record<string, string> = {
  website: "Paste any link and generate a trackable QR code in seconds.",
  vcard: "Link to your portfolio, LinkedIn, or contact page.",
  wifi: "Paste a link to your WiFi info page or use the dashboard to build a full WiFi QR.",
  pdf: "Paste the URL of your PDF or hosted document.",
};

const TYPE_PLACEHOLDERS: Record<string, string> = {
  website: "https://your-website.com",
  vcard: "https://your-portfolio-or-linkedin.com",
  wifi: "https://your-wifi-info-page.com",
  pdf: "https://your-pdf-link.com",
};

type Props = {
  type: string;
  usecase: string;
};

export function UseCaseContextForm({ type, usecase }: Props) {
  const router = useRouter();
  const [url, setUrl] = useState("");

  const config = getUseCaseConfig(usecase);

  const heading = config?.heading ?? TYPE_HEADINGS[type] ?? "Create a QR code";
  const helper = config?.helper ?? TYPE_HELPERS[type] ?? "Paste the URL you want your QR code to point to.";
  const placeholder = config?.placeholder ?? TYPE_PLACEHOLDERS[type] ?? "https://your-link.com";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    const normalized = normalizeUrl(trimmed);
    try {
      new URL(normalized);
    } catch {
      return;
    }
    const params = new URLSearchParams({ url: normalized, type });
    if (usecase) params.set("usecase", usecase);
    router.push(`/create?${params.toString()}`);
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {heading}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          {helper}
        </p>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder={placeholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-11 text-base"
            autoFocus
            autoComplete="off"
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!url.trim()}
          >
            Preview my QR code
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground">
          Free to create · Update destination anytime
        </p>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Want more options?{" "}
        <Link
          href="/sign-up"
          className="underline underline-offset-4 hover:text-foreground transition-colors"
        >
          Sign up for the full QR builder
        </Link>
      </p>
    </div>
  );
}
