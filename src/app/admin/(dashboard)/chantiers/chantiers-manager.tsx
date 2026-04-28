"use client";

import { useState } from "react";
import { Camera, ImageUp, Images, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { AdminMetricCard, AdminPageHeader, EditorialPanel, FieldShell } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ChantierAssetRecord, ProjectRecord, ServicePageRecord } from "@/lib/cms-content";

type ChantiersManagerProps = {
  initialAssets: ChantierAssetRecord[];
  projects: ProjectRecord[];
  services: ServicePageRecord[];
};

export function ChantiersManager({ initialAssets, projects, services }: ChantiersManagerProps) {
  const [assets, setAssets] = useState(initialAssets);
  const [uploading, setUploading] = useState(false);

  async function refreshAssets() {
    const res = await fetch("/api/admin/chantier-assets");
    if (!res.ok) return;
    const json = (await res.json()) as { assets: ChantierAssetRecord[] };
    setAssets(json.assets);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      toast.error("Choisissez un fichier.");
      return;
    }
    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const json = (await res.json()) as { relativePath?: string };
      toast.success(`Fichier enregistré : ${json.relativePath ?? ""}`);
      form.reset();
      await refreshAssets();
    } catch {
      toast.error("Upload impossible.");
    } finally {
      setUploading(false);
    }
  }

  async function updateAsset(assetId: string, formData: FormData) {
    const res = await fetch(`/api/admin/chantier-assets/${assetId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        label: formData.get("label"),
        alt: formData.get("alt"),
        caption: formData.get("caption"),
        projectSlug: formData.get("projectSlug"),
        serviceSlug: formData.get("serviceSlug"),
        gallery: formData.get("gallery"),
        status: formData.get("status"),
        featured: formData.get("featured") === "on",
        sortOrder: Number(formData.get("sortOrder") ?? 0),
      }),
    });
    if (!res.ok) {
      toast.error("Mise à jour impossible.");
      return;
    }
    toast.success("Média mis à jour.");
    await refreshAssets();
  }

  async function deleteAsset(assetId: string) {
    const res = await fetch(`/api/admin/chantier-assets/${assetId}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Suppression impossible.");
      return;
    }
    toast.success("Média retiré de la médiathèque.");
    await refreshAssets();
  }

  const publishedCount = assets.filter((asset) => asset.status === "published").length;
  const featuredCount = assets.filter((asset) => asset.featured).length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Opérations / Chantiers"
        title="Tenir les preuves chantier au niveau du standing EBM."
        description="Médiathèque branchée : upload, alt SEO, rattachement aux projets/services, statut de publication et mise en avant."
        action={{ label: "Organiser les médias" }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard icon={Images} label="Médias" value={`${assets.length} assets`} detail={`${publishedCount} publiés.`} tone="dark" />
        <AdminMetricCard icon={Camera} label="Formats" value="Images" detail="Visuels projet et avancement." />
        <AdminMetricCard icon={ImageUp} label="Mise en avant" value={`${featuredCount} featured`} detail="Accueil, projets, services." tone="orange" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <EditorialPanel title="Téléversement" description="Dépôt local dans uploads/chantiers via UPLOAD_DIR.">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid min-h-52 place-items-center rounded-3xl border border-dashed bg-white p-6 text-center">
              <div>
                <UploadCloud className="mx-auto size-10 text-primary" />
                <Label htmlFor="file" className="mt-4 block font-medium">
                  Fichier image
                </Label>
                <p className="mt-2 text-sm text-muted-foreground">WebP, JPG ou PNG pour les galeries chantier.</p>
                <Input id="file" name="file" type="file" accept="image/*" className="mt-4" />
              </div>
            </div>
            <FieldShell label="Label">
              <Input name="label" placeholder="Façade principale, structure béton..." />
            </FieldShell>
            <FieldShell label="Alt SEO">
              <Input name="alt" placeholder="Photo chantier résidence EBM à Ariana" />
            </FieldShell>
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldShell label="Projet lié">
                <select name="projectSlug" className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm">
                  <option value="">Aucun</option>
                  {projects.map((project) => (
                    <option key={project.slug} value={project.slug}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </FieldShell>
              <FieldShell label="Publier">
                <select name="status" className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" defaultValue="draft">
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </FieldShell>
            </div>
            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? "Envoi..." : "Téléverser"}
            </Button>
          </form>
        </EditorialPanel>

        <EditorialPanel title="Médiathèque chantier" description="Les médias publiés peuvent alimenter les pages projets et services.">
          <div className="space-y-4">
            {assets.map((asset) => (
              <form
                key={asset.id}
                action={(formData) => {
                  void updateAsset(asset.id, formData);
                }}
                className="rounded-2xl border bg-white p-4"
              >
                <div className="grid gap-4 xl:grid-cols-[160px_1fr]">
                  <div className="overflow-hidden rounded-xl border bg-muted">
                    <img
                      src={`/api/uploads/${asset.relativePath}`}
                      alt={asset.alt || asset.label || asset.filename}
                      className="aspect-4/3 w-full object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <FieldShell label="Label">
                        <Input name="label" defaultValue={asset.label ?? ""} />
                      </FieldShell>
                      <FieldShell label="Alt">
                        <Input name="alt" defaultValue={asset.alt ?? ""} />
                      </FieldShell>
                    </div>
                    <FieldShell label="Caption">
                      <Textarea name="caption" rows={2} defaultValue={asset.caption ?? ""} />
                    </FieldShell>
                    <div className="grid gap-3 md:grid-cols-4">
                      <FieldShell label="Projet">
                        <select name="projectSlug" defaultValue={asset.projectSlug ?? ""} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm">
                          <option value="">Aucun</option>
                          {projects.map((project) => (
                            <option key={project.slug} value={project.slug}>
                              {project.title}
                            </option>
                          ))}
                        </select>
                      </FieldShell>
                      <FieldShell label="Service">
                        <select name="serviceSlug" defaultValue={asset.serviceSlug ?? ""} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm">
                          <option value="">Aucun</option>
                          {services.map((service) => (
                            <option key={service.slug} value={service.slug}>
                              {service.navLabel}
                            </option>
                          ))}
                        </select>
                      </FieldShell>
                      <FieldShell label="Statut">
                        <select name="status" defaultValue={asset.status} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm">
                          <option value="draft">Brouillon</option>
                          <option value="published">Publié</option>
                        </select>
                      </FieldShell>
                      <FieldShell label="Ordre">
                        <Input name="sortOrder" type="number" defaultValue={asset.sortOrder} />
                      </FieldShell>
                    </div>
                    <input name="gallery" type="hidden" value={asset.gallery} />
                    <label className="flex items-center gap-2 text-sm">
                      <input name="featured" type="checkbox" defaultChecked={asset.featured} />
                      Mettre en avant
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <Button type="submit">Enregistrer</Button>
                      <Button type="button" variant="destructive" onClick={() => void deleteAsset(asset.id)}>
                        <Trash2 className="size-4" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            ))}
            {assets.length === 0 ? (
              <div className="rounded-3xl border border-dashed bg-white p-8 text-center text-sm text-muted-foreground">
                Téléversez une première photo chantier pour commencer la médiathèque.
              </div>
            ) : null}
          </div>
        </EditorialPanel>
      </div>
    </div>
  );
}
