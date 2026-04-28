import { revalidatePath } from "next/cache";
import { Camera, FolderKanban, ImagePlus, MapPinned, Star, Trophy } from "lucide-react";
import { auth } from "@/auth";
import { AdminMetricCard, AdminPageHeader, EditorialPanel, FieldShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { listChantierAssets, listProjects } from "@/lib/cms-content";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";

async function saveProject(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const slug = String(formData.get("slug") ?? "").replace(/^\/?projets\//, "").replace(/^\//, "");
  await connectDB();
  await Project.findOneAndUpdate(
    { slug },
    {
      $set: {
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
      },
    },
    { upsert: true },
  );
  revalidatePath("/admin/content/projects");
  revalidatePath("/projets");
  revalidatePath(`/projets/${slug}`);
}

export default async function AdminProjectsContentPage() {
  const [projects, assets] = await Promise.all([listProjects(), listChantierAssets()]);
  const selected = projects[0];
  const publishedCount = projects.filter((project) => project.status === "published").length;
  const featuredCount = projects.filter((project) => project.featured).length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Website settings / Projets"
        title="Mettre en scène les réalisations comme des preuves de maîtrise."
        description="Fiches projets branchées : galerie, chiffres clés, localisation, témoignage, SEO et statut de mise en avant."
        action={{ label: "Ajouter un projet" }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard icon={FolderKanban} label="Portfolio" value={`${projects.length} références`} detail={`${publishedCount} publiées.`} tone="dark" />
        <AdminMetricCard icon={Camera} label="Galeries" value={`${assets.length} images`} detail="Visuels chantier à classer." />
        <AdminMetricCard icon={Trophy} label="Preuve" value={`${featuredCount} mises en avant`} detail="Accueil et pages services." tone="orange" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <EditorialPanel title="Réalisations" description="Vue de sélection pour gérer les fiches projet.">
          <div className="space-y-3">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                className="w-full rounded-2xl border bg-white p-4 text-left transition hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{project.title}</p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPinned className="size-3.5" />
                      {project.city}
                    </p>
                  </div>
                  <Badge variant="outline">{project.status === "published" ? "Publié" : "Brouillon"}</Badge>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {assets.filter((asset) => asset.projectSlug === project.slug).length} photos prêtes
                </p>
              </button>
            ))}
          </div>
        </EditorialPanel>

        <div className="space-y-6">
          <EditorialPanel title="Fiche projet" description="Contenu principal affiché sur la page réalisation.">
            <form action={saveProject} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FieldShell label="Nom du projet">
                  <Input name="title" defaultValue={selected?.title ?? "Résidence Amira"} />
                </FieldShell>
                <FieldShell label="Slug">
                  <Input name="slug" defaultValue={selected ? `/projets/${selected.slug}` : "/projets/residence-amira"} />
                </FieldShell>
                <FieldShell label="Ville / quartier">
                  <Input name="city" defaultValue={selected?.city ?? "Ariana, Tunisie"} />
                </FieldShell>
                <FieldShell label="Type">
                  <Input name="type" defaultValue={selected?.type ?? "Résidence haut standing"} />
                </FieldShell>
                <FieldShell label="Année">
                  <Input name="year" defaultValue={selected?.year ?? "2026"} />
                </FieldShell>
                <FieldShell label="Surface">
                  <Input name="surface" defaultValue={selected?.surface ?? "4 200 m²"} />
                </FieldShell>
              </div>
              <FieldShell label="Résumé commercial">
                <Textarea
                  name="shortDescription"
                  rows={3}
                  defaultValue={selected?.shortDescription ?? "Projet résidentiel piloté avec une exigence élevée sur la structure, les finitions et la coordination des lots techniques."}
                />
              </FieldShell>
              <FieldShell label="Corps de fiche">
                <Textarea name="body" rows={5} defaultValue={selected?.body ?? ""} />
              </FieldShell>
              <div className="grid gap-4 md:grid-cols-3">
                <FieldShell label="Lots livrés">
                  <Input name="lots" defaultValue={selected?.lots ?? "Gros œuvre, fluides, finitions"} />
                </FieldShell>
                <FieldShell label="Statut">
                  <select name="status" defaultValue={selected?.status ?? "published"} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm">
                    <option value="published">Publié</option>
                    <option value="draft">Brouillon</option>
                  </select>
                </FieldShell>
                <label className="flex items-end gap-2 pb-2 text-sm">
                  <input name="featured" type="checkbox" defaultChecked={selected?.featured ?? true} />
                  Projet phare
                </label>
              </div>
              <Button type="submit">
                <Star className="size-4" />
                Enregistrer la fiche
              </Button>
            </form>
          </EditorialPanel>

          <EditorialPanel title="Galerie & mise en avant" description="Prépare la future compatibilité avec l'upload et les assets chantier.">
            <div className="grid gap-3 sm:grid-cols-3">
              {["Façade principale", "Structure béton", "Finitions communes"].map((item) => (
                <div key={item} className="rounded-2xl border border-dashed bg-white p-5">
                  <div className="grid aspect-video place-items-center rounded-xl bg-muted text-muted-foreground">
                    <ImagePlus className="size-6" />
                  </div>
                  <p className="mt-3 text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button">
                <Star className="size-4" />
                Marquer comme projet phare
              </Button>
              <Button type="button" variant="outline">Organiser la galerie</Button>
            </div>
          </EditorialPanel>
        </div>
      </div>
    </div>
  );
}
