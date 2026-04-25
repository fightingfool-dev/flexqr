"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Copy, Check, Pencil, Trash2, ExternalLink, BarChart2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toggleQRCode, deleteQRCode } from "@/actions/qr-codes";
import type { DbQRCode } from "@/lib/database.types";
import { cn } from "@/lib/utils";

type Props = {
  qrCode: DbQRCode;
  shortUrl: string;
};

export function QRCodeCard({ qrCode, shortUrl }: Props) {
  const [toggling, startToggle] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [copied, setCopied] = useState(false);

  function copyUrl() {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDelete() {
    if (!confirm(`Delete "${qrCode.name}"? This cannot be undone.`)) return;
    startDelete(() => deleteQRCode(qrCode.id, new FormData()));
  }

  return (
    <div className="flex items-start gap-4 rounded-xl border bg-card p-5 shadow-sm transition-shadow duration-200">
      {/* Status toggle */}
      <div className="pt-0.5">
        <Switch
          checked={qrCode.isActive}
          disabled={toggling || deleting}
          onCheckedChange={() =>
            startToggle(() => toggleQRCode(qrCode.id, qrCode.isActive))
          }
          aria-label={qrCode.isActive ? "Deactivate" : "Activate"}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/qr-codes/${qrCode.id}`}
            className="font-medium truncate hover:text-primary transition-colors"
          >
            {qrCode.name}
          </Link>
          <Badge
            variant={qrCode.isActive ? "default" : "secondary"}
            className="shrink-0"
          >
            {qrCode.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Short URL row */}
        <div className="flex items-center gap-1.5">
          <code className="text-sm text-muted-foreground truncate">
            {shortUrl}
          </code>
          <button
            onClick={copyUrl}
            title={copied ? "Copied!" : "Copy URL"}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Destination */}
        <a
          href={qrCode.destinationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-1 text-xs text-muted-foreground",
            "hover:text-foreground transition-colors truncate max-w-full"
          )}
        >
          <ExternalLink className="h-3 w-3 shrink-0" />
          <span className="truncate">{qrCode.destinationUrl}</span>
        </a>

        <p className="text-xs text-muted-foreground">
          {qrCode.scanCount} scan{qrCode.scanCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/qr-codes/${qrCode.id}/analytics`} title="Analytics">
            <BarChart2 className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/qr-codes/${qrCode.id}`} title="Edit">
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="Delete"
          disabled={deleting}
          className="text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
