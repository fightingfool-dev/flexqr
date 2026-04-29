import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Phone, MapPin } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { MenuContent } from "@/lib/qr-builder-types";

type Props = { params: Promise<{ shortCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shortCode } = await params;
  const { data } = await supabaseAdmin
    .from("qr_codes")
    .select("contentJson")
    .eq("shortCode", shortCode)
    .eq("type", "MENU")
    .eq("isActive", true)
    .maybeSingle();

  if (!data) return { title: "Menu" };
  const c = data.contentJson as MenuContent;
  return {
    title: c.restaurantName ?? "Menu",
    description: c.tagline || undefined,
  };
}

export default async function MenuPage({ params }: Props) {
  const { shortCode } = await params;

  const { data } = await supabaseAdmin
    .from("qr_codes")
    .select("contentJson, isActive")
    .eq("shortCode", shortCode)
    .eq("type", "MENU")
    .maybeSingle();

  if (!data || !data.isActive) notFound();

  const menu = data.contentJson as MenuContent;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-stone-900 leading-tight">
            {menu.restaurantName}
          </h1>
          {menu.tagline && (
            <p className="text-sm text-stone-500 mt-0.5">{menu.tagline}</p>
          )}
          {(menu.phone || menu.address) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              {menu.phone && (
                <a
                  href={`tel:${menu.phone}`}
                  className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 transition-colors"
                >
                  <Phone className="h-3 w-3" />
                  {menu.phone}
                </a>
              )}
              {menu.address && (
                <span className="flex items-center gap-1 text-xs text-stone-500">
                  <MapPin className="h-3 w-3" />
                  {menu.address}
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Menu sections */}
      <main className="max-w-lg mx-auto px-4 py-4 space-y-6 pb-12">
        {menu.sections.map((section, si) => (
          <section key={si}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3 px-1">
              {section.name}
            </h2>
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm divide-y divide-stone-100">
              {section.items.map((item, ii) => (
                <div key={ii} className="px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-stone-900 leading-snug flex-1">
                      {item.name}
                    </p>
                    {item.price && (
                      <span className="text-sm font-bold text-stone-800 shrink-0 tabular-nums">
                        {item.price}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="mt-0.5 text-xs text-stone-500 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Branding */}
      <footer className="border-t border-stone-200 py-4 text-center bg-white">
        <p className="text-[10px] text-stone-400">
          Menu powered by{" "}
          <a
            href="https://www.analogqr.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            AnalogQR
          </a>
        </p>
      </footer>
    </div>
  );
}
