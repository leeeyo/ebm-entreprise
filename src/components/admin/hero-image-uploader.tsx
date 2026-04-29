"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HeroImageUploaderProps = {
  scope: "services" | "projects";
  ownerSlug: string;
  initialSrc: string;
  initialAlt: string;
  persistServiceHero?: boolean;
  persistProjectCover?: boolean;
};

type UploadResponse = {
  image?: {
    src: string;
    alt: string;
  };
  error?: string;
};

export function HeroImageUploader({
  scope,
  ownerSlug,
  initialSrc,
  initialAlt,
  persistServiceHero = false,
  persistProjectCover = false,
}: HeroImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const srcInputRef = useRef<HTMLInputElement>(null);
  const altInputRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState(initialSrc);
  const [alt, setAlt] = useState(initialAlt);
  const [uploading, setUploading] = useState(false);

  async function uploadHero(file: File) {
    const formData = new FormData();
    formData.set("scope", scope);
    formData.set("ownerSlug", ownerSlug);
    formData.set("file", file);
    formData.set("alt", alt);

    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = (await res.json()) as UploadResponse;
      if (!res.ok || !json.image) {
        throw new Error(json.error ?? "Upload impossible.");
      }
      if (srcInputRef.current) {
        srcInputRef.current.value = json.image.src;
      }
      if (altInputRef.current) {
        altInputRef.current.value = json.image.alt;
      }
      if (persistServiceHero && scope === "services") {
        const persistRes = await fetch("/api/admin/services/hero", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            slug: ownerSlug,
            heroImage: json.image,
          }),
        });
        if (!persistRes.ok) {
          throw new Error("Image uploadée, mais sauvegarde du hero impossible.");
        }
      }
      if (persistProjectCover && scope === "projects") {
        const persistRes = await fetch("/api/admin/projects/cover", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            slug: ownerSlug,
            coverImage: json.image,
          }),
        });
        if (!persistRes.ok) {
          throw new Error("Image uploadée, mais sauvegarde du header projet impossible.");
        }
      }
      setSrc(json.image.src);
      setAlt(json.image.alt);
      toast.success(
        persistServiceHero || persistProjectCover
          ? "Image hero sauvegardée."
          : "Image hero téléversée. Enregistrez la page pour publier ce changement.",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload impossible.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <input ref={srcInputRef} type="hidden" name="heroImageSrc" defaultValue={initialSrc} />
      <input ref={fileRef} type="file" accept="image/avif,image/webp,image/png,image/jpeg" className="hidden" onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) void uploadHero(file);
      }} />

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="group relative block w-full overflow-hidden rounded-3xl border bg-muted text-left transition hover:border-primary/60 hover:shadow-lg"
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={1600}
            height={900}
            unoptimized
            className="aspect-video w-full bg-black/5 object-contain"
          />
        ) : (
          <div className="grid aspect-video place-items-center text-sm text-muted-foreground">Aucune image hero</div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-linear-to-t from-black/75 via-black/35 to-transparent p-4 text-white">
          <div>
            <p className="text-sm font-medium">Cliquez pour changer l&apos;image hero</p>
            <p className="text-xs text-white/75">Recommandé : image horizontale d&apos;environ 2000 px de large, WebP ou JPG optimisé.</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-xs font-medium backdrop-blur">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImageUp className="size-4" />}
            {uploading ? "Envoi..." : "Uploader"}
          </span>
        </div>
      </button>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Alt image hero</span>
        <Input
          ref={altInputRef}
          name="heroImageAlt"
          value={alt}
          onChange={(event) => setAlt(event.target.value)}
          placeholder="Décrivez l'image pour le SEO et l'accessibilité"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImageUp className="size-4" />}
          Choisir une autre image
        </Button>
      </div>
    </div>
  );
}
