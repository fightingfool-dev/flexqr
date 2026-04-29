import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Phone, Mail, Globe, MapPin, Download, Building2, IdCard } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { VCardContent } from "@/lib/qr-builder-types";

type Props = { params: Promise<{ shortCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shortCode } = await params;
  const { data } = await supabaseAdmin
    .from("qr_codes")
    .select("contentJson")
    .eq("shortCode", shortCode)
    .eq("type", "VCARD")
    .eq("isActive", true)
    .maybeSingle();

  if (!data) return { title: "Contact Card" };
  const c = data.contentJson as VCardContent;
  const name = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim();
  return {
    title: name || "Contact Card",
    description: [c.title, c.company].filter(Boolean).join(" at ") || undefined,
  };
}

export default async function CardPage({ params }: Props) {
  const { shortCode } = await params;

  const { data } = await supabaseAdmin
    .from("qr_codes")
    .select("contentJson, isActive")
    .eq("shortCode", shortCode)
    .eq("type", "VCARD")
    .maybeSingle();

  if (!data || !data.isActive) notFound();

  const c = data.contentJson as VCardContent;
  const fullName = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim();
  const initials =
    `${c.firstName?.[0] ?? ""}${c.lastName?.[0] ?? ""}`.toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-900 px-6 pt-10 pb-14 text-white text-center relative">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white text-slate-800 text-2xl font-bold shadow-md">
            {initials}
          </div>
          <h1 className="mt-4 text-2xl font-bold leading-tight">{fullName || "Contact"}</h1>
          {(c.title || c.company) && (
            <p className="mt-1 text-sm text-slate-300 leading-snug">
              {[c.title, c.company].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        {/* Body */}
        <div className="-mt-6 mx-4 bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-100">
          {c.phone && (
            <a
              href={`tel:${c.phone}`}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 shrink-0">
                <Phone className="h-4 w-4 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  Phone
                </p>
                <p className="text-sm font-medium truncate">{c.phone}</p>
              </div>
            </a>
          )}

          {c.email && (
            <a
              href={`mailto:${c.email}`}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 shrink-0">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  Email
                </p>
                <p className="text-sm font-medium truncate">{c.email}</p>
              </div>
            </a>
          )}

          {c.website && (
            <a
              href={c.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 shrink-0">
                <Globe className="h-4 w-4 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  Website
                </p>
                <p className="text-sm font-medium truncate">
                  {c.website.replace(/^https?:\/\/(www\.)?/, "")}
                </p>
              </div>
            </a>
          )}

          {c.company && !c.title && (
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 shrink-0">
                <Building2 className="h-4 w-4 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  Company
                </p>
                <p className="text-sm font-medium">{c.company}</p>
              </div>
            </div>
          )}

          {c.address && (
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 shrink-0">
                <MapPin className="h-4 w-4 text-red-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  Address
                </p>
                <p className="text-sm font-medium">{c.address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Save Contact */}
        <div className="px-4 pt-4 pb-6">
          <a
            href={`/api/vcard/${shortCode}`}
            download
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 text-white py-3.5 text-sm font-semibold hover:bg-slate-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Save Contact
          </a>
        </div>

        {/* Branding */}
        <div className="border-t border-slate-100 py-3 text-center">
          <p className="text-[10px] text-muted-foreground">
            Created with{" "}
            <a
              href="https://www.analogqr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              AnalogQR
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
