import type { MetadataRoute } from "next";
import { listBlogPosts, listProjects, listServicePages } from "@/lib/cms-content";
import { absoluteSiteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

type SitemapEntry = MetadataRoute.Sitemap[number];
type ChangeFrequency = NonNullable<SitemapEntry["changeFrequency"]>;

const staticRoutes: Array<{
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
}> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/simulateur", priority: 0.9, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.9, changeFrequency: "weekly" },
  { path: "/construction", priority: 0.8, changeFrequency: "monthly" },
  { path: "/renovation", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/projets", priority: 0.8, changeFrequency: "weekly" },
  { path: "/construction/villa", priority: 0.7, changeFrequency: "monthly" },
  { path: "/construction/immeubles-residences", priority: 0.7, changeFrequency: "monthly" },
  { path: "/renovation/maison-appartement", priority: 0.7, changeFrequency: "monthly" },
  { path: "/renovation/salle-de-bain", priority: 0.7, changeFrequency: "monthly" },
  { path: "/actualites", priority: 0.6, changeFrequency: "weekly" },
  { path: "/confidentialite", priority: 0.3, changeFrequency: "yearly" },
];

function sitemapEntry(
  path: string,
  priority: number,
  changeFrequency: ChangeFrequency,
  lastModified?: string | Date,
): SitemapEntry {
  return {
    url: absoluteSiteUrl(path),
    priority,
    changeFrequency,
    ...(lastModified ? { lastModified } : {}),
  };
}

function uniqueEntries(entries: SitemapEntry[]) {
  const byUrl = new Map<string, SitemapEntry>();
  for (const entry of entries) {
    byUrl.set(entry.url, entry);
  }
  return Array.from(byUrl.values());
}

function isServiceAlias(slug: string) {
  return slug.startsWith("construction/") || slug.startsWith("renovation/");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = staticRoutes.map(({ path, priority, changeFrequency }) =>
    sitemapEntry(path, priority, changeFrequency),
  );

  try {
    const [services, projects, posts] = await Promise.all([
      listServicePages(),
      listProjects({ publishedOnly: true }),
      listBlogPosts({ publishedOnly: true }),
    ]);

    entries.push(
      ...services
        .filter((service) => service.status === "published" && !isServiceAlias(service.slug))
        .map((service) => sitemapEntry(`/services/${service.slug}`, 0.7, "monthly")),
    );

    entries.push(
      ...projects
        .filter((project) => project.status === "published")
        .map((project) => sitemapEntry(`/projets/${project.slug}`, 0.7, "monthly")),
    );

    entries.push(
      ...posts
        .filter((post) => post.status === "published")
        .map((post) =>
          sitemapEntry(
            `/actualites/${post.slug}`,
            0.6,
            "weekly",
            post.updatedAt ?? post.publishedAt,
          ),
        ),
    );
  } catch (error) {
    console.error("[sitemap] Could not load dynamic CMS routes:", error);
  }

  return uniqueEntries(entries);
}
