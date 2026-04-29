import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  FileText,
  ImageIcon,
  Layers3,
  LayoutTemplate,
  PenLine,
  Search,
} from "lucide-react";
import { auth } from "@/auth";
import { EmbeddedGalleryEditor } from "@/components/admin/embedded-gallery-editor";
import { HeroImageUploader } from "@/components/admin/hero-image-uploader";
import { AdminMetricCard, AdminPageHeader, EditorialPanel, FieldShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { listServicePages, type ServicePageRecord } from "@/lib/cms-content";
import { connectDB } from "@/lib/db";
import {
  getDefaultServiceContentSections,
  getDefaultServiceHero,
  getServiceGroup,
  publicServiceHref,
  servicePayloadFromFormData,
  servicePayloadToUpdate,
} from "@/lib/service-page-editor";
import { ServicePage } from "@/models/ServicePage";

async function saveServicePage(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const payload = servicePayloadFromFormData(formData);
  await connectDB();
  const current = await ServicePage.findOne({ slug: payload.slug }).select("heroImage").lean<{ heroImage?: { src?: string; alt?: string } }>();
  const defaultHero = getDefaultServiceHero(payload.slug);
  const submittedHeroSrc = payload.heroImage?.src ?? "";
  const currentHeroSrc = current?.heroImage?.src ?? "";
  const shouldKeepCurrentLocalHero =
    currentHeroSrc.startsWith("/api/uploads/") &&
    (!submittedHeroSrc || submittedHeroSrc === defaultHero?.src || submittedHeroSrc.startsWith("http"));
  const heroImage = shouldKeepCurrentLocalHero && currentHeroSrc
    ? { src: currentHeroSrc, alt: current?.heroImage?.alt ?? payload.title }
    : payload.heroImage;
  const update = servicePayloadToUpdate({
    ...payload,
    heroImage,
  });
  await ServicePage.findOneAndUpdate(
    { slug: payload.slug },
    { $set: update },
    { upsert: true },
  );

  revalidatePath("/admin/content/services");
  revalidatePath(publicServiceHref(payload.slug));
  redirect(`/admin/content/services?slug=${encodeURIComponent(payload.slug)}&saved=1`);
}

type Props = {
  searchParams?: Promise<{ slug?: string; q?: string; saved?: string }>;
};

function normalizeMediaSrc(src?: string) {
  if (!src) return "";
  return src.startsWith("http") || src.startsWith("/") ? src : `/api/uploads/${src}`;
}

function groupServices(services: ServicePageRecord[]) {
  return services.reduce<Record<string, ServicePageRecord[]>>((acc, service) => {
    const group = service.category || getServiceGroup(service.slug);
    acc[group] = [...(acc[group] ?? []), service];
    return acc;
  }, {});
}

export default async function AdminServicesContentPage({ searchParams }: Props) {
  const params = await searchParams;
  const services = await listServicePages();
  const query = params?.q?.trim().toLowerCase() ?? "";
  const visibleServices = query
    ? services.filter((service) =>
        [service.title, service.navLabel, service.category, service.slug].some((value) => value?.toLowerCase().includes(query)),
      )
    : services;
  const selected = services.find((service) => service.slug === params?.slug) ?? visibleServices[0] ?? services[0];
  const selectedHref = selected ? publicServiceHref(selected.slug) : "/services";
  const groupedServices = groupServices(visibleServices);
  const selectedHero = selected?.heroImage?.src ? selected.heroImage : getDefaultServiceHero(selected?.slug ?? "");
  const selectedHeroSrc = normalizeMediaSrc(selectedHero?.src);
  const selectedSections = selected?.contentSections?.length
    ? selected.contentSections
    : selected
      ? getDefaultServiceContentSections(selected.slug, selected.intro, selected.bullets)
      : [];
  const publishedCount = services.filter((service) => service.status === "published").length;
  const draftCount = services.length - publishedCount;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Website settings / Services"
        title="Piloter chaque page service sans toucher au design."
        description="Un éditeur simple pour les variables claires : hero, paragraphes, points clés, CTAs, SEO et statut. Les layouts restent verrouillés côté frontend."
        action={{ label: "Ajouter un service", href: "/admin/content/services/new" }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard icon={BriefcaseBusiness} label="Pages" value={`${services.length} services`} detail={`${draftCount} brouillons à finaliser.`} tone="dark" />
        <AdminMetricCard icon={CheckCircle2} label="Publication" value={`${publishedCount} publiés`} detail="Visibles sur le site public." />
        <AdminMetricCard icon={LayoutTemplate} label="Modèle" value="Variables" detail="Hero, sections, SEO, CTAs." tone="orange" />
      </div>

      {params?.saved ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Service enregistré et page publique revalidée.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <EditorialPanel title="Pages services" description="Changez de page sans quitter l'éditeur. Les routes restent verrouillées.">
          <form className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={params?.q ?? ""} placeholder="Rechercher une page..." className="pl-9" />
          </form>
          <div className="space-y-3">
            {Object.entries(groupedServices).map(([group, groupItems]) => (
              <div key={group} className="space-y-2">
                <p className="px-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{group}</p>
                <div className="space-y-2">
                  {groupItems.map((service) => {
                    const active = service.slug === selected?.slug;
                    return (
                      <Link
                        key={service.slug}
                        href={`/admin/content/services?slug=${encodeURIComponent(service.slug)}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                        className={`block rounded-2xl border p-4 transition ${
                          active ? "border-ebm-navy bg-ebm-navy text-white shadow-lg" : "bg-white hover:-translate-y-0.5 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium leading-5">{service.navLabel || service.title}</p>
                            <p className={`mt-1 text-xs ${active ? "text-white/60" : "text-muted-foreground"}`}>{publicServiceHref(service.slug)}</p>
                          </div>
                          <Badge variant="outline" className={active ? "border-white/20 text-white" : ""}>
                            {service.status === "published" ? "Publié" : "Brouillon"}
                          </Badge>
                        </div>
                        <div className={`mt-3 flex items-center gap-2 text-xs ${active ? "text-white/70" : "text-muted-foreground"}`}>
                          <Layers3 className="size-3.5" />
                          {service.contentSections.length || service.sections.length} blocs compatibles
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            {visibleServices.length === 0 ? (
              <div className="rounded-2xl border border-dashed bg-white p-6 text-center text-sm text-muted-foreground">
                Aucune page ne correspond à cette recherche.
              </div>
            ) : null}
          </div>
        </EditorialPanel>

        <div className="space-y-6">
          <EditorialPanel title={selected?.navLabel ?? "Éditeur"} description="Les champs ci-dessous alimentent exactement les zones compatibles côté public.">
            {selected ? (
              <form key={selected.slug} action={saveServicePage} className="space-y-6">
                <input type="hidden" name="slug" value={selected.slug} />

                <section className="rounded-3xl border bg-white p-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-2 font-heading text-xl font-semibold">
                        <ImageIcon className="size-5 text-primary" />
                        Hero public
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">Image, accroche et promesse au-dessus de la ligne de flottaison.</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" asChild>
                      <a href={selectedHref} target="_blank" rel="noreferrer">
                        Voir
                        <ArrowUpRight className="size-4" />
                      </a>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <HeroImageUploader
                      key={`hero-${selected.slug}`}
                      scope="services"
                      ownerSlug={selected.slug}
                      initialSrc={selectedHeroSrc}
                      initialAlt={selected.heroImage?.alt ?? selectedHero?.alt ?? selected.title}
                      persistServiceHero
                    />
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <FieldShell label="Eyebrow">
                          <Input name="heroEyebrow" defaultValue={selected.heroEyebrow} />
                        </FieldShell>
                        <FieldShell label="Titre navigation">
                          <Input name="navLabel" defaultValue={selected.navLabel} />
                        </FieldShell>
                      </div>
                      <FieldShell label="Titre hero">
                        <Input name="title" defaultValue={selected.title} />
                      </FieldShell>
                      <FieldShell label="Paragraphe hero">
                        <Textarea name="intro" defaultValue={selected.intro} rows={4} />
                      </FieldShell>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border bg-white p-4">
                  <EmbeddedGalleryEditor
                    scope="services"
                    ownerSlug={selected.slug}
                    initialImages={selected.galleryImages}
                    defaultVisible={selected.showImageGallery}
                    eyebrow={selected.galleryEyebrow}
                    title={selected.galleryTitle}
                    subtitle={selected.gallerySubtitle}
                  />
                </section>

                <section className="rounded-3xl border bg-white p-4">
                  <div className="mb-4">
                    <p className="flex items-center gap-2 font-heading text-xl font-semibold">
                      <CheckCircle2 className="size-5 text-primary" />
                      Points clés
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">Un point par ligne. Gardez 3 à 6 bénéfices lisibles.</p>
                  </div>
                  <FieldShell label="Points visibles">
                    <Textarea name="bullets" rows={5} defaultValue={selected.bullets.join("\n")} />
                  </FieldShell>
                </section>

                <section className="rounded-3xl border bg-white p-4">
                  <div className="mb-4">
                    <p className="flex items-center gap-2 font-heading text-xl font-semibold">
                      <FileText className="size-5 text-primary" />
                      Paragraphes de page
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">Ces blocs alimentent les sections fixes du template. L&apos;ordre visuel reste contrôlé par le frontend.</p>
                  </div>
                  <div className="space-y-4">
                    {Array.from({ length: 4 }, (_, index) => {
                      const section = selectedSections[index];
                      return (
                        <div key={index} className="rounded-2xl border bg-muted/20 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-semibold">Bloc {index + 1}</p>
                            <Badge variant="outline">{section ? "Configuré" : "Optionnel"}</Badge>
                          </div>
                          <div className="grid gap-3 md:grid-cols-2">
                            <FieldShell label="Eyebrow">
                              <Input name={`contentSections.${index}.eyebrow`} defaultValue={section?.eyebrow ?? ""} />
                            </FieldShell>
                            <FieldShell label="Titre">
                              <Input name={`contentSections.${index}.title`} defaultValue={section?.title ?? ""} />
                            </FieldShell>
                          </div>
                          <FieldShell label="Paragraphe">
                            <Textarea name={`contentSections.${index}.body`} rows={4} defaultValue={section?.body ?? ""} />
                          </FieldShell>
                          <FieldShell label="Liste courte" hint="Optionnel. Un item par ligne.">
                            <Textarea name={`contentSections.${index}.items`} rows={3} defaultValue={section?.items?.join("\n") ?? ""} />
                          </FieldShell>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-3xl border bg-white p-4">
                  <div className="mb-4">
                    <p className="font-heading text-xl font-semibold">Publication, CTAs et SEO</p>
                    <p className="mt-1 text-sm text-muted-foreground">Champs de support. Les destinations des boutons restent fixes pour éviter les liens cassés.</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-4">
                    <FieldShell label="Catégorie">
                      <Input name="category" defaultValue={selected.category ?? getServiceGroup(selected.slug)} />
                    </FieldShell>
                    <FieldShell label="Ordre">
                      <Input name="order" type="number" min={0} defaultValue={selected.order} />
                    </FieldShell>
                    <FieldShell label="Statut">
                      <select name="status" defaultValue={selected.status} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                        <option value="published">Publié</option>
                        <option value="draft">Brouillon</option>
                      </select>
                    </FieldShell>
                    <FieldShell label="URL publique">
                      <Input value={selectedHref} readOnly />
                    </FieldShell>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <FieldShell label="CTA principal">
                      <Input name="ctaPrimaryLabel" defaultValue={selected.ctaPrimaryLabel} />
                    </FieldShell>
                    <FieldShell label="CTA secondaire">
                      <Input name="ctaSecondaryLabel" defaultValue={selected.ctaSecondaryLabel} />
                    </FieldShell>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <FieldShell label="Meta title">
                      <Input name="seoTitle" defaultValue={selected.seoTitle ?? `${selected.title} | EBM Ben Mokhtar`} />
                    </FieldShell>
                    <FieldShell label="Meta description">
                      <Textarea name="seoDescription" rows={3} defaultValue={selected.seoDescription ?? selected.intro} />
                    </FieldShell>
                  </div>
                </section>

                <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/90 p-3 shadow-xl backdrop-blur">
                  <div className="text-sm text-muted-foreground">
                    Édition de <span className="font-medium text-foreground">{selected.navLabel}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" asChild>
                      <a href={selectedHref} target="_blank" rel="noreferrer">
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
                Sélectionnez une page service pour commencer.
              </div>
            )}
          </EditorialPanel>
        </div>
      </div>
    </div>
  );
}
