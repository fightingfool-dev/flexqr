"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormActions } from "./website-form";
import { normalizeUrl } from "@/lib/url";

interface Props {
  onNext: (contentJson: Record<string, unknown>, destinationUrl: string) => void;
  onBack: () => void;
}

export function VCardForm({ onNext, onBack }: Props) {
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    website: "",
    address: "",
  });
  const [error, setError] = useState("");

  function set(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!fields.firstName.trim() && !fields.lastName.trim()) {
      setError("Enter at least a first or last name.");
      return;
    }
    const contentJson: Record<string, unknown> = {
      firstName: fields.firstName.trim(),
      lastName: fields.lastName.trim(),
    };
    if (fields.email) contentJson.email = fields.email.trim();
    if (fields.phone) contentJson.phone = fields.phone.trim();
    if (fields.company) contentJson.company = fields.company.trim();
    if (fields.title) contentJson.title = fields.title.trim();
    if (fields.website) contentJson.website = normalizeUrl(fields.website.trim());
    if (fields.address) contentJson.address = fields.address.trim();

    // destinationUrl is a placeholder — server action computes the real /api/vcard/{shortCode}
    onNext(contentJson, "vcard://pending");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            placeholder="Jane"
            value={fields.firstName}
            onChange={set("firstName")}
            autoFocus
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            value={fields.lastName}
            onChange={set("lastName")}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">
          Email <span className="text-xs text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="jane@example.com"
          value={fields.email}
          onChange={set("email")}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">
          Phone <span className="text-xs text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 555 000 0000"
          value={fields.phone}
          onChange={set("phone")}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="company">
            Company <span className="text-xs text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="company"
            placeholder="Acme Corp"
            value={fields.company}
            onChange={set("company")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="jobTitle">
            Job title <span className="text-xs text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="jobTitle"
            placeholder="Designer"
            value={fields.title}
            onChange={set("title")}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="website">
          Website <span className="text-xs text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="website"
          type="text"
          placeholder="janedoe.com or https://janedoe.com"
          value={fields.website}
          onChange={set("website")}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="address">
          Address <span className="text-xs text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="address"
          placeholder="123 Main St, New York, NY"
          value={fields.address}
          onChange={set("address")}
        />
      </div>
      <FormActions onBack={onBack} />
    </form>
  );
}
