"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormActions } from "./website-form";

interface Props {
  onNext: (contentJson: Record<string, unknown>, destinationUrl: string) => void;
  onBack: () => void;
}

export function ImageForm({ onNext, onBack }: Props) {
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      new URL(imageUrl);
    } catch {
      setError("Enter a valid publicly accessible image URL.");
      return;
    }
    onNext({ imageUrl }, imageUrl);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          placeholder="https://example.com/photo.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          autoFocus
          required
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <p className="text-xs text-muted-foreground">
          Scanners will be taken directly to this image URL. Host it on any public CDN or server.
        </p>
      </div>
      <FormActions onBack={onBack} />
    </form>
  );
}
