"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/track";
import { normalizeUrl } from "@/lib/url";

export function TryItInput() {
  const router = useRouter();
  const [url, setUrl] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    track("cta_click", { label: "Generate QR Code", location: "hero_try_it" });
    router.push(`/create?url=${encodeURIComponent(normalizeUrl(trimmed))}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md mx-auto gap-2"
    >
      <Input
        type="text"
        placeholder="your-website.com or paste your link"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1"
        required
      />
      <Button type="submit">Generate QR Code</Button>
    </form>
  );
}
