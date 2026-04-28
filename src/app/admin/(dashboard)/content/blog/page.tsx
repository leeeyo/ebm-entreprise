import { revalidatePath } from "next/cache";
import { CalendarClock, Eye, FileText, Hash, Newspaper, PenTool, Tags } from "lucide-react";
import { auth } from "@/auth";
import { AdminMetricCard, AdminPageHeader, EditorialPanel, FieldShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { listBlogPosts, splitCsv } from "@/lib/cms-content";
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";

const markdownSample = `# Tendances construction en Tunisie

Une bonne estimation commence par un programme clair, une surface réaliste et un niveau de finition maîtrisé.

## Points à vérifier

- Titre foncier
- Accès chantier
- Structure souhaitée
- Budget travaux`;

async function saveBlogPost(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const slug = String(formData.get("slug") ?? "").replace(/^\/?actualites\//, "").replace(/^\//, "");
  await connectDB();
  await BlogPost.findOneAndUpdate(
    { slug },
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
        authorName: "EBM Ben Mokhtar",
      },
    },
    { upsert: true },
  );
  revalidatePath("/admin/content/blog");
  revalidatePath("/actualites");
  revalidatePath(`/actualites/${slug}`);
}

function formatDate(value?: string) {
  if (!value) return "Non planifié";
  return new Intl.DateTimeFormat("fr-TN", { dateStyle: "medium" }).format(new Date(value));
}

export default async function AdminBlogContentPage() {
  const posts = await listBlogPosts();
  const selected = posts[0];
  const publishedCount = posts.filter((post) => post.status === "published").length;
  const draftCount = posts.filter((post) => post.status === "draft").length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Website settings / Blog MD"
        title="Publier des actualités techniques avec un flux markdown propre."
        description="Articles branchés à MongoDB : contenu markdown, excerpt, tags, SEO, statut et aperçu éditorial."
        action={{ label: "Nouvel article" }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard icon={Newspaper} label="Articles" value={`${posts.length} articles`} detail={`${draftCount} brouillons à finaliser.`} tone="dark" />
        <AdminMetricCard icon={FileText} label="Format" value="Markdown" detail="Contenu portable et versionnable." />
        <AdminMetricCard icon={Hash} label="Publiés" value={`${publishedCount} en ligne`} detail="Liés à Actualités." tone="orange" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <EditorialPanel title="Éditeur markdown" description="Zone de rédaction pensée pour être branchée à une collection d'articles.">
          <form action={saveBlogPost} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FieldShell label="Titre">
                <Input name="title" defaultValue={selected?.title ?? "Tendances construction en Tunisie : bien préparer son budget"} />
              </FieldShell>
              <FieldShell label="Slug">
                <Input name="slug" defaultValue={selected ? `/actualites/${selected.slug}` : "/actualites/tendances-construction-tunisie"} />
              </FieldShell>
            </div>
            <FieldShell label="Résumé">
              <Textarea
                name="excerpt"
                rows={3}
                defaultValue={selected?.excerpt ?? "Guide court pour aider les prospects à comprendre les facteurs qui influencent le budget d'un projet."}
              />
            </FieldShell>
            <FieldShell label="Contenu MD" hint="Support prévu : titres, listes, liens, citations, images et blocs de code si nécessaire.">
              <Textarea name="content" className="min-h-[360px] font-mono text-sm" defaultValue={selected?.content ?? markdownSample} />
            </FieldShell>
            <div className="grid gap-4 md:grid-cols-2">
              <FieldShell label="Statut">
                <select
                  name="status"
                  defaultValue={selected?.status ?? "draft"}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </FieldShell>
              <FieldShell label="Date de publication">
                <Input name="publishedAt" type="date" defaultValue={(selected?.publishedAt ?? new Date().toISOString()).slice(0, 10)} />
              </FieldShell>
            </div>
            <FieldShell label="Tags">
              <Input name="tags" defaultValue={selected?.tags.join(", ") ?? "construction, budget, Tunisie, génie civil"} />
            </FieldShell>
            <FieldShell label="Meta title">
              <Input name="seoTitle" defaultValue={selected?.seoTitle ?? "Tendances construction en Tunisie | EBM"} />
            </FieldShell>
            <FieldShell label="Meta description">
              <Textarea
                name="seoDescription"
                rows={4}
                defaultValue={selected?.seoDescription ?? "Comprendre les facteurs qui influencent le prix d'une construction en Tunisie avant de demander un devis."}
              />
            </FieldShell>
            <div className="flex flex-wrap gap-2">
              <Button type="submit">
                <PenTool className="size-4" />
                Enregistrer l'article
              </Button>
              <Button type="button" variant="outline" asChild>
                <a href={selected ? `/actualites/${selected.slug}` : "/actualites"}>
                  <Eye className="size-4" />
                  Aperçu public
                </a>
              </Button>
            </div>
          </form>
        </EditorialPanel>

        <div className="space-y-6">
          <EditorialPanel title="Articles enregistrés" description="Derniers contenus stockés et exposés sur /actualites.">
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="rounded-2xl border bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">/actualites/{post.slug}</p>
                    </div>
                    <Badge variant="outline">{post.status === "published" ? "Publié" : "Brouillon"}</Badge>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
                </div>
              ))}
            </div>
          </EditorialPanel>

          <EditorialPanel title="Aperçu compact" description="Rendu éditorial simplifié pour valider le ton avant intégration MD.">
            <article className="rounded-3xl bg-ebm-navy p-5 text-white">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge className="bg-primary text-primary-foreground">
                  <Tags className="size-3" />
                  Construction
                </Badge>
                <Badge className="border-white/15 bg-white/10 text-white">
                  <CalendarClock className="size-3" />
                  {formatDate(selected?.publishedAt)}
                </Badge>
              </div>
              <h2 className="font-heading text-2xl font-semibold">{selected?.title ?? "Tendances construction en Tunisie"}</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                {selected?.excerpt ?? "Une bonne estimation commence par un programme clair, une surface réaliste et un niveau de finition maîtrisé."}
              </p>
            </article>
          </EditorialPanel>
        </div>
      </div>
    </div>
  );
}
