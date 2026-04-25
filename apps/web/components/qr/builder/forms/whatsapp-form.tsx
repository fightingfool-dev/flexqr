"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormActions } from "./website-form";

interface Props {
  onNext: (contentJson: Record<string, unknown>, destinationUrl: string) => void;
  onBack: () => void;
}

export function WhatsAppForm({ onNext, onBack }: Props) {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 7) {
      setError("Enter a valid phone number with country code (e.g. +1 555 000 0000).");
      return;
    }
    const msg = message ? `?text=${encodeURIComponent(message)}` : "";
    const destinationUrl = `https://wa.me/${digits}${msg}`;
    onNext({ phone, message: message || undefined }, destinationUrl);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="phone">WhatsApp number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 555 000 0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoFocus
          required
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <p className="text-xs text-muted-foreground">
          Include the country code (e.g. +1 for US, +44 for UK).
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">
          Pre-filled message <span className="text-xs text-muted-foreground">(optional)</span>
        </Label>
        <textarea
          id="message"
          placeholder="Hi, I scanned your QR code..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 resize-none"
        />
      </div>
      <FormActions onBack={onBack} />
    </form>
  );
}
