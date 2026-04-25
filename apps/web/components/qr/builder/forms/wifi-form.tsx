"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormActions } from "./website-form";

type Security = "WPA" | "WEP" | "nopass";

interface Props {
  onNext: (contentJson: Record<string, unknown>, destinationUrl: string) => void;
  onBack: () => void;
}

export function WifiForm({ onNext, onBack }: Props) {
  const [ssid, setSsid] = useState("");
  const [security, setSecurity] = useState<Security>("WPA");
  const [password, setPassword] = useState("");
  const [hidden, setHidden] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!ssid.trim()) {
      setError("Network name is required.");
      return;
    }
    const contentJson: Record<string, unknown> = {
      ssid: ssid.trim(),
      security,
      hidden,
    };
    if (security !== "nopass" && password) {
      contentJson.password = password;
    }
    const pwd = contentJson.password as string ?? "";
    const h = hidden ? "H:true;" : "";
    const destinationUrl = `WIFI:S:${ssid.trim()};T:${security};P:${pwd};${h};`;
    onNext(contentJson, destinationUrl);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="ssid">Network name (SSID)</Label>
        <Input
          id="ssid"
          placeholder="My Home WiFi"
          value={ssid}
          onChange={(e) => setSsid(e.target.value)}
          autoFocus
          required
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="security">Security type</Label>
        <select
          id="security"
          value={security}
          onChange={(e) => setSecurity(e.target.value as Security)}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-[border-color,box-shadow] outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None (open network)</option>
        </select>
      </div>
      {security !== "nopass" && (
        <div className="space-y-1.5">
          <Label htmlFor="password">
            Password <span className="text-xs text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Network password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}
      <div className="flex items-center gap-3">
        <Switch id="hidden" checked={hidden} onCheckedChange={setHidden} />
        <Label htmlFor="hidden" className="cursor-pointer">
          Hidden network
        </Label>
      </div>
      <p className="text-xs text-muted-foreground">
        WiFi QR codes connect directly — scan counting is not available for this type.
      </p>
      <FormActions onBack={onBack} />
    </form>
  );
}
