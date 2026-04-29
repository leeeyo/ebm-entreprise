import { z } from "zod";

export type EmbeddedGalleryImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type EmbeddedGalleryPayload = {
  showImageGallery: boolean;
  galleryEyebrow?: string;
  galleryTitle?: string;
  gallerySubtitle?: string;
  galleryImages: EmbeddedGalleryImage[];
};

const MAX_GALLERY_IMAGES = 12;

export const embeddedGalleryImageSchema = z.object({
  src: z.string().trim().min(1).max(500),
  alt: z.string().trim().min(2).max(180),
  caption: z.string().trim().max(180).optional(),
});

export const embeddedGallerySchema = z.object({
  showImageGallery: z.coerce.boolean().default(true),
  galleryEyebrow: z.string().trim().max(80).optional(),
  galleryTitle: z.string().trim().max(140).optional(),
  gallerySubtitle: z.string().trim().max(240).optional(),
  galleryImages: z.array(embeddedGalleryImageSchema).max(MAX_GALLERY_IMAGES).default([]),
});

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function galleryPayloadFromFormData(formData: FormData): EmbeddedGalleryPayload {
  const images = Array.from({ length: MAX_GALLERY_IMAGES }, (_, index): EmbeddedGalleryImage | null => {
    const src = stringValue(formData, `galleryImages.${index}.src`);
    if (!src) return null;

    const image: EmbeddedGalleryImage = {
      src,
      alt: stringValue(formData, `galleryImages.${index}.alt`) || "Image EBM Ben Mokhtar.",
    };

    const caption = stringValue(formData, `galleryImages.${index}.caption`);
    if (caption) image.caption = caption;

    return image;
  }).filter((image): image is EmbeddedGalleryImage => Boolean(image));

  return embeddedGallerySchema.parse({
    showImageGallery: stringValue(formData, "showImageGallery") !== "false",
    galleryEyebrow: stringValue(formData, "galleryEyebrow") || undefined,
    galleryTitle: stringValue(formData, "galleryTitle") || undefined,
    gallerySubtitle: stringValue(formData, "gallerySubtitle") || undefined,
    galleryImages: images,
  });
}

export function normalizeGalleryPayload(value: unknown): EmbeddedGalleryPayload {
  return embeddedGallerySchema.parse(value ?? {});
}
