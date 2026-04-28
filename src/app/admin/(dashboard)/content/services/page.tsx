import { revalidatePath } from "next/cache";
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, Eye, LayoutTemplate, PenLine } from "lucide-react";
import { auth } from "@/auth";
import { AdminMetricCard, AdminPageHeader, EditorialPanel, FieldShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { listServicePages, splitLines } from "@/lib/cms-content";
import { connectDB } from "@/lib/db";
import { ServicePage } from "@/models/ServicePage";

async function saveServicePage(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const slug = String(formData.get("slug") ?? "")
    .replace(/^\/services\//, "")
    .replace(/^\//, "");
  await connectDB();
  await ServicePage.findOneAndUpdate(
    { slug },
    {
      $set: {
        slug,
        navLabel: String(formData.get("navLabel") ?? "").trim(),
        category: String(formData.get("category") ?? "").trim(),
        title: String(formData.get("title") ?? "").trim(),
        intro: String(formData.get("intro") ?? "").trim(),
        bullets: splitLines(String(formData.get("bullets") ?? "")),
        sections: splitLines(String(formData.get("sections") ?? "")),
        status: formData.get("status") === "draft" ? "draft" : "published",
        seoTitle: String(formData.get("seoTitle") ?? "").trim(),
        seoDescription: String(formData.get("seoDescription") ?? "").trim(),
        ctaPrimaryLabel: String(formData.get("ctaPrimaryLabel") ?? "Demander un devis").trim(),
        ctaSecondaryLabel: String(formData.get("ctaSecondaryLabel") ?? "Lancer le simulateur").trim(),
      },
    },
    { upsert: true },
  );
  revalidatePath("/admin/content/services");
  revalidatePath(`/services/${slug}`);
  revalidatePath(`/${slug}`);
}

export default async function AdminServicesContentPage() {
  const services = await listServicePages();
  const selected = services[0];
  const publishedCount = services.filter((service) => service.status === "published").length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Website settings / Services"
        title="Designer les pages services comme des dossiers techniques vendables."
        description="Pages de prestations connectées : hero, promesse, étapes, preuves chantier, FAQ liée, SEO et CTA."
        action={{ label: "Nouveau service" }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard icon={BriefcaseBusiness} label="Pages" value={`${services.length} services`} detail="Navigation public site." tone="dark" />
        <AdminMetricCard icon={CheckCircle2} label="Qualité" value={`${publishedCount} publiés`} detail="Contenu prêt à indexer." />
        <AdminMetricCard icon={LayoutTemplate} label="Blocs" value="SEO + FAQ" detail="Modèle commun par service." tone="orange" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <EditorialPanel title="Bibliothèque services" description="Sélectionnez une page pour préparer le contenu éditorial.">
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.slug} className="rounded-2xl border bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{service.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">/{service.slug.startsWith("renovation/") || service.slug.startsWith("construction/") ? service.slug : `services/${service.slug}`}</p>
                  </div>
                  <Badge variant="outline">{service.status === "published" ? "Publié" : "Brouillon"}</Badge>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{service.sections.length} sections configurées</span>
                  <Button type="button" variant="ghost" size="sm" asChild>
                    <a href={service.slug.startsWith("renovation/") || service.slug.startsWith("construction/") ? `/${service.slug}` : `/services/${service.slug}`}>
                    Voir
                    <ArrowUpRight className="size-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </EditorialPanel>

        <EditorialPanel title="Éditeur de page service" description="Champs proposés pour un futur payload de page service.">
          <form action={saveServicePage} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FieldShell label="Titre public">
                <Input name="title" defaultValue={selected?.title ?? "Construction villa clé en main en Tunisie"} />
              </FieldShell>
              <FieldShell label="Slug">
                <Input name="slug" defaultValue={selected ? `/${selected.slug}` : "/construction/villa"} />
              </FieldShell>
              <FieldShell label="Label navigation">
                <Input name="navLabel" defaultValue={selected?.navLabel ?? selected?.title ?? "Construction villa"} />
              </FieldShell>
              <FieldShell label="Catégorie">
                <Input name="category" defaultValue={selected?.category ?? "Construction"} />
              </FieldShell>
            </div>
            <FieldShell label="Promesse hero">
              <Textarea
                name="intro"
                defaultValue={selected?.intro ?? "Une équipe d'ingénierie et de chantier pour transformer votre terrain en villa durable, maîtrisée et livrée avec rigueur."}
                rows={4}
              />
            </FieldShell>
            <FieldShell label="Points clés" hint="Un point par ligne.">
              <Textarea name="bullets" rows={5} defaultValue={selected?.bullets.join("\n") ?? ""} />
            </FieldShell>
            <div className="grid gap-4 md:grid-cols-3">
              <FieldShell label="CTA principal">
                <Input name="ctaPrimaryLabel" defaultValue={selected?.ctaPrimaryLabel ?? "Obtenez votre devis"} />
              </FieldShell>
              <FieldShell label="CTA secondaire">
                <Input name="ctaSecondaryLabel" defaultValue={selected?.ctaSecondaryLabel ?? "Lancer le simulateur"} />
              </FieldShell>
              <FieldShell label="Statut">
                <select
                  name="status"
                  defaultValue={selected?.status ?? "published"}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                </select>
              </FieldShell>
            </div>
            <FieldShell label="Meta title">
              <Input name="seoTitle" defaultValue={selected?.seoTitle ?? "Construction villa Tunisie | EBM"} />
            </FieldShell>
            <FieldShell label="Meta description">
              <Textarea name="seoDescription" rows={3} defaultValue={selected?.seoDescription ?? selected?.intro ?? ""} />
            </FieldShell>
            <FieldShell label="Sections de contenu" hint="Chaque ligne devient un bloc réordonnable côté backend.">
              <Textarea
                name="sections"
                rows={7}
                defaultValue={selected?.sections.join("\n") ?? "Hero technique\nÉtapes du chantier\nGaranties qualité\nRéférences similaires\nFAQ service\nCTA simulateur"}
              />
            </FieldShell>
            <div className="flex flex-wrap gap-2">
              <Button type="submit">
                <PenLine className="size-4" />
                Enregistrer le service
              </Button>
              <Button type="button" variant="outline" asChild>
                <a href={selected ? (selected.slug.startsWith("renovation/") || selected.slug.startsWith("construction/") ? `/${selected.slug}` : `/services/${selected.slug}`) : "/services"}>
                  <Eye className="size-4" />
                  Aperçu public
                </a>
              </Button>
            </div>
          </form>
        </EditorialPanel>
      </div>
    </div>
  );
}
