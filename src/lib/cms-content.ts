import { unstable_noStore as noStore } from "next/cache";
import { connectDB } from "@/lib/db";
import { contactContent } from "@/content/contact";
import { genericServicePages } from "@/content/service-pages";
import type { EmbeddedGalleryImage } from "@/lib/embedded-gallery";
import { getDefaultServicePage } from "@/lib/service-page-editor";
import { projets as staticProjects } from "@/content/projets";
import { getResidenceCover } from "@/content/residence-covers";
import { BlogPost } from "@/models/BlogPost";
import { ContactSubmission } from "@/models/ContactSubmission";
import { FaqEntry } from "@/models/FaqEntry";
import { Project } from "@/models/Project";
import { ServicePage } from "@/models/ServicePage";
import { SiteSettings } from "@/models/SiteSettings";

export type ContentStatus = "draft" | "published";

export type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImage?: { src?: string; alt?: string };
  seoTitle?: string;
  seoDescription?: string;
  status: ContentStatus;
  publishedAt?: string;
  authorName: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ServicePageRecord = {
  id: string;
  slug: string;
  navLabel: string;
  category?: string;
  heroEyebrow: string;
  heroImage?: { src?: string; alt?: string };
  title: string;
  intro: string;
  bullets: string[];
  contentSections: { eyebrow?: string; title: string; body: string; items: string[] }[];
  showImageGallery: boolean;
  galleryEyebrow?: string;
  galleryTitle?: string;
  gallerySubtitle?: string;
  galleryImages: EmbeddedGalleryImage[];
  sections: string[];
  faq: { question: string; answer: string }[];
  status: ContentStatus;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
};

export type ProjectRecord = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  body?: string;
  city: string;
  type: string;
  year?: string;
  surface?: string;
  lots?: string;
  status: ContentStatus;
  featured: boolean;
  coverImage?: { src?: string; alt?: string };
  showImageGallery: boolean;
  galleryEyebrow?: string;
  galleryTitle?: string;
  gallerySubtitle?: string;
  galleryImages: EmbeddedGalleryImage[];
  seoTitle?: string;
  seoDescription?: string;
  sortOrder: number;
};

export type FaqEntryRecord = {
  id: string;
  question: string;
  answer: string;
  category: string;
  targetPage?: string;
  keywords: string[];
  status: ContentStatus;
  order: number;
};

export type SiteSettingsRecord = {
  id: string;
  addressLine: string;
  addressShort: string;
  phone: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  hoursTitle: string;
  hoursWeek: string;
  hoursWeekend: string;
  footerMessage: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  reassuranceItems: string[];
};

export type ContactSubmissionRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  serviceInterest?: string;
  message: string;
  sourcePage: string;
  status: "new" | "read" | "callback" | "assigned" | "closed";
  assignedTo?: string;
  internalNotes?: string;
  createdAt?: string;
  updatedAt?: string;
};

type DocumentLike<T> = T & {
  _id: { toString(): string };
  createdAt?: Date;
  updatedAt?: Date;
  toObject?: () => T & { _id: { toString(): string }; createdAt?: Date; updatedAt?: Date };
};

function objectFromDoc<T>(doc: DocumentLike<T>) {
  return typeof doc.toObject === "function" ? doc.toObject() : doc;
}

