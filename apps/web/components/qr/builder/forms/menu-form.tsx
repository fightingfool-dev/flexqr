"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, ImagePlus, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormActions } from "./website-form";
import Image from "next/image";

/* ── Types ── */
type ItemRow = {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
};
type SectionRow = { id: string; name: string; items: ItemRow[] };

function uid() {
  return Math.random().toString(36).slice(2);
}
function newItem(): ItemRow {
  return { id: uid(), name: "", price: "", description: "", imageUrl: "" };
}
function newSection(): SectionRow {
  return { id: uid(), name: "", items: [newItem()] };
}

/* ── Image upload helper ── */
async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Upload failed");
  return json.url as string;
}

/* ── Cover image upload zone ── */
function CoverImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(file: File) {
    setErr("");
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (value) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-border h-32">
        <Image src={value} alt="Cover" fill className="object-cover" unoptimized />
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          aria-label="Remove cover image"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:bg-muted/50 transition-colors"
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ImagePlus className="h-5 w-5" />
        )}
        <span className="text-xs font-medium">
          {uploading ? "Uploading…" : "Add cover photo (optional)"}
        </span>
      </button>
      {err && <p className="mt-1 text-xs text-destructive">{err}</p>}
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ── Per-item thumbnail upload ── */
function ItemImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch {
      // silently ignore — photo is optional
    } finally {
      setUploading(false);
    }
  }

  if (value) {
    return (
      <div className="relative h-9 w-9 rounded-lg overflow-hidden border border-border shrink-0">
        <Image src={value} alt="" fill className="object-cover" unoptimized />
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          aria-label="Remove image"
        >
          <X className="h-3 w-3 text-white" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => ref.current?.click()}
      disabled={uploading}
      className="h-9 w-9 rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors shrink-0"
      aria-label="Add item image"
      title="Add photo"
    >
      {uploading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <ImagePlus className="h-3.5 w-3.5" />
      )}
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </button>
  );
}

/* ── Main form ── */
interface Props {
  onNext: (contentJson: Record<string, unknown>, destinationUrl: string) => void;
  onBack: () => void;
}

export function MenuForm({ onNext, onBack }: Props) {
  const [restaurantName, setRestaurantName] = useState("");
  const [tagline, setTagline] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [sections, setSections] = useState<SectionRow[]>([newSection()]);
  const [error, setError] = useState("");

  function addSection() {
    setSections((s) => [...s, newSection()]);
  }
  function removeSection(sid: string) {
    setSections((s) => s.filter((x) => x.id !== sid));
  }
  function updateSectionName(sid: string, name: string) {
    setSections((ss) => ss.map((s) => (s.id === sid ? { ...s, name } : s)));
  }
  function addItem(sid: string) {
    setSections((ss) =>
      ss.map((s) => (s.id === sid ? { ...s, items: [...s.items, newItem()] } : s))
    );
  }
  function removeItem(sid: string, iid: string) {
    setSections((ss) =>
      ss.map((s) =>
        s.id === sid ? { ...s, items: s.items.filter((i) => i.id !== iid) } : s
      )
    );
  }
  function updateItem(
    sid: string,
    iid: string,
    field: keyof Omit<ItemRow, "id">,
    value: string
  ) {
    setSections((ss) =>
      ss.map((s) =>
        s.id === sid
          ? {
              ...s,
              items: s.items.map((i) => (i.id === iid ? { ...i, [field]: value } : i)),
            }
          : s
      )
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!restaurantName.trim()) {
      setError("Restaurant or business name is required.");
      return;
    }
    const filledSections = sections
      .map((s) => ({
        name: s.name.trim() || "Menu",
        items: s.items
          .filter((i) => i.name.trim())
          .map((i) => ({
            name: i.name.trim(),
            ...(i.price.trim() && { price: i.price.trim() }),
            ...(i.description.trim() && { description: i.description.trim() }),
            ...(i.imageUrl && { imageUrl: i.imageUrl }),
          })),
      }))
      .filter((s) => s.items.length > 0);

    if (filledSections.length === 0) {
      setError("Add at least one menu item.");
      return;
    }
    const contentJson: Record<string, unknown> = {
      restaurantName: restaurantName.trim(),
      sections: filledSections,
    };
    if (tagline.trim()) contentJson.tagline = tagline.trim();
    if (phone.trim()) contentJson.phone = phone.trim();
    if (address.trim()) contentJson.address = address.trim();
    if (coverImageUrl) contentJson.coverImageUrl = coverImageUrl;

    onNext(contentJson, "menu://pending");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Cover image */}
      <CoverImageUpload value={coverImageUrl} onChange={setCoverImageUrl} />

      <div className="space-y-1.5">
        <Label htmlFor="restaurantName">Business name</Label>
        <Input
          id="restaurantName"
          placeholder="The Corner Bistro"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          autoFocus
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tagline">
          Tagline{" "}
          <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="tagline"
          placeholder="Fresh food, great vibes"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="menuPhone">
            Phone{" "}
            <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="menuPhone"
            type="tel"
            placeholder="+1 555 000 0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="menuAddress">
            Address{" "}
            <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="menuAddress"
            placeholder="123 Main St"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Menu sections</p>
          <Button type="button" size="sm" variant="outline" onClick={addSection}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add section
          </Button>
        </div>

        {sections.map((section, si) => (
          <div key={section.id} className="rounded-xl border bg-muted/30 p-3 space-y-2.5">
            <div className="flex items-center gap-2">
              <Input
                placeholder={`Section ${si + 1} (e.g. Starters, Mains, Drinks)`}
                value={section.name}
                onChange={(e) => updateSectionName(section.id, e.target.value)}
                className="h-8 text-sm flex-1"
              />
              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSection(section.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  aria-label="Remove section"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-border ml-1">
              {section.items.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    {/* Item image thumbnail */}
                    <ItemImageUpload
                      value={item.imageUrl}
                      onChange={(url) => updateItem(section.id, item.id, "imageUrl", url)}
                    />
                    <Input
                      placeholder="Item name (e.g. Caesar Salad)"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(section.id, item.id, "name", e.target.value)
                      }
                      className="h-7 text-xs flex-1"
                    />
                    <Input
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(section.id, item.id, "price", e.target.value)
                      }
                      className="h-7 text-xs w-20 shrink-0"
                    />
                    {section.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(section.id, item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <Input
                    placeholder="Description (optional)"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(section.id, item.id, "description", e.target.value)
                    }
                    className="h-7 text-xs text-muted-foreground"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => addItem(section.id)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors pt-0.5"
              >
                <Plus className="h-3 w-3" />
                Add item
              </button>
            </div>
          </div>
        ))}
      </div>

      <FormActions onBack={onBack} />
    </form>
  );
}
