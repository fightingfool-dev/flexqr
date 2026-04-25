"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormActions } from "./website-form";

interface Props {
  onNext: (contentJson: Record<string, unknown>, destinationUrl: string) => void;
  onBack: () => void;
}

export function VideoForm({ onNext, onBack }: Props) {
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      new URL(videoUrl);
    } catch {
      setError("Enter a valid video URL.");
      return;
    }
    onNext({ videoUrl }, videoUrl);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="videoUrl">Video URL</Label>
        <Input
          id="videoUrl"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          autoFocus
          required
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <p className="text-xs text-muted-foreground">
          Works with YouTube, Vimeo, or any direct video URL.
        </p>
      </div>
      <FormActions onBack={onBack} />
    </form>
  );
}