function dateString(value?: Date) {
  return value instanceof Date ? value.toISOString() : undefined;
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isUnsplashSrc(src?: string) {
  return Boolean(src && /(^https?:)?\/\/images\.unsplash\.com\//i.test(src));
}

function sanitizeManagedImage<T extends { src?: string }>(image?: T) {
  return image?.src && !isUnsplashSrc(image.src) ? image : undefined;
}

function sanitizeManagedGallery(images?: EmbeddedGalleryImage[]) {
  return (images ?? []).filter((image) => image.src && !isUnsplashSrc(image.src));
}

export function splitCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function serializeBlogPost(doc: DocumentLike<BlogPostRecord>): BlogPostRecord {
  const value = objectFromDoc(doc);
  return {
    id: value._id.toString(),
    slug: value.slug,
    title: value.title,
    excerpt: value.excerpt,
    content: value.content,
    tags: value.tags ?? [],
    coverImage: value.coverImage,
    seoTitle: value.seoTitle,
    seoDescription: value.seoDescription,
    status: value.status,
    publishedAt: dateString(value.publishedAt ? new Date(value.publishedAt) : undefined),
    authorName: value.authorName ?? "EBM Ben Mokhtar",
    createdAt: dateString(value.createdAt),
    updatedAt: dateString(value.updatedAt),
  };
}

export function serializeServicePage(doc: DocumentLike<ServicePageRecord>): ServicePageRecord {
  const value = objectFromDoc(doc);
  const defaults = getDefaultServicePage(value.slug);
  return {
    id: value._id.toString(),
    slug: value.slug,
    navLabel: value.navLabel ?? defaults.navLabel,
    category: value.category ?? defaults.category,
    heroEyebrow: value.heroEyebrow ?? defaults.heroEyebrow,
    heroImage: sanitizeManagedImage(value.heroImage),
    title: value.title,
    intro: value.intro,
    bullets: value.bullets?.length ? value.bullets : defaults.bullets,
    contentSections: value.contentSections?.length ? value.contentSections : defaults.contentSections,
    showImageGallery: value.showImageGallery ?? defaults.showImageGallery,
    galleryEyebrow: value.galleryEyebrow ?? defaults.galleryEyebrow,
    galleryTitle: value.galleryTitle ?? defaults.galleryTitle,
    gallerySubtitle: value.gallerySubtitle ?? defaults.gallerySubtitle,
    galleryImages: sanitizeManagedGallery(value.galleryImages),
    sections: value.sections ?? defaults.contentSections.map((section) => section.title),
    faq: value.faq ?? [],
    status: value.status,
    order: value.order ?? 0,
    seoTitle: value.seoTitle,
    seoDescription: value.seoDescription,
    ctaPrimaryLabel: value.ctaPrimaryLabel ?? "Demander un devis",
    ctaSecondaryLabel: value.ctaSecondaryLabel ?? "Lancer le simulateur",
  };
}

export function serializeProject(doc: DocumentLike<ProjectRecord>): ProjectRecord {
  const value = objectFromDoc(doc);
  return {
    id: value._id.toString(),
    slug: value.slug,
    title: value.title,
    shortDescription: value.shortDescription,
    body: value.body,
    city: value.city ?? "Tunisie",
    type: value.type ?? "Résidentiel",
    year: value.year,
    surface: value.surface,
    lots: value.lots,
    status: value.status,
    featured: Boolean(value.featured),
    coverImage: sanitizeManagedImage(value.coverImage),
    showImageGallery: value.showImageGallery ?? true,
    galleryEyebrow: value.galleryEyebrow ?? "Galerie",
    galleryTitle: value.galleryTitle ?? "Quelques regards sur l'ouvrage.",
    gallerySubtitle: value.gallerySubtitle ?? "Structures, volumes, finitions — la réalité du chantier en images.",
    galleryImages: sanitizeManagedGallery(value.galleryImages),
    seoTitle: value.seoTitle,
    seoDescription: value.seoDescription,
    sortOrder: value.sortOrder ?? 0,
  };
}

export function serializeFaqEntry(doc: DocumentLike<FaqEntryRecord>): FaqEntryRecord {
  const value = objectFromDoc(doc);
  return {
    id: value._id.toString(),
    question: value.question,
    answer: value.answer,
    category: value.category,
    targetPage: value.targetPage,
    keywords: value.keywords ?? [],
    status: value.status,
    order: value.order ?? 0,
  };
}

export function serializeSiteSettings(doc: DocumentLike<SiteSettingsRecord>): SiteSettingsRecord {
  const value = objectFromDoc(doc);
  return {
    id: value._id.toString(),
    addressLine: value.addressLine,
    addressShort: value.addressShort,
    phone: value.phone,
    phoneDisplay: value.phoneDisplay,
    phoneHref: value.phoneHref,
    email: value.email,
    hoursTitle: value.hoursTitle,
    hoursWeek: value.hoursWeek,
    hoursWeekend: value.hoursWeekend,
    footerMessage: value.footerMessage,
    seoTitle: value.seoTitle,
    seoDescription: value.seoDescription,
    seoKeywords: value.seoKeywords ?? [],
    reassuranceItems: value.reassuranceItems ?? [],
  };
}

export function serializeContactSubmission(doc: DocumentLike<ContactSubmissionRecord>): ContactSubmissionRecord {
  const value = objectFromDoc(doc);
  return {
    id: value._id.toString(),
    name: value.name,
    email: value.email,
    phone: value.phone,
    subject: value.subject,
    serviceInterest: value.serviceInterest,
    message: value.message,
    sourcePage: value.sourcePage,
    status: value.status,
    assignedTo: value.assignedTo,
    internalNotes: value.internalNotes,
    createdAt: dateString(value.createdAt),
    updatedAt: dateString(value.updatedAt),
  };
}

export async function ensureServicePages() {
  await connectDB();
  const slugs = Array.from(new Set(["construction/villa", ...Object.keys(genericServicePages)]));

  await ServicePage.bulkWrite(
    slugs.map((slug, order) => {
      const defaults = getDefaultServicePage(slug);
      return {
        updateOne: {
          filter: { slug },
          update: {
            $setOnInsert: {
              ...defaults,
              sections: defaults.contentSections.map((section) => section.title),
              status: "published",
              order,
            },
          },
          upsert: true,
        },
      };
    }),
  );
}

export async function listServicePages() {
  noStore();
  await ensureServicePages();
  const docs = await ServicePage.find().sort({ order: 1, title: 1 });
  return docs.map(serializeServicePage);
}

export async function getPublishedServicePage(slug: string) {
  noStore();
  await ensureServicePages();
  const doc = await ServicePage.findOne({ slug, status: "published" });
  return doc ? serializeServicePage(doc) : null;
}

export async function ensureProjects() {
  await connectDB();
  const count = await Project.countDocuments();
  if (count > 0) return;

  await Project.insertMany(
    staticProjects.map((project, sortOrder) => {
      const cover = getResidenceCover(project.slug, project.title);
      return {
        slug: project.slug,
        title: project.title,
        shortDescription: project.shortDescription,
        body:
          "Chantier résidentiel accompagné par EBM Ben Mokhtar, avec un pilotage complet du gros œuvre au second œuvre.",
        city: "Tunisie",
        type: "Résidentiel",
        status: "published",
        featured: sortOrder < 3,
        coverImage: cover ?? undefined,
        showImageGallery: true,
        galleryEyebrow: "Galerie",
        galleryTitle: "Quelques regards sur l'ouvrage.",
        gallerySubtitle: "Structures, volumes, finitions — la réalité du chantier en images.",
        galleryImages: [],
        seoTitle: `${project.title} | Réalisation EBM`,
        seoDescription: project.shortDescription,
        sortOrder,
      };
    }),
  );
}

export async function listProjects({ publishedOnly = false } = {}) {
  noStore();
  await ensureProjects();
  const query = publishedOnly ? { status: "published" } : {};
  const docs = await Project.find(query).sort({ sortOrder: 1, title: 1 });
  return docs.map(serializeProject);
}

export async function getProjectBySlug(slug: string, { publishedOnly = false } = {}) {
  noStore();
  await ensureProjects();
  const doc = await Project.findOne({ slug, ...(publishedOnly ? { status: "published" } : {}) });
  return doc ? serializeProject(doc) : null;
}

export async function ensureFaqEntries() {
  await connectDB();
  const count = await FaqEntry.countDocuments();
  if (count > 0) return;

  await FaqEntry.insertMany([
    {
      question: "Quel est le prix de construction au m² en Tunisie ?",
      answer:
        "Le prix dépend de la surface, de la structure, du niveau de finition et de l'emplacement. Le simulateur EBM donne une première fourchette, puis l'équipe affine le devis.",
      category: "Simulateur",
      targetPage: "/simulateur",
      keywords: ["prix construction m² Tunisie", "devis villa", "estimation BTP"],
      status: "published",
      order: 0,
    },
    {
      question: "Combien de temps dure la construction d'une villa ?",
      answer:
        "Le délai dépend du programme et des autorisations. EBM prépare un planning par phase pour garder une lecture claire du chantier.",
      category: "Construction",
      targetPage: "/construction/villa",
      status: "published",
      order: 1,
    },
    {
      question: "EBM prend-elle en charge les lots techniques ?",
      answer:
        "Oui. Les lots fluides, électricité, menuiserie et finitions peuvent être coordonnés dans une logique clé en main.",
      category: "Services",
      targetPage: "/services",
      status: "published",
      order: 2,
    },
  ]);
}

export async function listFaqEntries({ publishedOnly = false } = {}) {
  noStore();
  await ensureFaqEntries();
  const query = publishedOnly ? { status: "published" } : {};
  const docs = await FaqEntry.find(query).sort({ order: 1, question: 1 });
  return docs.map(serializeFaqEntry);
}

export async function ensureBlogPosts() {
  await connectDB();
  const count = await BlogPost.countDocuments();
  if (count > 0) return;

  await BlogPost.create({
    slug: "tendances-construction-tunisie",
    title: "Tendances construction en Tunisie : bien préparer son budget",
    excerpt:
      "Guide court pour aider les prospects à comprendre les facteurs qui influencent le budget d'un projet.",
    content:
      "# Tendances construction en Tunisie\n\nUne bonne estimation commence par un programme clair, une surface réaliste et un niveau de finition maîtrisé.\n\n## Points à vérifier\n\n- Titre foncier\n- Accès chantier\n- Structure souhaitée\n- Budget travaux",
    tags: ["construction", "budget", "Tunisie", "génie civil"],
    seoTitle: "Tendances construction en Tunisie | EBM",
    seoDescription:
      "Comprendre les facteurs qui influencent le prix d'une construction en Tunisie avant de demander un devis.",
    status: "published",
    publishedAt: new Date(),
    authorName: "EBM Ben Mokhtar",
  });
}

export async function listBlogPosts({ publishedOnly = false } = {}) {
  noStore();
  await ensureBlogPosts();
  const query = publishedOnly ? { status: "published" } : {};
  const docs = await BlogPost.find(query).sort({ publishedAt: -1, updatedAt: -1 });
  return docs.map(serializeBlogPost);
}

export async function getBlogPostBySlug(slug: string, { publishedOnly = false } = {}) {
  noStore();
  await ensureBlogPosts();
  const doc = await BlogPost.findOne({ slug, ...(publishedOnly ? { status: "published" } : {}) });
  return doc ? serializeBlogPost(doc) : null;
}

export async function ensureSiteSettings() {
  await connectDB();
  let doc = await SiteSettings.findOne({ key: "default" });
  if (!doc) {
    doc = await SiteSettings.create({
      key: "default",
      ...contactContent,
      footerMessage:
        "EBM Ben Mokhtar accompagne les projets de construction, rénovation et aménagement avec une exigence d'ingénierie, de qualité et de respect des délais.",
      seoTitle: "EBM Ben Mokhtar | Entreprise BTP en Tunisie",
      seoDescription:
        "Entreprise de construction, rénovation et génie civil en Tunisie. Estimez votre projet et découvrez les réalisations EBM.",
      seoKeywords: ["construction bâtiment Tunisie", "génie civil", "prix construction m² Tunisie"],
      reassuranceItems: ["Devis gratuit et sans engagement", "Données confidentielles", "Équipe chantier expérimentée"],
    });
  }
  return serializeSiteSettings(doc);
}

export async function listContactSubmissions() {
  noStore();
  await connectDB();
  const docs = await ContactSubmission.find().sort({ createdAt: -1 }).limit(200);
  return docs.map(serializeContactSubmission);
}

export { splitLines };
