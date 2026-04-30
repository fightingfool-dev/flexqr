import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Phone, MapPin } from "lucide-react";
import Image from "next/image";
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
    openGraph: c.coverImageUrl
      ? { images: [{ url: c.coverImageUrl, width: 1200, height: 630 }] }
      : undefined,
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
      {/* Cover image */}
      {menu.coverImageUrl && (
        <div className="relative w-full h-48 sm:h-60 overflow-hidden">
          <Image
            src={menu.coverImageUrl}
            alt={menu.restaurantName}
            fill
            className="object-cover"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-900/60" />
        </div>
      )}

      {/* Header */}
      <header
        className={`bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm ${menu.coverImageUrl ? "" : ""}`}
      >
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
      <main className="max-w-lg mx-auto px-4 py-5 space-y-7 pb-14">
        {menu.sections.map((section, si) => (
          <section key={si}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3 px-1">
              {section.name}
            </h2>
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm divide-y divide-stone-100">
              {section.items.map((item, ii) => (
                <div key={ii} className="flex items-start gap-3 px-4 py-4">
                  {/* Item image */}
                  {item.imageUrl && (
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-stone-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-stone-900 leading-snug">
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
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-4 text-center bg-white">
        <a
          href="https://www.analogqr.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-700 transition-colors"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-violet-600 text-[9px] font-black text-white leading-none">QR</span>
          Create your own digital menu at AnalogQR
        </a>
      </footer>
    </div>
  );
}
