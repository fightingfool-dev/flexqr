"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormActions } from "./website-form";

interface Props {
  onNext: (contentJson: Record<string, unknown>, destinationUrl: string) => void;
  onBack: () => void;
}

export function PdfForm({ onNext, onBack }: Props) {
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      new URL(fileUrl);
    } catch {
      setError("Enter a valid publicly accessible PDF URL.");
      return;
    }
    onNext({ fileUrl }, fileUrl);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="fileUrl">PDF URL</Label>
        <Input
          id="fileUrl"
          type="url"
          placeholder="https://example.com/document.pdf"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          autoFocus
          required
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <p className="text-xs text-muted-foreground">
          The PDF must be publicly accessible. Host it on Google Drive, Dropbox, or your own server.
        </p>
      </div>
      <FormActions onBack={onBack} />
    </form>
  );
}
