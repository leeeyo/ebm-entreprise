"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowUpRight, CalendarClock, Eye, FilePlus2, ImageIcon, PenTool, Save, Search, Tags } from "lucide-react";
import { HeroImageUploader } from "@/components/admin/hero-image-uploader";
import { MarkdownContent } from "@/components/marketing/markdown-content";
import { EditorialPanel, FieldShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BlogPostRecord } from "@/lib/cms-content";

const markdownSample = `# Tendances construction en Tunisie

Une bonne estimation commence par un programme clair, une surface réaliste et un niveau de finition maîtrisé.

## Points à vérifier

- Titre foncier
- Accès chantier
- Structure souhaitée
- Budget travaux`;

type BlogEditorClientProps = {
  posts: BlogPostRecord[];
  selected?: BlogPostRecord;
  isNew: boolean;
  saveAction: (formData: FormData) => void | Promise<void>;
  saved?: boolean;
};

type DraftState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  status: "draft" | "published";
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  coverImage: { src: string; alt: string };
};

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizeSlug(value: string) {
  return value.replace(/^\/?actualites\//, "").replace(/^\//, "");
}

function formatDate(value?: string) {
  if (!value) return "Non planifié";
  return new Intl.DateTimeFormat("fr-TN", { dateStyle: "medium" }).format(new Date(value));
}

function draftFromPost(post?: BlogPostRecord): DraftState {
  return {
    title: post?.title ?? "",
    slug: post?.slug ? `/actualites/${post.slug}` : "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? markdownSample,
    tags: post?.tags.join(", ") ?? "construction, budget, Tunisie, génie civil",
    status: post?.status ?? "draft",
    publishedAt: (post?.publishedAt ?? todayInputValue()).slice(0, 10),
    seoTitle: post?.seoTitle ?? "",
    seoDescription: post?.seoDescription ?? "",
    coverImage: {
      src: post?.coverImage?.src ?? "",
      alt: post?.coverImage?.alt ?? post?.title ?? "",
    },
  };
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      <Save className="size-4" />
      {pending ? "Enregistrement..." : "Enregistrer"}
    </Button>
  );
}

