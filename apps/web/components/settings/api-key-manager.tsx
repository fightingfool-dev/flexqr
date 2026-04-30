"use client";

import { useActionState, useState, useEffect } from "react";
import { Copy, Check, Key, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createApiKey, revokeApiKey } from "@/actions/api-keys";

type ApiKeyRow = {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt: string | null;
};

type State = { error?: string; newKey?: string };
const initial: State = {};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
      title="Copy"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function NewKeyBanner({ apiKey }: { apiKey: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 space-y-2">
      <p className="text-sm font-semibold text-emerald-800">API key created — copy it now</p>
      <p className="text-xs text-emerald-700">This key is only shown once. Store it somewhere safe.</p>
      <div className="flex items-center gap-2 bg-white rounded-md border border-emerald-200 px-3 py-2">
        <code className="flex-1 text-xs font-mono text-emerald-900 truncate">
          {visible ? apiKey : apiKey.slice(0, 12) + "•".repeat(20)}
        </code>
        <button type="button" onClick={() => setVisible((v) => !v)} className="text-emerald-600 hover:text-emerald-800 shrink-0">
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <CopyButton text={apiKey} />
      </div>
    </div>
  );
}

export function ApiKeyManager({ existingKeys }: { existingKeys: ApiKeyRow[] }) {
  const [state, action, pending] = useActionState<State, FormData>(createApiKey, initial);
  const [newKey, setNewKey] = useState<string | null>(null);

  useEffect(() => {
    if (state.newKey) setNewKey(state.newKey);
  }, [state.newKey]);

  return (
    <div className="space-y-4">
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {newKey && <NewKeyBanner apiKey={newKey} />}

      {/* Existing keys */}
      {existingKeys.length > 0 && (
        <div className="divide-y rounded-xl border overflow-hidden">
          {existingKeys.map((k) => (
            <div key={k.id} className="flex items-center gap-3 px-4 py-3">
              <Key className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{k.name}</p>
                <p className="text-xs text-muted-foreground">
                  <code>{k.keyPrefix}…</code>
                  {k.lastUsedAt && ` · Last used ${new Date(k.lastUsedAt).toLocaleDateString()}`}
                </p>
              </div>
              <form action={revokeApiKey.bind(null, k.id)}>
                <button
                  type="submit"
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  title="Revoke key"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      {/* Create new key */}
      <form action={action} className="flex gap-2">
        <Input
          name="name"
          placeholder="Key name (e.g. My App)"
          required
          className="flex-1"
        />
        <Button type="submit" disabled={pending} size="sm" variant="outline" className="gap-1.5 shrink-0">
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Key className="h-3.5 w-3.5" />}
          Generate
        </Button>
      </form>

      <p className="text-xs text-muted-foreground">
        Include your key as: <code className="bg-muted px-1 rounded">Authorization: Bearer aqr_…</code>
        <br />
        API endpoint: <code className="bg-muted px-1 rounded">GET/POST {typeof window !== "undefined" ? window.location.origin : ""}/api/v1/qr</code>
      </p>
    </div>
  );
}
