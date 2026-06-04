import { config } from "dotenv";
import mongoose from "mongoose";
import { BlogPost } from "../src/models/BlogPost";
import { FaqEntry } from "../src/models/FaqEntry";
import { Project } from "../src/models/Project";
import { ServicePage } from "../src/models/ServicePage";
import { SiteSettings } from "../src/models/SiteSettings";
import { flagshipServicePages } from "../src/content/seed/service-flagship";
import { richServicePages } from "../src/content/seed/service-pages-rich";
import { seedProjects } from "../src/content/seed/projects-rich";
import { seedBlogPosts } from "../src/content/seed/blog";
import { seedFaqEntries } from "../src/content/seed/faq";
import { seedSiteSettings } from "../src/content/seed/site";
import { getResidenceCover } from "../src/content/residence-covers";
import type { SeedServicePage } from "../src/content/seed/types";

config({ path: ".env.local" });
config({ path: ".env" });

/* eslint-disable no-console -- CLI script */

/** Drop keys whose value is `undefined` so `$set` never writes null. */
function compact<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

function servicePageUpdate(page: SeedServicePage) {
  return compact({
    slug: page.slug,
    navLabel: page.navLabel,
    category: page.category,
    heroEyebrow: page.heroEyebrow,
    heroImage: page.heroImage,
    title: page.title,
    intro: page.intro,
    bullets: page.bullets,
    contentSections: page.contentSections.map((section) =>
      compact({
        eyebrow: section.eyebrow,
        title: section.title,
        body: section.body,
        items: section.items ?? [],
      }),
    ),
    showImageGallery: page.showImageGallery,
    galleryEyebrow: page.galleryEyebrow,
    galleryTitle: page.galleryTitle,
    gallerySubtitle: page.gallerySubtitle,
    galleryImages: page.galleryImages,
    sections: page.contentSections.map((section) => section.title),
    faq: page.faq,
    status: "published",
    order: page.order,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    ctaPrimaryLabel: page.ctaPrimaryLabel,
    ctaSecondaryLabel: page.ctaSecondaryLabel,
  });
}

async function seedServicePages() {
  const pages = [...flagshipServicePages, ...richServicePages];
  await ServicePage.bulkWrite(
    pages.map((page) => ({
      updateOne: {
        filter: { slug: page.slug },
        update: { $set: servicePageUpdate(page) },
        upsert: true,
      },
    })),
  );
  return pages.length;
}

async function seedProjectDocs() {
  await Project.bulkWrite(
    seedProjects.map((project, sortOrder) => {
      const cover = getResidenceCover(project.slug, project.title);
      return {
        updateOne: {
          filter: { slug: project.slug },
          update: {
            $set: compact({
              slug: project.slug,
              title: project.title,
              shortDescription: project.shortDescription,
              body: project.body,
              city: project.city,
              type: project.type,
              year: project.year,
              surface: project.surface,
              lots: project.lots,
              status: "published",
              featured: project.featured,
              coverImage: cover ?? undefined,
              showImageGallery: false,
              galleryImages: [],
              seoTitle: project.seoTitle,
              seoDescription: project.seoDescription,
              sortOrder,
            }),
          },
          upsert: true,
        },
      };
    }),
  );
  return seedProjects.length;
}

async function seedBlogDocs() {
  await BlogPost.bulkWrite(
    seedBlogPosts.map((post, index) => ({
      updateOne: {
        filter: { slug: post.slug },
        update: {
          $set: compact({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            tags: post.tags,
            status: "published",
            // Deterministic descending dates so the newest article shows first.
            publishedAt: new Date(Date.UTC(2026, 4 - index, 15)),
            authorName: post.authorName,
            seoTitle: post.seoTitle,
            seoDescription: post.seoDescription,
          }),
        },
        upsert: true,
      },
    })),
  );
  return seedBlogPosts.length;
}

async function seedFaqDocs() {
  await FaqEntry.bulkWrite(
    seedFaqEntries.map((entry, order) => ({
      updateOne: {
        filter: { question: entry.question },
        update: {
          $set: compact({
            question: entry.question,
            answer: entry.answer,
            category: entry.category,
            targetPage: entry.targetPage,
            keywords: entry.keywords,
            status: "published",
            order,
          }),
        },
        upsert: true,
      },
    })),
  );
  return seedFaqEntries.length;
}

async function seedSettings() {
  await SiteSettings.findOneAndUpdate(
    { key: "default" },
    { $set: { key: "default", ...seedSiteSettings } },
    { upsert: true, returnDocument: "after" },
  );
}

/**
 * Remove the placeholder docs that the lazy `ensure*` bootstrap in
 * `src/lib/cms-content.ts` inserts on first visit, so only the curated
 * content remains after seeding.
 */
async function cleanupLegacyPlaceholders() {
  const blog = await BlogPost.deleteOne({ slug: "tendances-construction-tunisie" });
  const faq = await FaqEntry.deleteOne({
    question: "EBM prend-elle en charge les lots techniques ?",
  });
  return (blog.deletedCount ?? 0) + (faq.deletedCount ?? 0);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(uri);

  const services = await seedServicePages();
  const projects = await seedProjectDocs();
  const posts = await seedBlogDocs();
  const faqs = await seedFaqDocs();
  await seedSettings();
  const removed = await cleanupLegacyPlaceholders();

  console.log(
    `Content seed OK — ${services} service pages, ${projects} projects, ${posts} articles, ${faqs} FAQ entries, site settings (removed ${removed} legacy placeholder${removed === 1 ? "" : "s"}).`,
  );
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
