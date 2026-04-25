"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormActions } from "./website-form";

interface Props {
  onNext: (contentJson: Record<string, unknown>, destinationUrl: string) => void;
  onBack: () => void;
}

export function AppLinkForm({ onNext, onBack }: Props) {
  const [iosUrl, setIosUrl] = useState("");
  const [androidUrl, setAndroidUrl] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!iosUrl && !androidUrl) {
      setError("Enter at least one app store URL.");
      return;
    }
    if (!webUrl) {
      setError("A fallback web URL is required.");
      return;
    }
    try {
      new URL(webUrl);
    } catch {
      setError("Fallback web URL must be a valid URL.");
      return;
    }
    const contentJson: Record<string, unknown> = { webUrl };
    if (iosUrl) contentJson.iosUrl = iosUrl;
    if (androidUrl) contentJson.androidUrl = androidUrl;
    onNext(contentJson, webUrl);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="iosUrl">
          iOS App Store URL <span className="text-xs text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="iosUrl"
          type="url"
          placeholder="https://apps.apple.com/app/..."
          value={iosUrl}
          onChange={(e) => setIosUrl(e.target.value)}
          autoFocus
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="androidUrl">
          Android Play Store URL <span className="text-xs text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="androidUrl"
          type="url"
          placeholder="https://play.google.com/store/apps/..."
          value={androidUrl}
          onChange={(e) => setAndroidUrl(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="webUrl">Fallback web URL</Label>
        <Input
          id="webUrl"
          type="url"
          placeholder="https://myapp.com"
          value={webUrl}
          onChange={(e) => setWebUrl(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          Desktop users and unsupported devices land here. iOS users go to the App Store, Android to Play Store.
        </p>
      </div>
      <FormActions onBack={onBack} />
    </form>
  );
}
