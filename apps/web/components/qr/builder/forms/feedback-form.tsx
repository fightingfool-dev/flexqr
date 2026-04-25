"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormActions } from "./website-form";

const PLATFORMS = [
  { value: "", label: "Custom URL" },
  { value: "google", label: "Google Reviews" },
  { value: "trustpilot", label: "Trustpilot" },
  { value: "yelp", label: "Yelp" },
  { value: "tripadvisor", label: "TripAdvisor" },
  { value: "other", label: "Other" },
];

interface Props {
  onNext: (contentJson: Record<string, unknown>, destinationUrl: string) => void;
  onBack: () => void;
}

export function FeedbackForm({ onNext, onBack }: Props) {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      new URL(url);
    } catch {
      setError("Enter a valid URL for your feedback or review page.");
      return;
    }
    onNext({ url, platform: platform || undefined }, url);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="platform">
          Platform <span className="text-xs text-muted-foreground">(optional)</span>
        </Label>
        <select
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-[border-color,box-shadow] outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="feedbackUrl">Feedback / review URL</Label>
        <Input
          id="feedbackUrl"
          type="url"
          placeholder="https://g.page/r/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          autoFocus
          required
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <p className="text-xs text-muted-foreground">
          Paste the direct link to your review page. Scanners will be taken there immediately.
        </p>
      </div>
      <FormActions onBack={onBack} />
    </form>
  );
}
