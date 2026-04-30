import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Phone, Mail, Globe, MapPin, Download, Building2 } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { VCardContent } from "@/lib/qr-builder-types";

type Props = { params: Promise<{ shortCode: string }> };

// 8 rich gradient pairs — picked deterministically from the contact's name
const GRADIENTS: [string, string][] = [
  ["#7c3aed", "#4338ca"],
  ["#2563eb", "#1e40af"],
  ["#0d9488", "#0f766e"],
  ["#ea580c", "#b91c1c"],
  ["#db2777", "#9d174d"],
  ["#0284c7", "#075985"],
  ["#16a34a", "#065f46"],
  ["#d97706", "#92400e"],
];

function gradientFor(name: string): [string, string] {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (Math.imul(31, h) + name.charCodeAt(i)) | 0;
  }
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

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

  const [colorA, colorB] = gradientFor(fullName || initials);

  const quickActions = [
    c.phone && { href: `tel:${c.phone}`, icon: "phone", label: "Call", bg: "#dcfce7", fg: "#16a34a" },
    c.email && { href: `mailto:${c.email}`, icon: "mail", label: "Email", bg: "#dbeafe", fg: "#2563eb" },
    c.website && { href: c.website, icon: "globe", label: "Website", bg: "#f3e8ff", fg: "#9333ea", external: true },
  ].filter(Boolean) as { href: string; icon: string; label: string; bg: string; fg: string; external?: boolean }[];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: `linear-gradient(145deg, ${colorA}, ${colorB})` }}
    >
      {/* ── Profile header ── */}
      <div className="flex flex-col items-center pt-14 pb-24 px-6 text-center text-white">
        {/* Avatar */}
        <div
          className="h-24 w-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg mb-5"
          style={{
            background: "rgba(255,255,255,0.18)",
            border: "3px solid rgba(255,255,255,0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          {initials}
        </div>

        <h1 className="text-2xl font-bold leading-tight tracking-tight">
          {fullName || "Contact"}
        </h1>

        {(c.title || c.company) && (
          <p className="mt-1.5 text-sm leading-snug" style={{ color: "rgba(255,255,255,0.75)" }}>
            {[c.title, c.company].filter(Boolean).join("  ·  ")}
          </p>
        )}
      </div>

      {/* ── White sheet slides over the gradient ── */}
      <div
        className="flex-1 rounded-t-[2rem] bg-white -mt-12 shadow-2xl flex flex-col"
        style={{ minHeight: "60vh" }}
      >
        <div className="flex-1 px-5 pt-7 pb-4 space-y-6">

          {/* Quick-action pills */}
          {quickActions.length > 0 && (
            <div className={`grid gap-3 ${quickActions.length === 1 ? "grid-cols-1" : quickActions.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
              {quickActions.map((a) => (
                <a
                  key={a.href}
                  href={a.href}
                  {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex flex-col items-center gap-1.5 rounded-2xl py-3.5 px-2 transition-opacity active:opacity-70"
                  style={{ background: a.bg }}
                >
                  <QuickIcon name={a.icon} color={a.fg} />
                  <span className="text-xs font-semibold" style={{ color: a.fg }}>
                    {a.label}
                  </span>
                </a>
              ))}
            </div>
          )}

          {/* Detail rows */}
          <div className="rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden bg-slate-50/60">
            {c.phone && (
              <DetailRow
                href={`tel:${c.phone}`}
                label="Phone"
                value={c.phone}
                bg="#dcfce7"
                fg="#16a34a"
                icon="phone"
              />
            )}
            {c.email && (
              <DetailRow
                href={`mailto:${c.email}`}
                label="Email"
                value={c.email}
                bg="#dbeafe"
                fg="#2563eb"
                icon="mail"
              />
            )}
            {c.website && (
              <DetailRow
                href={c.website}
                label="Website"
                value={c.website.replace(/^https?:\/\/(www\.)?/, "")}
                bg="#f3e8ff"
                fg="#9333ea"
                icon="globe"
                external
              />
            )}
            {c.company && (
              <DetailRow
                label="Company"
                value={c.company}
                bg="#fef9c3"
                fg="#ca8a04"
                icon="building"
              />
            )}
            {c.address && (
              <DetailRow
                label="Address"
                value={c.address}
                bg="#fee2e2"
                fg="#dc2626"
                icon="map"
              />
            )}
          </div>
        </div>

        {/* Save Contact CTA */}
        <div className="px-5 pt-2 pb-6">
          <a
            href={`/api/vcard/${shortCode}`}
            download
            className="flex items-center justify-center gap-2.5 w-full rounded-2xl py-4 text-sm font-bold text-white shadow-md transition-opacity active:opacity-80"
            style={{ background: `linear-gradient(135deg, ${colorA}, ${colorB})` }}
          >
            <Download className="h-4 w-4" />
            Save to Contacts
          </a>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 py-4 text-center">
          <a
            href="https://www.analogqr.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-violet-600 text-[9px] font-black text-white leading-none">QR</span>
            Create your own free QR card at AnalogQR
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Icon helper ── */
function QuickIcon({ name, color }: { name: string; color: string }) {
  const cls = "h-5 w-5";
  if (name === "phone") return <Phone className={cls} style={{ color }} />;
  if (name === "mail") return <Mail className={cls} style={{ color }} />;
  if (name === "globe") return <Globe className={cls} style={{ color }} />;
  if (name === "building") return <Building2 className={cls} style={{ color }} />;
  return <MapPin className={cls} style={{ color }} />;
}

/* ── Detail row ── */
function DetailRow({
  href,
  label,
  value,
  bg,
  fg,
  icon,
  external,
}: {
  href?: string;
  label: string;
  value: string;
  bg: string;
  fg: string;
  icon: string;
  external?: boolean;
}) {
  const inner = (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div
        className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: bg }}
      >
        <QuickIcon name={icon} color={fg} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );

  if (!href) return <div>{inner}</div>;
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="block hover:bg-slate-50 transition-colors active:bg-slate-100"
    >
      {inner}
    </a>
  );
}
