import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, Plus } from "lucide-react";
import { auth } from "@/auth";
import { AdminPageHeader, EditorialPanel, FieldShell } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { connectDB } from "@/lib/db";
import {
  publicServiceHref,
  servicePayloadFromFormData,
  servicePayloadToUpdate,
} from "@/lib/service-page-editor";
import { ServicePage } from "@/models/ServicePage";

async function createServicePage(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const payload = servicePayloadFromFormData(formData);

  await connectDB();
  await ServicePage.findOneAndUpdate(
    { slug: payload.slug },
    { $setOnInsert: servicePayloadToUpdate(payload) },
    { upsert: true },
  );

  revalidatePath("/admin/content/services");
  revalidatePath(publicServiceHref(payload.slug));
  redirect(`/admin/content/services?slug=${encodeURIComponent(payload.slug)}&saved=1`);
}

export default function NewServicePage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Paramètres du site / Nouveau service"
        title="Ajouter une page service."
        description="Créez la structure éditoriale d'une nouvelle prestation. L'image hero, les blocs avancés et la galerie pourront être affinés dans l'éditeur principal."
        action={{ label: "Retour aux services", href: "/admin/content/services" }}
      />

      <EditorialPanel title="Nouvelle page service" description="Gardez un slug stable : il devient l'URL publique de la page.">
        <form action={createServicePage} className="space-y-6">
          <section className="rounded-3xl border bg-white p-4">
            <div className="mb-4 flex items-center gap-2">
              <BriefcaseBusiness className="size-5 text-primary" />
              <p className="font-heading text-xl font-semibold">Navigation et hero</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FieldShell label="Slug" hint="Exemple : fluide/ventilation. Les slugs construction/... et renovation/... sortent hors /services.">
                <Input name="slug" required placeholder="fluide/ventilation" />
              </FieldShell>
              <FieldShell label="Titre navigation">
                <Input name="navLabel" required placeholder="Ventilation" />
              </FieldShell>
              <FieldShell label="Catégorie">
                <Input name="category" defaultValue="Services" />
              </FieldShell>
              <FieldShell label="Eyebrow hero">
                <Input name="heroEyebrow" defaultValue="Savoir-faire EBM" />
              </FieldShell>
            </div>
            <FieldShell label="Titre hero">
              <Input name="title" required placeholder="Service EBM..." />
            </FieldShell>
            <FieldShell label="Paragraphe hero">
              <Textarea name="intro" required rows={4} placeholder="Présentez la prestation, sa valeur et la méthode EBM." />
            </FieldShell>
            <input type="hidden" name="heroImageSrc" value="" />
            <input type="hidden" name="heroImageAlt" value="" />
          </section>

          <section className="rounded-3xl border bg-white p-4">
            <div className="mb-4">
              <p className="font-heading text-xl font-semibold">Contenu de départ</p>
              <p className="mt-1 text-sm text-muted-foreground">Un point par ligne. Le premier bloc lance la page publique.</p>
            </div>
            <FieldShell label="Points clés">
              <Textarea
                name="bullets"
                required
                rows={5}
                defaultValue={"Diagnostic technique\nExécution coordonnée\nRéception contrôlée"}
              />
            </FieldShell>
            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <FieldShell label="Eyebrow du bloc">
                  <Input name="contentSections.0.eyebrow" defaultValue="Approche EBM" />
                </FieldShell>
                <FieldShell label="Titre du bloc">
                  <Input name="contentSections.0.title" required defaultValue="Une exécution coordonnée, transparente et documentée." />
                </FieldShell>
              </div>
              <FieldShell label="Paragraphe du bloc">
                <Textarea
                  name="contentSections.0.body"
                  required
                  rows={4}
                  defaultValue="EBM cadre chaque intervention avec un diagnostic clair, une exécution suivie et une réception documentée."
                />
              </FieldShell>
              <FieldShell label="Liste courte du bloc">
                <Textarea name="contentSections.0.items" rows={3} defaultValue={"Diagnostic technique\nPlanning coordonné\nContrôle de réception"} />
              </FieldShell>
            </div>
          </section>

          <section className="rounded-3xl border bg-white p-4">
            <div className="grid gap-4 md:grid-cols-4">
              <FieldShell label="Ordre">
                <Input name="order" type="number" min={0} defaultValue={0} />
              </FieldShell>
              <FieldShell label="Statut">
                <select name="status" defaultValue="draft" className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                </select>
              </FieldShell>
              <FieldShell label="CTA principal">
                <Input name="ctaPrimaryLabel" defaultValue="Demander un devis" />
              </FieldShell>
              <FieldShell label="CTA secondaire">
                <Input name="ctaSecondaryLabel" defaultValue="Lancer le simulateur" />
              </FieldShell>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <FieldShell label="Meta title">
                <Input name="seoTitle" placeholder="Titre SEO optionnel" />
              </FieldShell>
              <FieldShell label="Meta description">
                <Textarea name="seoDescription" rows={3} placeholder="Description SEO optionnelle" />
              </FieldShell>
            </div>
            <input type="hidden" name="showImageGallery" value="true" />
            <input type="hidden" name="galleryEyebrow" value="Aperçu" />
            <input type="hidden" name="galleryTitle" value="En images" />
            <input type="hidden" name="gallerySubtitle" value="Des chantiers inspirés et des finitions soignées — un avant-goût de notre savoir-faire." />
          </section>

          <div className="flex flex-wrap gap-2">
            <Button type="submit">
              <Plus className="size-4" />
              Créer le service
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/content/services">
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
