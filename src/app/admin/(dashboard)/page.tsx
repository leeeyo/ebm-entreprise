import {
  BookOpenText,
  BriefcaseBusiness,
  Building2,
  FileQuestion,
  FolderKanban,
  Inbox,
  MapPin,
  Newspaper,
  Phone,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import { AdminMetricCard, AdminPageHeader, AdminWorkspaceCard, EditorialPanel } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listBlogPosts, listContactSubmissions, listFaqEntries, listProjects, listServicePages } from "@/lib/cms-content";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";

export default async function AdminHomePage() {
  await connectDB();
  const [leadCount, contacts, posts, services, projects, faqs] = await Promise.all([
    Lead.countDocuments(),
    listContactSubmissions(),
    listBlogPosts(),
    listServicePages(),
    listProjects(),
    listFaqEntries(),
  ]);
  const openContacts = contacts.filter((item) => item.status !== "closed").length;
  const publishedPosts = posts.filter((post) => post.status === "published").length;
  const publishedContent = [
    ...services.filter((service) => service.status === "published"),
    ...projects.filter((project) => project.status === "published"),
    ...faqs.filter((faq) => faq.status === "published"),
  ].length;
  const embeddedImageCount =
    services.reduce((total, service) => total + service.galleryImages.length, 0) +
    projects.reduce((total, project) => total + project.galleryImages.length, 0);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Administration premium"
        title="Piloter l'image digitale EBM avec la rigueur d'un chantier."
        description="Un tableau de bord pensé comme une salle de contrôle : leads, contenus du site, projets, FAQ, actualités markdown et paramètres généraux branchés à MongoDB."
        action={{ label: "Voir le site public", href: "/" }}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          icon={Inbox}
          label="Pipeline"
          value={`${leadCount} leads`}
          detail={`${openContacts} demandes contact ouvertes.`}
          tone="dark"
        />
        <AdminMetricCard
          icon={TrendingUp}
          label="Estimation"
          value="Prix 2026"
          detail="Tarifs, marges, zones et options."
          tone="orange"
        />
        <AdminMetricCard
          icon={Building2}
          label="Preuve terrain"
          value={`${embeddedImageCount} images`}
          detail="Galeries intégrées services/projets."
        />
        <AdminMetricCard
          icon={Phone}
          label="Contact"
          value={`${publishedContent} contenus`}
          detail={`${publishedPosts} actualités publiées.`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AdminWorkspaceCard
          icon={Inbox}
          title="Leads simulateur"
          description="Consulter les demandes de devis, les coordonnées et les hypothèses de calcul transmises au commercial."
          href="/admin/leads"
          meta="CRM"
        />
        <AdminWorkspaceCard
          icon={SlidersHorizontal}
          title="Tarification simulateur"
          description="Ajuster prix au m², coefficients, marges, options et zones tunisiennes déjà connectés au backend existant."
          href="/admin/settings"
          meta="Pricing"
        />
        <AdminWorkspaceCard
          icon={BriefcaseBusiness}
          title="Services"
          description="Composer les pages services et gérer leurs images locales intégrées."
          href="/admin/content/services"
          meta="Pages"
        />
        <AdminWorkspaceCard
          icon={FolderKanban}
          title="Projets"
          description="Structurer les résidences, fiches références et galeries locales."
          href="/admin/content/projects"
          meta="Portfolio"
        />
        <AdminWorkspaceCard
          icon={Newspaper}
          title="Blog markdown"
          description="Rédiger des actualités en MD avec aperçu éditorial, SEO et statut de publication."
          href="/admin/content/blog"
          meta="MD"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <EditorialPanel
          title="Paramètres du site à raccorder"
          description="Les écrans clés sont maintenant raccordés à MongoDB, avec les champs, états et parcours nécessaires au site public."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Services", "Slug, hero, sections, CTA, FAQ liée"],
              ["Projets", "Résidence, galerie, ville, chiffres clés"],
              ["FAQ", "Question, réponse, catégorie, page cible"],
              ["Demandes contact", "Inbox, statut, source, assignation"],
              ["Blog MD", "Markdown, SEO, tags, publication"],
              ["Site global", "Adresse, téléphones, email, horaires"],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl border bg-white p-4">
                <p className="font-medium">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </EditorialPanel>

        <EditorialPanel title="Priorité éditoriale" description="Ce qui mérite une attention de validation avant branchement.">
          <div className="space-y-3">
            <Badge className="bg-primary text-primary-foreground">Conversion</Badge>
            <p className="text-sm leading-7 text-muted-foreground">
              Garder les CTA, coordonnées et questions fréquentes synchronisés avec le simulateur pour réduire les
              frictions entre découverte du site et demande de devis.
            </p>
            <Button type="button" variant="outline" className="w-full justify-start">
              <MapPin className="size-4" />
              Vérifier les informations de contact
            </Button>
            <Button type="button" variant="outline" className="w-full justify-start">
              <FileQuestion className="size-4" />
              Revoir les FAQ publiques
            </Button>
            <Button type="button" variant="outline" className="w-full justify-start">
              <BookOpenText className="size-4" />
              Trier les demandes contact
            </Button>
          </div>
        </EditorialPanel>
      </div>
    </div>
  );
}
