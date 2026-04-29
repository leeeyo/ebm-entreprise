import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Clock, Hash, Newspaper } from "lucide-react";
import { auth } from "@/auth";
import { AdminMetricCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { listBlogPosts, splitCsv } from "@/lib/cms-content";
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import { BlogEditorClient } from "./blog-editor-client";

function normalizeBlogSlug(value: string) {
  return value
    .replace(/^\/?actualites\//, "")
    .replace(/^\//, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function saveBlogPost(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const slug = normalizeBlogSlug(String(formData.get("slug") ?? ""));
  const originalSlug = normalizeBlogSlug(String(formData.get("originalSlug") ?? ""));
  if (!slug) {
    throw new Error("Slug is required");
  }

  const coverImageSrc = String(formData.get("heroImageSrc") ?? "").trim();
  const coverImageAlt = String(formData.get("heroImageAlt") ?? "").trim();

  await connectDB();
  await BlogPost.findOneAndUpdate(
    { slug: originalSlug || slug },
    {
      $set: {
        slug,
        title: String(formData.get("title") ?? "").trim(),
        excerpt: String(formData.get("excerpt") ?? "").trim(),
        content: String(formData.get("content") ?? ""),
        tags: splitCsv(String(formData.get("tags") ?? "")),
        seoTitle: String(formData.get("seoTitle") ?? "").trim(),
        seoDescription: String(formData.get("seoDescription") ?? "").trim(),
        status: formData.get("status") === "published" ? "published" : "draft",
        publishedAt: formData.get("publishedAt") ? new Date(String(formData.get("publishedAt"))) : undefined,
        coverImage: coverImageSrc
          ? {
              src: coverImageSrc,
              alt: coverImageAlt || String(formData.get("title") ?? "Article EBM").trim(),
            }
          : undefined,
        authorName: "EBM Ben Mokhtar",
      },
    },
    { upsert: true },
  );

  revalidatePath("/admin/content/blog");
  revalidatePath("/actualites");
  revalidatePath(`/actualites/${slug}`);
  if (originalSlug && originalSlug !== slug) {
    revalidatePath(`/actualites/${originalSlug}`);
  }
  redirect(`/admin/content/blog?slug=${encodeURIComponent(slug)}&saved=1`);
}

type Props = {
  searchParams?: Promise<{ slug?: string; new?: string; saved?: string }>;
};

export default async function AdminBlogContentPage({ searchParams }: Props) {
  const params = await searchParams;
  const posts = await listBlogPosts();
  const isNew = params?.new === "1";
  const selected = isNew ? undefined : posts.find((post) => post.slug === params?.slug) ?? posts[0];
  const publishedCount = posts.filter((post) => post.status === "published").length;
  const draftCount = posts.filter((post) => post.status === "draft").length;
  const recentlyUpdated = posts[0]?.updatedAt
    ? new Intl.DateTimeFormat("fr-TN", { dateStyle: "medium" }).format(new Date(posts[0].updatedAt))
    : "À venir";

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Paramètres du site / Actualités"
        title="Piloter les articles avec un vrai espace de rédaction."
        description="Créez, modifiez et prévisualisez les actualités EBM avant publication : markdown, résumé, tags, SEO et statut public."
        action={{ label: "Nouvel article", href: "/admin/content/blog?new=1" }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard icon={Newspaper} label="Articles" value={`${posts.length} articles`} detail={`${draftCount} brouillons à finaliser.`} tone="dark" />
        <AdminMetricCard icon={Hash} label="Publiés" value={`${publishedCount} en ligne`} detail="Liés à Actualités." tone="orange" />
        <AdminMetricCard icon={Clock} label="Dernière mise à jour" value={recentlyUpdated} detail="Triés par activité récente." />
      </div>

      <BlogEditorClient
        key={isNew ? "new" : selected?.slug ?? "empty"}
        posts={posts}
        selected={selected}
        isNew={isNew}
        saveAction={saveBlogPost}
        saved={params?.saved === "1"}
      />
    </div>
  );
}
