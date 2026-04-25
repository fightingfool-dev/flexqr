"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface Props {
  onNext: (contentJson: Record<string, unknown>, destinationUrl: string) => void;
  onBack: () => void;
}

export function WebsiteForm({ onNext, onBack }: Props) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      new URL(url);
    } catch {
      setError("Enter a valid URL (e.g. https://example.com)");
      return;
    }
    onNext({ url }, url);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="url">Website URL</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          autoFocus
          required
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <p className="text-xs text-muted-foreground">
          The URL scanners will be redirected to. You can change it later without reprinting.
        </p>
      </div>
      <FormActions onBack={onBack} />
    </form>
  );
}

export function FormActions({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center justify-between pt-1">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>
      <Button type="submit">Next: Design</Button>
    </div>
  );
}
