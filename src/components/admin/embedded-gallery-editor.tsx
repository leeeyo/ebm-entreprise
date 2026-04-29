"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { ArrowDown, ArrowUp, EyeOff, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { EmbeddedGalleryImage } from "@/lib/embedded-gallery";

type EmbeddedGalleryEditorProps = {
  scope: "services" | "projects";
  ownerSlug: string;
  initialImages: EmbeddedGalleryImage[];
  defaultVisible: boolean;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

type UploadResponse = {
  image?: EmbeddedGalleryImage;
  error?: string;
};

export function EmbeddedGalleryEditor({
  scope,
  ownerSlug,
  initialImages,
  defaultVisible,
  eyebrow,
  title,
  subtitle,
}: EmbeddedGalleryEditorProps) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState(initialImages);
  const [visible, setVisible] = useState(defaultVisible);
  const [uploading, setUploading] = useState(false);
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");

  async function uploadImage() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      toast.error("Choisissez une image.");
      return;
    }

    const formData = new FormData();
    formData.set("scope", scope);
    formData.set("ownerSlug", ownerSlug);
    formData.set("file", file);
    formData.set("alt", uploadAlt);
    formData.set("caption", uploadCaption);

    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = (await res.json()) as UploadResponse;
      if (!res.ok || !json.image) {
        throw new Error(json.error ?? "Upload impossible.");
      }
      setImages((current) => [...current, json.image!].slice(0, 12));
      setUploadAlt("");
      setUploadCaption("");
      if (fileRef.current) fileRef.current.value = "";
      toast.success("Image ajoutée à la galerie.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload impossible.");
    } finally {
      setUploading(false);
    }
  }

  function updateImage(index: number, patch: Partial<EmbeddedGalleryImage>) {
    setImages((current) => current.map((image, idx) => (idx === index ? { ...image, ...patch } : image)));
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="showImageGallery" value={String(visible)} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-heading text-xl font-semibold">Aperçu en images</p>
          <p className="mt-1 text-sm text-muted-foreground">Upload local dans <code>uploads/{scope}/{ownerSlug}</code>.</p>
        </div>
        <Button type="button" variant={visible ? "outline" : "secondary"} onClick={() => setVisible((current) => !current)}>
          <EyeOff className="size-4" />
          {visible ? "Masquer la section" : "Afficher la section"}
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="block space-y-2">
          <span className="text-sm font-medium">Eyebrow</span>
          <Input name="galleryEyebrow" defaultValue={eyebrow ?? "Aperçu"} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Titre</span>
          <Input name="galleryTitle" defaultValue={title ?? "En images"} />
        </label>
        <label className="block space-y-2 md:col-span-3">
          <span className="text-sm font-medium">Sous-titre</span>
          <Textarea name="gallerySubtitle" rows={2} defaultValue={subtitle ?? ""} />
        </label>
      </div>

      <div className="rounded-2xl border border-dashed bg-muted/20 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <Input ref={fileRef} id={`${id}-file`} type="file" accept="image/avif,image/webp,image/png,image/jpeg" />
          <Input value={uploadAlt} onChange={(event) => setUploadAlt(event.target.value)} placeholder="Alt SEO de l'image" />
          <Button type="button" onClick={() => void uploadImage()} disabled={uploading}>
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
            Ajouter
          </Button>
        </div>
        <Input className="mt-3" value={uploadCaption} onChange={(event) => setUploadCaption(event.target.value)} placeholder="Caption optionnelle" />
      </div>

      <div className="grid gap-4">
        {images.map((image, index) => (
          <div key={`${image.src}-${index}`} className="rounded-2xl border bg-white p-4">
            <input type="hidden" name={`galleryImages.${index}.src`} value={image.src} />
            <div className="grid gap-4 md:grid-cols-[160px_1fr]">
              <div className="relative overflow-hidden rounded-xl border bg-muted">
                <Image src={image.src} alt={image.alt} width={320} height={240} unoptimized className="aspect-4/3 w-full object-cover" />
                <Badge className="absolute left-2 top-2 bg-black/70 text-white">#{index + 1}</Badge>
              </div>
              <div className="space-y-3">
                <Input
                  name={`galleryImages.${index}.alt`}
                  value={image.alt}
                  onChange={(event) => updateImage(index, { alt: event.target.value })}
                  placeholder="Alt SEO"
                />
                <Input
                  name={`galleryImages.${index}.caption`}
                  value={image.caption ?? ""}
                  onChange={(event) => updateImage(index, { caption: event.target.value })}
                  placeholder="Caption"
                />
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => moveImage(index, -1)} disabled={index === 0}>
                    <ArrowUp className="size-4" />
                    Monter
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1}>
                    <ArrowDown className="size-4" />
                    Descendre
                  </Button>
                  <Button type="button" variant="destructive" size="sm" onClick={() => setImages((current) => current.filter((_, idx) => idx !== index))}>
                    <Trash2 className="size-4" />
                    Retirer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {images.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-6 text-center text-sm text-muted-foreground">
            Aucune image intégrée. Ajoutez au moins une image ou masquez la section.
          </div>
        ) : null}
      </div>
    </div>
  );
}
