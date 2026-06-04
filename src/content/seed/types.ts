/**
 * Shared shapes for the pre-launch content seed (`scripts/seed-content.ts`).
 * These mirror the CMS documents (ServicePage / Project / BlogPost / FaqEntry /
 * SiteSettings) closely enough to be written straight into MongoDB.
 */

export type SeedContentSection = {
  eyebrow?: string;
  title: string;
  body: string;
  items?: string[];
};

export type SeedFaq = { question: string; answer: string };

export type SeedImage = { src: string; alt: string; caption?: string };

export type SeedServicePage = {
  slug: string;
  navLabel: string;
  category: string;
  heroEyebrow: string;
  heroImage?: SeedImage;
  title: string;
  intro: string;
  bullets: string[];
  contentSections: SeedContentSection[];
  showImageGallery: boolean;
  galleryEyebrow?: string;
  galleryTitle?: string;
  gallerySubtitle?: string;
  galleryImages: SeedImage[];
  faq: SeedFaq[];
  seoTitle: string;
  seoDescription: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  order: number;
};

export type SeedProject = {
  slug: string;
  title: string;
  shortDescription: string;
  body: string;
  city: string;
  type: string;
  year?: string;
  surface?: string;
  lots?: string;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
};

export type SeedBlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  authorName: string;
};

export type SeedFaqEntry = {
  question: string;
  answer: string;
  category: string;
  targetPage?: string;
  keywords: string[];
};
