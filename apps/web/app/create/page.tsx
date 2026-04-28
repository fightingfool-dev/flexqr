import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { QrCode } from "lucide-react";
import { generateQRSvg, previewShortCode, shortCodeUrl } from "@/lib/qr";
import { getUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/landing/landing-nav";
import { UseCaseContextForm } from "@/components/create/use-case-context-form";
import { getUseCaseConfig } from "@/lib/use-cases";
import { normalizeUrl } from "@/lib/url";

export const metadata: Metadata = { title: "Preview your QR code" };

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string; type?: string; usecase?: string }>;
}) {
  const { url: rawUrl, type, usecase } = await searchParams;

  // No url — if type/usecase context is present, show the URL-input step
  if (!rawUrl) {
    if (type || usecase) {
      const user = await getUser();
      return (
        <>
          <LandingNav isLoggedIn={!!user} />
          <main className="min-h-[calc(100vh-3.5rem)] bg-muted/30 flex items-center justify-center px-4 py-16">
            <UseCaseContextForm type={type ?? "website"} usecase={usecase ?? ""} />
          </main>
        </>
      );
    }
    redirect("/");
  }

  let destinationUrl: string;
  try {
    destinationUrl = new URL(normalizeUrl(rawUrl)).toString();
  } catch {
    redirect("/");
  }

  const code = previewShortCode(destinationUrl);
  const previewUrl = shortCodeUrl(code);

  const [user, qrSvg] = await Promise.all([
    getUser(),
    generateQRSvg(previewUrl),
  ]);

  // Build confirm URL — URLSearchParams handles encoding; don't pre-encode
  const confirmParams = new URLSearchParams({ url: destinationUrl });
  if (usecase) confirmParams.set("usecase", usecase);
  const confirmPath = `/create/confirm?${confirmParams.toString()}`;
  const ctaHref = user
    ? confirmPath
    : `/sign-up?next=${encodeURIComponent(confirmPath)}`;

  const displayUrl =
    destinationUrl.length > 55
      ? destinationUrl.slice(0, 55) + "…"
      : destinationUrl;

  const useCaseConfig = usecase ? getUseCaseConfig(usecase) : null;
  const contextLabel = useCaseConfig?.heading ?? null;

  return (
    <>
      <LandingNav isLoggedIn={!!user} />
      <main className="min-h-[calc(100vh-3.5rem)] bg-muted/30 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-primary bg-primary/10 px-3 py-1 rounded-full">
              <QrCode className="h-3 w-3" />
              {contextLabel ?? "Preview"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-2">
              Your QR code is ready
            </h1>
            <p className="text-sm text-muted-foreground">
              Save it to enable tracking and change the destination anytime.
            </p>
          </div>

          {/* Preview card */}
          <div className="rounded-2xl border bg-card shadow-sm p-8 flex flex-col items-center gap-6">
            <div
              className="w-48 h-48 shrink-0 rounded-xl overflow-hidden border bg-white"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />

            <div className="w-full space-y-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Destination
                </p>
                <p className="font-mono text-foreground break-all leading-relaxed">
                  {displayUrl}
                </p>
              </div>

              <div className="rounded-lg bg-muted px-3 py-2.5 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Short link (preview)</p>
                  <p className="font-mono text-primary font-medium mt-0.5">
                    {previewUrl}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground bg-background border rounded px-2 py-0.5 shrink-0">
                  Preview
                </div>
              </div>
            </div>

            <div className="w-full space-y-2.5">
              <Button asChild className="w-full" size="lg">
                <Link href={ctaHref}>Save &amp; Track This QR</Link>
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Tracking and analytics available after saving
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Wrong link?{" "}
            <Link
              href={usecase ? `/create?type=${type ?? "website"}&usecase=${usecase}` : "/"}
              className="underline underline-offset-4 hover:text-foreground transition-colors duration-150"
            >
              Go back and try again
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
