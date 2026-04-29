import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Camera, Eye, EyeOff, FolderKanban, ImageIcon, MapPinned, PenLine, Plus, Star, Trash2, Trophy } from "lucide-react";
import { auth } from "@/auth";
import { EmbeddedGalleryEditor } from "@/components/admin/embedded-gallery-editor";
import { HeroImageUploader } from "@/components/admin/hero-image-uploader";
import { AdminMetricCard, AdminPageHeader, EditorialPanel, FieldShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { listProjects } from "@/lib/cms-content";
import { connectDB } from "@/lib/db";
import { galleryPayloadFromFormData } from "@/lib/embedded-gallery";
import { Project } from "@/models/Project";

async function saveProject(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const slug = String(formData.get("slug") ?? "").replace(/^\/?projets\//, "").replace(/^\//, "");
  const hasGalleryPayload = formData.has("showImageGallery");
  const gallery = hasGalleryPayload ? galleryPayloadFromFormData(formData) : null;
  const coverImageSrc = String(formData.get("heroImageSrc") ?? "").trim();
  const coverImageAlt = String(formData.get("heroImageAlt") ?? "").trim();
  const update = {
    slug,
    title: String(formData.get("title") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    type: String(formData.get("type") ?? "").trim(),
    year: String(formData.get("year") ?? "").trim(),
    surface: String(formData.get("surface") ?? "").trim(),
    lots: String(formData.get("lots") ?? "").trim(),
    status: formData.get("status") === "draft" ? "draft" : "published",
    featured: formData.get("featured") === "on",
    seoTitle: String(formData.get("seoTitle") ?? "").trim() || undefined,
    seoDescription: String(formData.get("seoDescription") ?? "").trim() || undefined,
    coverImage: coverImageSrc
      ? {
          src: coverImageSrc,
          alt: coverImageAlt || String(formData.get("title") ?? "Projet EBM").trim(),
        }
      : undefined,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    ...(gallery
      ? {
          showImageGallery: gallery.showImageGallery,
          galleryEyebrow: gallery.galleryEyebrow,
          galleryTitle: gallery.galleryTitle,
          gallerySubtitle: gallery.gallerySubtitle,
          galleryImages: gallery.galleryImages,
        }
      : {}),
  };
  await connectDB();
  await Project.findOneAndUpdate(
    { slug },
    {
      $set: update,
    },
    { upsert: true },
  );
  revalidatePath("/admin/content/projects");
  revalidatePath("/projets");
  revalidatePath(`/projets/${slug}`);
  redirect(`/admin/content/projects?slug=${encodeURIComponent(slug)}&saved=1`);
}

async function hideProject(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const slug = String(formData.get("slug") ?? "").replace(/^\/?projets\//, "").replace(/^\//, "");
  await connectDB();
  await Project.findOneAndUpdate({ slug }, { $set: { status: "draft" } });

  revalidatePath("/admin/content/projects");
  revalidatePath("/projets");
  revalidatePath(`/projets/${slug}`);
  redirect(`/admin/content/projects?slug=${encodeURIComponent(slug)}&hidden=1`);
}

async function deleteProject(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const slug = String(formData.get("slug") ?? "").replace(/^\/?projets\//, "").replace(/^\//, "");
  await connectDB();
  await Project.findOneAndDelete({ slug });

  revalidatePath("/admin/content/projects");
  revalidatePath("/projets");
  revalidatePath(`/projets/${slug}`);
  redirect("/admin/content/projects?deleted=1");
}

type Props = {
  searchParams?: Promise<{ slug?: string; saved?: string; hidden?: string; deleted?: string }>;
};

function normalizeMediaSrc(src?: string) {
  if (!src) return "";
  return src.startsWith("http") || src.startsWith("/") ? src : `/api/uploads/${src}`;
}

export default async function AdminProjectsContentPage({ searchParams }: Props) {
  const params = await searchParams;
  const projects = await listProjects();
  const selected = projects.find((project) => project.slug === params?.slug) ?? projects[0];
  const publishedCount = projects.filter((project) => project.status === "published").length;
  const featuredCount = projects.filter((project) => project.featured).length;
  const imageCount = projects.reduce((total, project) => total + project.galleryImages.length, 0);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Paramètres du site / Projets"
        title="Mettre en scène les réalisations comme des preuves de maîtrise."
        description="Fiches projets branchées : galerie, chiffres clés, localisation, témoignage, SEO et statut de mise en avant."
        action={{ label: "Ajouter un projet", href: "/admin/content/projects/new" }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard icon={FolderKanban} label="Portfolio" value={`${projects.length} références`} detail={`${publishedCount} publiées.`} tone="dark" />
        <AdminMetricCard icon={Camera} label="Galeries" value={`${imageCount} images`} detail="Images intégrées aux fiches." />
        <AdminMetricCard icon={Trophy} label="Preuve" value={`${featuredCount} mises en avant`} detail="Accueil et pages services." tone="orange" />
      </div>

      {params?.saved ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Projet enregistré et pages publiques revalidées.
        </div>
      ) : null}
      {params?.hidden ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
          Projet masqué : il est repassé en brouillon et retiré du site public.
        </div>
      ) : null}
      {params?.deleted ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-900">
          Projet supprimé et pages publiques revalidées.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <EditorialPanel title="Réalisations" description="Sélectionnez un projet, puis modifiez son image, sa fiche et sa galerie.">
          <Button asChild className="w-full bg-ebm-navy text-white hover:opacity-90">
            <Link href="/admin/content/projects/new">
              <Plus className="size-4" />
              Nouveau projet
            </Link>
          </Button>
          <div className="space-y-3">
            {projects.map((project) => {
              const active = project.slug === selected?.slug;
              return (
                <Link
                  key={project.id}
                  href={`/admin/content/projects?slug=${encodeURIComponent(project.slug)}`}
                  className={`block rounded-2xl border p-4 transition ${
                    active ? "border-ebm-navy bg-ebm-navy text-white shadow-lg" : "bg-white hover:-translate-y-0.5 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium leading-5">{project.title}</p>
                      <p className={`mt-1 flex items-center gap-1 text-sm ${active ? "text-white/65" : "text-muted-foreground"}`}>
                        <MapPinned className="size-3.5" />
                        {project.city}
                      </p>
                    </div>
                    <Badge variant="outline" className={active ? "border-white/20 text-white" : ""}>
                      {project.status === "published" ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                  <div className={`mt-4 flex flex-wrap gap-2 text-xs ${active ? "text-white/65" : "text-muted-foreground"}`}>
                    <span>{project.galleryImages.length} images</span>
                    <span>·</span>
                    <span>{project.featured ? "Mis en avant" : "Portfolio"}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </EditorialPanel>

        <div className="space-y-6">
          <EditorialPanel title={selected?.title ?? "Fiche projet"} description="Une seule fiche claire : couverture publique, texte, SEO et publication.">
            {selected ? (
              <form key={selected.slug} action={saveProject} className="space-y-6">
                <section className="rounded-3xl border bg-white p-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-2 font-heading text-xl font-semibold">
                        <ImageIcon className="size-5 text-primary" />
                        Image de couverture
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">Cette image remplace le header public du projet.</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" asChild>
                      <a href={`/projets/${selected.slug}`} target="_blank" rel="noreferrer">
                        Voir
                        <ArrowUpRight className="size-4" />
                      </a>
                    </Button>
                  </div>
                  <HeroImageUploader
                    key={`project-cover-${selected.slug}`}
                    scope="projects"
                    ownerSlug={selected.slug}
                    initialSrc={normalizeMediaSrc(selected.coverImage?.src)}
                    initialAlt={selected.coverImage?.alt ?? selected.title}
                    persistProjectCover
                  />
                </section>

                <section className="rounded-3xl border bg-white p-4">
                  <div className="mb-4">
                    <p className="font-heading text-xl font-semibold">Identité du projet</p>
                    <p className="mt-1 text-sm text-muted-foreground">Les champs que l&apos;équipe met à jour le plus souvent sont regroupés ici.</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FieldShell label="Nom du projet">
                      <Input name="title" defaultValue={selected.title} />
                    </FieldShell>
                    <FieldShell label="Slug">
                      <Input name="slug" defaultValue={`/projets/${selected.slug}`} />
                    </FieldShell>
                    <FieldShell label="Ville / quartier">
                      <Input name="city" defaultValue={selected.city} />
                    </FieldShell>
                    <FieldShell label="Type">
                      <Input name="type" defaultValue={selected.type} />
                    </FieldShell>
                    <FieldShell label="Année">
                      <Input name="year" defaultValue={selected.year ?? ""} />
                    </FieldShell>
                    <FieldShell label="Surface">
                      <Input name="surface" defaultValue={selected.surface ?? ""} />
                    </FieldShell>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-[1fr_160px_160px]">
                    <FieldShell label="Lots livrés">
                      <Input name="lots" defaultValue={selected.lots ?? ""} />
                    </FieldShell>
                    <FieldShell label="Ordre">
                      <Input name="sortOrder" type="number" min={0} defaultValue={selected.sortOrder} />
                    </FieldShell>
                    <FieldShell label="Statut">
                      <select name="status" defaultValue={selected.status} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                        <option value="published">Publié</option>
                        <option value="draft">Brouillon</option>
                      </select>
                    </FieldShell>
                  </div>
                </section>

                <section className="rounded-3xl border bg-white p-4">
                  <div className="mb-4">
                    <p className="font-heading text-xl font-semibold">Texte public et SEO</p>
                    <p className="mt-1 text-sm text-muted-foreground">Résumé pour les cartes, corps de page et métadonnées de recherche.</p>
                  </div>
                  <FieldShell label="Résumé commercial">
                    <Textarea name="shortDescription" rows={3} defaultValue={selected.shortDescription} />
                  </FieldShell>
                  <FieldShell label="Corps de fiche">
                    <Textarea name="body" rows={5} defaultValue={selected.body ?? ""} />
                  </FieldShell>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FieldShell label="Meta title">
                      <Input name="seoTitle" defaultValue={selected.seoTitle ?? `${selected.title} | Réalisation EBM`} />
                    </FieldShell>
                    <FieldShell label="Meta description">
                      <Textarea name="seoDescription" rows={3} defaultValue={selected.seoDescription ?? selected.shortDescription} />
                    </FieldShell>
                  </div>
                  <label className="mt-4 flex items-center gap-2 text-sm">
                    <input name="featured" type="checkbox" defaultChecked={selected.featured} />
                    Projet phare
                  </label>
                </section>

                <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/90 p-3 shadow-xl backdrop-blur">
                  <div className="text-sm text-muted-foreground">
                    Édition de <span className="font-medium text-foreground">{selected.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" asChild>
                      <a href={`/projets/${selected.slug}`} target="_blank" rel="noreferrer">
                        <Eye className="size-4" />
                        Aperçu public
                      </a>
                    </Button>
                    <Button type="submit">
                      <PenLine className="size-4" />
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="rounded-3xl border border-dashed bg-white p-8 text-center text-sm text-muted-foreground">
                Créez un premier projet pour commencer.
              </div>
            )}
          </EditorialPanel>

          {selected ? (
            <EditorialPanel title="Actions rapides" description="Masquez une page publique ou supprimez définitivement la fiche projet.">
              <div className="grid gap-3 md:grid-cols-2">
                <form action={hideProject} className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <input type="hidden" name="slug" value={selected.slug} />
                  <p className="font-medium text-amber-950">Masquer le projet</p>
                  <p className="mt-1 text-sm leading-6 text-amber-900/75">
                    Passe le statut en brouillon. Le projet reste modifiable dans l&apos;admin.
                  </p>
                  <Button type="submit" variant="outline" className="mt-4 border-amber-300 bg-white text-amber-950 hover:bg-amber-100">
                    <EyeOff className="size-4" />
                    Masquer
                  </Button>
                </form>
                <form action={deleteProject} className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                  <input type="hidden" name="slug" value={selected.slug} />
                  <p className="font-medium text-rose-950">Supprimer le projet</p>
                  <p className="mt-1 text-sm leading-6 text-rose-900/75">
                    Supprime la fiche de la base. Les images uploadées restent dans le dossier uploads.
                  </p>
                  <Button type="submit" variant="outline" className="mt-4 border-rose-300 bg-white text-rose-950 hover:bg-rose-100">
                    <Trash2 className="size-4" />
                    Supprimer
                  </Button>
                </form>
              </div>
            </EditorialPanel>
          ) : null}

          {selected ? (
            <EditorialPanel title="Galerie intégrée" description="Upload local direct dans uploads/projects, sans médiathèque séparée.">
              <form action={saveProject} className="space-y-4">
                <input type="hidden" name="slug" value={`/projets/${selected.slug}`} />
                <input type="hidden" name="title" value={selected.title} />
                <input type="hidden" name="shortDescription" value={selected.shortDescription} />
                <input type="hidden" name="body" value={selected.body ?? ""} />
                <input type="hidden" name="city" value={selected.city} />
                <input type="hidden" name="type" value={selected.type} />
                <input type="hidden" name="year" value={selected.year ?? ""} />
                <input type="hidden" name="surface" value={selected.surface ?? ""} />
                <input type="hidden" name="lots" value={selected.lots ?? ""} />
                <input type="hidden" name="status" value={selected.status} />
                <input type="hidden" name="sortOrder" value={selected.sortOrder} />
                <input type="hidden" name="heroImageSrc" value={selected.coverImage?.src ?? ""} />
                <input type="hidden" name="heroImageAlt" value={selected.coverImage?.alt ?? selected.title} />
                <input type="hidden" name="seoTitle" value={selected.seoTitle ?? ""} />
                <input type="hidden" name="seoDescription" value={selected.seoDescription ?? ""} />
                {selected.featured ? <input type="hidden" name="featured" value="on" /> : null}
                <EmbeddedGalleryEditor
                  scope="projects"
                  ownerSlug={selected.slug}
                  initialImages={selected.galleryImages}
                  defaultVisible={selected.showImageGallery}
                  eyebrow={selected.galleryEyebrow}
                  title={selected.galleryTitle}
                  subtitle={selected.gallerySubtitle}
                />
                <Button type="submit">
                  <Star className="size-4" />
                  Enregistrer la galerie
                </Button>
              </form>
            </EditorialPanel>
          ) : null}
        </div>
      </div>
    </div>
  );
}
