"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, ArrowLeft, Loader2, Check, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Row = { name: string; url: string; valid: boolean };

async function bulkCreate(rows: Row[]): Promise<{ created: number; errors: string[] }> {
  const res = await fetch("/api/qr/bulk-import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rows: rows.filter((r) => r.valid) }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    return { created: 0, errors: [json.error ?? "Import failed"] };
  }
  return res.json();
}

function parseCsv(text: string): Row[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];

  // Detect header row
  const first = lines[0].toLowerCase();
  const hasHeader = first.includes("name") || first.includes("url");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines
    .map((line) => {
      const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      const name = cols[0] ?? "";
      const rawUrl = cols[1] ?? "";
      let url = rawUrl;
      if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`;
      let valid = false;
      try {
        new URL(url);
        valid = !!name.trim();
      } catch {
        valid = false;
      }
      return { name: name.trim(), url: url.trim(), valid };
    })
    .filter((r) => r.name || r.url);
}

export default function ImportPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ created: number; errors: string[] } | null>(null);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setRows(parseCsv(text));
      setResult(null);
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (rows.length === 0) return;
    setImporting(true);
    const res = await bulkCreate(rows);
    setResult(res);
    setImporting(false);
    if (res.errors.length === 0) {
      setTimeout(() => router.push("/dashboard/qr-codes"), 1500);
    }
  }

  const validCount = rows.filter((r) => r.valid).length;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href="/dashboard/qr-codes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bulk import QR codes</h1>
          <p className="text-sm text-muted-foreground">Upload a CSV with Name and URL columns to create multiple QR codes at once.</p>
        </div>
      </div>

      {/* Format guide */}
      <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
        <p className="text-sm font-medium">CSV format</p>
        <pre className="text-xs text-muted-foreground bg-muted rounded-md p-3 overflow-x-auto">
{`Name,URL
My Homepage,https://example.com
Product Page,https://example.com/product
Booking Link,https://cal.com/myname`}
        </pre>
        <p className="text-xs text-muted-foreground">
          Column 1: QR code name · Column 2: destination URL. Header row is optional.
        </p>
      </div>

      {/* Upload zone */}
      <div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 w-full h-32 rounded-xl border-2 border-dashed border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40 transition-colors text-muted-foreground"
        >
          <Upload className="h-6 w-6" />
          <span className="text-sm font-medium">
            {rows.length > 0 ? `${rows.length} rows loaded. Click to replace.` : "Click to upload CSV file"}
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </div>

      {/* Preview */}
      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Preview{" "}
              <span className="text-muted-foreground">
                ({validCount} valid · {rows.length - validCount} invalid)
              </span>
            </p>
            {rows.length > 10 && (
              <span className="text-xs text-muted-foreground">Showing first 10 of {rows.length}</span>
            )}
          </div>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b">
                  <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground w-8" />
                  <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground">URL</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.slice(0, 10).map((row, i) => (
                  <tr key={i} className={row.valid ? "" : "bg-destructive/5"}>
                    <td className="px-4 py-2.5">
                      {row.valid ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-destructive" />
                      )}
                    </td>
                    <td className="px-4 py-2.5 max-w-[160px] truncate">{row.name || <span className="text-muted-foreground italic">empty</span>}</td>
                    <td className="px-4 py-2.5 max-w-[200px] truncate text-muted-foreground">{row.url || <span className="italic">empty</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {result ? (
            <div className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
              result.errors.length === 0
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-destructive/20 bg-destructive/5 text-destructive"
            }`}>
              {result.errors.length === 0 ? (
                <>
                  <Check className="h-4 w-4 shrink-0" />
                  {result.created} QR code{result.created !== 1 ? "s" : ""} created! Redirecting…
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {result.errors[0]}
                </>
              )}
            </div>
          ) : (
            <Button
              onClick={handleImport}
              disabled={importing || validCount === 0}
              className="gap-2"
            >
              {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {importing ? "Importing…" : `Import ${validCount} QR code${validCount !== 1 ? "s" : ""}`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
