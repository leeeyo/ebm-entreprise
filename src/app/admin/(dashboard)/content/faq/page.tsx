import { revalidatePath } from "next/cache";
import { FileQuestion, GripVertical, MessageCircleQuestion, Plus, Search, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { AdminMetricCard, AdminPageHeader, EditorialPanel, FieldShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { listFaqEntries, splitCsv } from "@/lib/cms-content";
import { connectDB } from "@/lib/db";
import { FaqEntry } from "@/models/FaqEntry";

async function saveFaq(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await connectDB();
  const id = String(formData.get("id") ?? "");
  const payload = {
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    targetPage: String(formData.get("targetPage") ?? "").trim(),
    keywords: splitCsv(String(formData.get("keywords") ?? "")),
    status: formData.get("status") === "draft" ? "draft" : "published",
  };
  if (id) {
    await FaqEntry.findByIdAndUpdate(id, { $set: payload });
  } else {
    await FaqEntry.create(payload);
  }
  revalidatePath("/admin/content/faq");
}

export default async function AdminFaqContentPage() {
  const faqs = await listFaqEntries();
  const selected = faqs[0];
  const publishedCount = faqs.filter((faq) => faq.status === "published").length;
  const pagesCount = new Set(faqs.map((faq) => faq.targetPage).filter(Boolean)).size;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Website settings / FAQ"
        title="Réduire les hésitations avant le devis."
        description="Questions fréquentes branchées à MongoDB, rattachées aux pages publiques et réutilisables par l'équipe commerciale."
        action={{ label: "Nouvelle question" }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard icon={FileQuestion} label="Questions" value={`${faqs.length} entrées`} detail="Base FAQ active." tone="dark" />
        <AdminMetricCard icon={ShieldCheck} label="Réassurance" value={`${publishedCount} publiées`} detail="Réponses visibles public." />
        <AdminMetricCard icon={MessageCircleQuestion} label="Pages liées" value={`${pagesCount} pages`} detail="Services, projets, simulateur." tone="orange" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <EditorialPanel title="Base de questions" description="Recherche, statut et rattachement éditorial.">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Rechercher une question..." />
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="flex gap-3 rounded-2xl border bg-white p-4">
                <GripVertical className="mt-1 size-4 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{faq.question}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{faq.category}</p>
                </div>
                <Badge variant="outline">{faq.status === "published" ? "Publié" : "Brouillon"}</Badge>
              </div>
            ))}
          </div>
        </EditorialPanel>

        <EditorialPanel title="Éditeur FAQ" description="Champs compatibles avec une future collection FAQ.">
          <form action={saveFaq} className="space-y-4">
            <input type="hidden" name="id" value={selected?.id ?? ""} />
            <FieldShell label="Question">
              <Input name="question" defaultValue={selected?.question ?? "Quel est le prix de construction au m² en Tunisie ?"} />
            </FieldShell>
            <FieldShell label="Réponse">
              <Textarea
                name="answer"
                rows={7}
                defaultValue={selected?.answer ?? "Le prix dépend de la surface, de la structure, du niveau de finition et de l'emplacement. Le simulateur EBM donne une première fourchette, puis l'équipe affine le devis après étude du terrain et du programme."}
              />
            </FieldShell>
            <div className="grid gap-4 md:grid-cols-3">
              <FieldShell label="Catégorie">
                <Input name="category" defaultValue={selected?.category ?? "Simulateur"} />
              </FieldShell>
              <FieldShell label="Page cible">
                <Input name="targetPage" defaultValue={selected?.targetPage ?? "/simulateur"} />
              </FieldShell>
              <FieldShell label="Statut">
                <select name="status" defaultValue={selected?.status ?? "published"} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm">
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                </select>
              </FieldShell>
            </div>
            <FieldShell label="Mots-clés SEO">
              <Input name="keywords" defaultValue={selected?.keywords.join(", ") ?? "prix construction m² Tunisie, devis villa, estimation BTP"} />
            </FieldShell>
            <div className="flex flex-wrap gap-2">
              <Button type="submit">
                <Plus className="size-4" />
                Enregistrer la FAQ
              </Button>
              <Button type="button" variant="outline">Prévisualiser sur page</Button>
            </div>
          </form>
        </EditorialPanel>
      </div>
    </div>
  );
}
