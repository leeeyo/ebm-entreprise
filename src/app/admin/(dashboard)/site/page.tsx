import { revalidatePath } from "next/cache";
import { Clock, Globe2, Mail, MapPin, Phone, Settings, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { AdminMetricCard, AdminPageHeader, EditorialPanel, FieldShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ensureSiteSettings, splitCsv, splitLines } from "@/lib/cms-content";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";

async function saveSiteSettings(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await connectDB();
  await SiteSettings.findOneAndUpdate(
    { key: "default" },
    {
      $set: {
        addressLine: String(formData.get("addressLine") ?? "").trim(),
        addressShort: String(formData.get("addressShort") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        phoneDisplay: String(formData.get("phoneDisplay") ?? "").trim(),
        phoneHref: String(formData.get("phoneHref") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        hoursTitle: String(formData.get("hoursTitle") ?? "").trim(),
        hoursWeek: String(formData.get("hoursWeek") ?? "").trim(),
        hoursWeekend: String(formData.get("hoursWeekend") ?? "").trim(),
        footerMessage: String(formData.get("footerMessage") ?? "").trim(),
        seoTitle: String(formData.get("seoTitle") ?? "").trim(),
        seoDescription: String(formData.get("seoDescription") ?? "").trim(),
        seoKeywords: splitCsv(String(formData.get("seoKeywords") ?? "")),
        reassuranceItems: splitLines(String(formData.get("reassuranceItems") ?? "")),
      },
    },
    { upsert: true },
  );
  revalidatePath("/admin/site");
  revalidatePath("/contact");
}

export default async function AdminSiteSettingsPage() {
  const settings = await ensureSiteSettings();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Website settings / Site global"
        title="Centraliser les informations de confiance du site."
        description="Coordonnées, horaires, textes globaux, SEO par défaut et messages de réassurance maintenant persistés en base."
        action={{ label: "Paramètres actifs" }}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <AdminMetricCard icon={MapPin} label="Adresse" value={settings.addressShort} detail="Siège public." tone="dark" />
        <AdminMetricCard icon={Phone} label="Téléphone" value={settings.phone} detail="CTA principal." />
        <AdminMetricCard icon={Clock} label="Horaires" value="08:30-17:00" detail={settings.hoursTitle} />
        <AdminMetricCard icon={Globe2} label="SEO" value="Defaults" detail="Meta globales." tone="orange" />
      </div>

      <form action={saveSiteSettings} className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <EditorialPanel title="Coordonnées EBM" description="Champs globaux à réutiliser dans header, footer, contact et CTA.">
          <div className="grid gap-4 md:grid-cols-2">
            <FieldShell label="Adresse">
              <Input name="addressLine" defaultValue={settings.addressLine} />
            </FieldShell>
            <FieldShell label="Adresse courte">
              <Input name="addressShort" defaultValue={settings.addressShort} />
            </FieldShell>
            <FieldShell label="Téléphone principal">
              <Input name="phone" defaultValue={settings.phone} />
            </FieldShell>
            <FieldShell label="Email">
              <Input name="email" defaultValue={settings.email} />
            </FieldShell>
            <FieldShell label="WhatsApp / mobile">
              <Input name="phoneDisplay" defaultValue={settings.phoneDisplay} />
            </FieldShell>
            <FieldShell label="Href téléphone">
              <Input name="phoneHref" defaultValue={settings.phoneHref} />
            </FieldShell>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <FieldShell label="Titre horaires">
              <Input name="hoursTitle" defaultValue={settings.hoursTitle} />
            </FieldShell>
            <FieldShell label="Semaine">
              <Input name="hoursWeek" defaultValue={settings.hoursWeek} />
            </FieldShell>
            <FieldShell label="Week-end">
              <Input name="hoursWeekend" defaultValue={settings.hoursWeekend} />
            </FieldShell>
          </div>
          <FieldShell label="Message footer">
            <Textarea
              name="footerMessage"
              rows={4}
              defaultValue={settings.footerMessage}
            />
          </FieldShell>
        </EditorialPanel>

        <div className="space-y-6">
          <EditorialPanel title="SEO par défaut" description="Base utilisée lorsque les pages n'ont pas encore de meta spécifiques.">
            <FieldShell label="Titre site">
              <Input name="seoTitle" defaultValue={settings.seoTitle} />
            </FieldShell>
            <FieldShell label="Meta description">
              <Textarea
                name="seoDescription"
                rows={4}
                defaultValue={settings.seoDescription}
              />
            </FieldShell>
            <FieldShell label="Mots-clés prioritaires">
              <Input name="seoKeywords" defaultValue={settings.seoKeywords.join(", ")} />
            </FieldShell>
          </EditorialPanel>

          <EditorialPanel title="Réassurance globale" description="Messages courts réutilisables dans les CTA du site.">
            <div className="space-y-3">
              {settings.reassuranceItems.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border bg-white p-4">
                  <ShieldCheck className="size-5 text-primary" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
            <FieldShell label="Messages de réassurance" hint="Un message par ligne.">
              <Textarea name="reassuranceItems" rows={4} defaultValue={settings.reassuranceItems.join("\n")} />
            </FieldShell>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary text-primary-foreground">
                <Settings className="size-3" />
                Branché
              </Badge>
              <Button type="submit" variant="outline">
                <Mail className="size-4" />
                Enregistrer les paramètres
              </Button>
            </div>
          </EditorialPanel>
        </div>
      </form>
    </div>
  );
}