export function BlogEditorClient({ posts, selected, isNew, saveAction, saved }: BlogEditorClientProps) {
  const [draft, setDraft] = useState<DraftState>(() => draftFromPost(isNew ? undefined : selected));
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return posts;
    return posts.filter((post) => {
      const haystack = `${post.title} ${post.slug} ${post.tags.join(" ")}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [posts, query]);

  const tagList = useMemo(
    () =>
      draft.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [draft.tags],
  );

  const previewDate = draft.publishedAt ? new Date(draft.publishedAt).toISOString() : undefined;
  const publicSlug = normalizeSlug(draft.slug);
  const uploadOwnerSlug = publicSlug || slugify(draft.title) || selected?.slug || "draft-blog";

  function updateDraft<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function generateSlug() {
    const nextSlug = slugify(draft.title);
    if (nextSlug) updateDraft("slug", `/actualites/${nextSlug}`);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <EditorialPanel title="Articles" description="Choisissez un article à modifier ou démarrez une nouvelle publication.">
        <Button asChild className="w-full bg-ebm-navy text-white hover:opacity-90">
          <Link href="/admin/content/blog?new=1">
            <FilePlus2 className="size-4" />
            Nouvel article
          </Link>
        </Button>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
            placeholder="Rechercher par titre, slug ou tag..."
          />
        </div>

        <div className="space-y-3">
          {filteredPosts.map((post) => {
            const active = !isNew && post.slug === selected?.slug;
            return (
              <Link
                key={post.id}
                href={`/admin/content/blog?slug=${encodeURIComponent(post.slug)}`}
                className={`block rounded-2xl border p-4 transition ${
                  active ? "border-ebm-navy bg-ebm-navy text-white shadow-lg" : "bg-white hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium leading-5">{post.title}</p>
                    <p className={`mt-1 text-sm ${active ? "text-white/65" : "text-muted-foreground"}`}>/actualites/{post.slug}</p>
                  </div>
                  <Badge variant="outline" className={active ? "border-white/20 text-white" : ""}>
                    {post.status === "published" ? "Publié" : "Brouillon"}
                  </Badge>
                </div>
                <div className={`mt-4 flex flex-wrap gap-2 text-xs ${active ? "text-white/65" : "text-muted-foreground"}`}>
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>·</span>
                  <span>{post.tags.slice(0, 2).join(", ") || "Sans tag"}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </EditorialPanel>

      <div className="space-y-6">
        {saved ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            Article enregistré et pages publiques revalidées.
          </div>
        ) : null}

        <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
          <EditorialPanel
            title={isNew ? "Nouvel article" : selected?.title ?? "Article"}
            description="Rédigez le contenu, préparez le SEO, puis publiez quand le texte est prêt."
          >
            <form action={saveAction} className="space-y-5">
              <input type="hidden" name="originalSlug" value={selected?.slug ?? ""} />
              <section className="rounded-3xl border bg-white p-4">
                <div className="mb-4">
                  <p className="flex items-center gap-2 font-heading text-xl font-semibold">
                    <ImageIcon className="size-5 text-primary" />
                    Image header
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Utilisée en haut de l&apos;article et dans l&apos;aperçu de rédaction.
                  </p>
                </div>
                <HeroImageUploader
                  key={`blog-cover-${selected?.slug ?? "new"}`}
                  scope="blogs"
                  ownerSlug={uploadOwnerSlug}
                  initialSrc={draft.coverImage.src}
                  initialAlt={draft.coverImage.alt || draft.title || "Article EBM"}
                  persistBlogCover={!isNew && Boolean(selected?.slug)}
                  onImageChangeAction={(image) => updateDraft("coverImage", image)}
                />
              </section>

              <div className="rounded-3xl border bg-muted/30 p-4">
                <div className="grid gap-4">
                  <FieldShell label="Titre">
                    <Input
                      name="title"
                      value={draft.title}
                      onChange={(event) => updateDraft("title", event.target.value)}
                      placeholder="Ex. Comment préparer le budget d'une villa en Tunisie"
                      className="h-11 px-3 text-base selection:bg-primary selection:text-primary-foreground md:text-base"
                      required
                    />
                  </FieldShell>
                  <FieldShell label="Slug public">
                    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                      <Input
                        name="slug"
                        value={draft.slug}
                        onChange={(event) => updateDraft("slug", event.target.value)}
                        placeholder="/actualites/mon-article"
                        className="h-11 px-3 font-mono text-sm selection:bg-primary selection:text-primary-foreground"
                        required
                      />
                      <Button type="button" variant="outline" className="h-11" onClick={generateSlug}>
                        Générer
                      </Button>
                    </div>
                  </FieldShell>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Conseil : gardez un slug court, lisible, sans accents, puis évitez de le changer après publication.
                </p>
              </div>

              <FieldShell label="Résumé" hint="Affiché sur la page Actualités et dans l'en-tête de l'article.">
                <Textarea
                  name="excerpt"
                  rows={3}
                  value={draft.excerpt}
                  onChange={(event) => updateDraft("excerpt", event.target.value)}
                  placeholder="Résumé court en une ou deux phrases."
                  required
                />
              </FieldShell>

              <FieldShell label="Contenu markdown" hint="Titres avec #, listes avec -, paragraphes séparés par une ligne vide.">
                <Textarea
                  name="content"
                  className="min-h-[460px] font-mono text-sm leading-6"
                  value={draft.content}
                  onChange={(event) => updateDraft("content", event.target.value)}
                  required
                />
              </FieldShell>

              <div className="grid gap-4 md:grid-cols-2">
                <FieldShell label="Statut">
                  <select
                    name="status"
                    value={draft.status}
                    onChange={(event) => updateDraft("status", event.target.value as DraftState["status"])}
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                  </select>
                </FieldShell>
                <FieldShell label="Date de publication">
                  <Input
                    name="publishedAt"
                    type="date"
                    value={draft.publishedAt}
                    onChange={(event) => updateDraft("publishedAt", event.target.value)}
                  />
                </FieldShell>
              </div>

              <FieldShell label="Tags">
                <Input
                  name="tags"
                  value={draft.tags}
                  onChange={(event) => updateDraft("tags", event.target.value)}
                  placeholder="construction, budget, Tunisie"
                />
              </FieldShell>

              <div className="rounded-3xl border bg-white p-4">
                <p className="mb-4 font-heading text-lg font-semibold">SEO</p>
                <div className="space-y-4">
                  <FieldShell label="Meta title">
                    <Input
                      name="seoTitle"
                      value={draft.seoTitle}
                      onChange={(event) => updateDraft("seoTitle", event.target.value)}
                      placeholder={draft.title ? `${draft.title} | EBM` : "Titre SEO"}
                    />
                  </FieldShell>
                  <FieldShell label="Meta description">
                    <Textarea
                      name="seoDescription"
                      rows={3}
                      value={draft.seoDescription}
                      onChange={(event) => updateDraft("seoDescription", event.target.value)}
                      placeholder="Description courte pour Google."
                    />
                  </FieldShell>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <SubmitButton />
                {publicSlug ? (
                  <Button type="button" variant="outline" asChild>
                    <a href={`/actualites/${publicSlug}`} target="_blank" rel="noreferrer">
                      <Eye className="size-4" />
                      Voir public
                    </a>
                  </Button>
                ) : null}
              </div>
            </form>
          </EditorialPanel>

          <div className="2xl:sticky 2xl:top-6 2xl:self-start">
            <EditorialPanel title="Aperçu live" description="Le rendu se met à jour pendant la rédaction.">
              <article className="overflow-hidden rounded-[2rem] border bg-white shadow-sm">
                <header className="relative overflow-hidden bg-ebm-navy p-6 text-white">
                  {draft.coverImage.src ? (
                    <Image
                      src={draft.coverImage.src}
                      alt={draft.coverImage.alt || draft.title || "Article EBM"}
                      fill
                      unoptimized
                      className="object-cover opacity-32"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-ebm-navy/72" />
                  <div className="relative">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {(tagList.length ? tagList : ["Actualités"]).slice(0, 3).map((tag) => (
                        <Badge key={tag} className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                          <Tags className="size-3" />
                          {tag}
                        </Badge>
                      ))}
                      <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                        <CalendarClock className="size-3" />
                        {formatDate(previewDate)}
                      </Badge>
                    </div>
                    <h2 className="font-heading text-3xl font-semibold tracking-tight">
                      {draft.title || "Titre de l'article"}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-white/70">
                      {draft.excerpt || "Le résumé apparaîtra ici pendant la rédaction."}
                    </p>
                  </div>
                </header>
                <div className="max-h-[620px] overflow-auto p-6">
                  {draft.content.trim() ? (
                    <MarkdownContent content={draft.content} />
                  ) : (
                    <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                      Commencez à écrire pour voir le rendu markdown.
                    </div>
                  )}
                </div>
              </article>
              <Button type="button" variant="outline" size="sm" asChild>
                <Link href="/actualites" target="_blank">
                  <PenTool className="size-4" />
                  Page Actualités
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </EditorialPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
