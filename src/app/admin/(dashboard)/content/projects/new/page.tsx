import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, FolderPlus } from "lucide-react";
import { auth } from "@/auth";
import { AdminPageHeader, EditorialPanel, FieldShell } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";

function normalizeProjectSlug(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .trim()
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/^\/?projets\//, "")
    .replace(/^\//, "")
    .replace(/\/$/, "");
}

async function createProject(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const slug = normalizeProjectSlug(formData.get("slug"));
  const title = String(formData.get("title") ?? "").trim();

  await connectDB();
  await Project.findOneAndUpdate(
    { slug },
    {
      $setOnInsert: {
        slug,
        title,
        shortDescription: String(formData.get("shortDescription") ?? "").trim(),
        body: String(formData.get("body") ?? "").trim(),
        city: String(formData.get("city") ?? "").trim() || "Tunisie",
        type: String(formData.get("type") ?? "").trim() || "Résidentiel",
        year: String(formData.get("year") ?? "").trim(),
        surface: String(formData.get("surface") ?? "").trim(),
        lots: String(formData.get("lots") ?? "").trim(),
        status: formData.get("status") === "draft" ? "draft" : "published",
        featured: formData.get("featured") === "on",
        showImageGallery: true,
        galleryEyebrow: "Galerie",
        galleryTitle: "Quelques regards sur l'ouvrage.",
        gallerySubtitle: "Structures, volumes, finitions — la réalité du chantier en images.",
        galleryImages: [],
        seoTitle: String(formData.get("seoTitle") ?? "").trim() || `${title} | Réalisation EBM`,
        seoDescription: String(formData.get("seoDescription") ?? "").trim() || String(formData.get("shortDescription") ?? "").trim(),
        sortOrder: Number(formData.get("sortOrder") ?? 0),
      },
    },
    { upsert: true },
  );

  revalidatePath("/admin/content/projects");
  revalidatePath("/projets");
  redirect(`/admin/content/projects?slug=${encodeURIComponent(slug)}&saved=1`);
}

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Paramètres du site / Nouveau projet"
        title="Ajouter une référence au portfolio."
        description="Créez d'abord la fiche projet. Vous pourrez ensuite ajouter l'image de couverture et la galerie depuis l'éditeur principal."
        action={{ label: "Retour aux projets", href: "/admin/content/projects" }}
      />

      <EditorialPanel title="Nouvelle fiche projet" description="Renseignez les informations utiles pour publier une page claire et crédible.">
        <form action={createProject} className="space-y-6">
          <section className="rounded-3xl border bg-white p-4">
            <div className="mb-4 flex items-center gap-2">
              <FolderPlus className="size-5 text-primary" />
              <p className="font-heading text-xl font-semibold">Identité</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FieldShell label="Nom du projet">
                <Input name="title" required placeholder="Résidence ..." />
              </FieldShell>
              <FieldShell label="Slug public" hint="Exemple : residence-amira. La page sera publiée sur /projets/residence-amira.">
                <Input name="slug" required placeholder="residence-nouvelle" />
              </FieldShell>
              <FieldShell label="Ville / quartier">
                <Input name="city" defaultValue="Tunisie" />
              </FieldShell>
              <FieldShell label="Type">
                <Input name="type" defaultValue="Résidentiel" />
              </FieldShell>
              <FieldShell label="Année">
                <Input name="year" placeholder="2026" />
              </FieldShell>
              <FieldShell label="Surface">
                <Input name="surface" placeholder="4 200 m²" />
              </FieldShell>
            </div>
          </section>

          <section className="rounded-3xl border bg-white p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FieldShell label="Lots livrés">
                <Input name="lots" placeholder="Gros œuvre, fluides, finitions" />
              </FieldShell>
              <FieldShell label="Ordre">
                <Input name="sortOrder" type="number" min={0} defaultValue={0} />
              </FieldShell>
            </div>
            <FieldShell label="Résumé commercial">
              <Textarea name="shortDescription" required rows={3} placeholder="Une phrase courte pour les cartes et le haut de page." />
            </FieldShell>
            <FieldShell label="Corps de fiche">
              <Textarea name="body" rows={5} placeholder="Décrivez le chantier, la méthode et les points de maîtrise." />
            </FieldShell>
          </section>

          <section className="rounded-3xl border bg-white p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FieldShell label="Meta title">
                <Input name="seoTitle" placeholder="Titre SEO optionnel" />
              </FieldShell>
              <FieldShell label="Meta description">
                <Textarea name="seoDescription" rows={3} placeholder="Description SEO optionnelle" />
              </FieldShell>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <FieldShell label="Statut">
                <select name="status" defaultValue="draft" className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                </select>
              </FieldShell>
              <label className="flex items-end gap-2 pb-2 text-sm">
                <input name="featured" type="checkbox" />
                Projet phare
              </label>
            </div>
          </section>

          <div className="flex flex-wrap gap-2">
            <Button type="submit">
              <FolderPlus className="size-4" />
              Créer le projet
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/content/projects">
                <ArrowLeft className="size-4" />
                Annuler
              </Link>
            </Button>
          </div>
        </form>
      </EditorialPanel>
    </div>
  );
}
