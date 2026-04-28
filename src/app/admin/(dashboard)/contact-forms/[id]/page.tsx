import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import mongoose from "mongoose";
import { ArrowLeft, CalendarDays, MessageSquareText, Phone, UserRoundCheck } from "lucide-react";
import { auth } from "@/auth";
import { ContactEmailAction } from "@/components/admin/contact-email-action";
import { AdminMetricCard, AdminPageHeader, EditorialPanel, FieldShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { connectDB } from "@/lib/db";
import { serializeContactSubmission } from "@/lib/cms-content";
import { ContactSubmission } from "@/models/ContactSubmission";

const STATUS_LABELS = {
  new: "Nouveau",
  read: "Lu",
  callback: "À rappeler",
  assigned: "Assigné",
  closed: "Clôturé",
} as const;

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ saved?: string }>;
};

async function getSubmission(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  await connectDB();
  const doc = await ContactSubmission.findById(id);
  return doc ? serializeContactSubmission(doc) : null;
}

async function updateContactSubmission(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const id = String(formData.get("id") ?? "");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid contact submission id");
  }

  const submittedStatuses = formData.getAll("status").filter((value): value is string => typeof value === "string");
  const status = submittedStatuses.at(-1) ?? "read";
  await connectDB();
  await ContactSubmission.findByIdAndUpdate(id, {
    $set: {
      status,
      assignedTo: String(formData.get("assignedTo") ?? "").trim(),
      internalNotes: String(formData.get("internalNotes") ?? "").trim(),
    },
  });
  revalidatePath("/admin/contact-forms");
  revalidatePath(`/admin/contact-forms/${id}`);
  if (status === "closed") {
    redirect("/admin/contact-forms?status=closed");
  }
  redirect(`/admin/contact-forms/${id}?saved=${status}`);
}

function formatDate(value?: string) {
  if (!value) return "Date inconnue";
  return new Intl.DateTimeFormat("fr-TN", { dateStyle: "full", timeStyle: "short" }).format(new Date(value));
}

export default async function AdminContactFormDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const savedStatus = (await searchParams)?.saved;
  const submission = await getSubmission(id);
  if (!submission) {
    notFound();
  }

  const phoneHref = `tel:${submission.phone.replace(/\s/g, "")}`;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Opérations / Contact forms / Détail"
        title={submission.subject}
        description="Fiche complète de la demande contact : coordonnées, message, statut commercial, assignation et notes internes."
        action={{ label: "Retour inbox", href: "/admin/contact-forms" }}
      />

      {savedStatus ? (
        <div className="rounded-3xl border border-primary/25 bg-primary/10 p-4 text-sm text-foreground">
          <p className="font-medium">Suivi enregistré avec succès.</p>
          <p className="mt-1 text-muted-foreground">
            La demande est maintenant marquée comme <span className="font-medium text-foreground">{STATUS_LABELS[submission.status]}</span>.
            Vous pouvez continuer le suivi ou revenir à l'inbox.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <AdminMetricCard icon={MessageSquareText} label="Statut" value={STATUS_LABELS[submission.status]} detail="État du suivi commercial." tone="dark" />
        <AdminMetricCard icon={UserRoundCheck} label="Assigné à" value={submission.assignedTo || "Non assigné"} detail="Responsable du rappel." />
        <AdminMetricCard icon={CalendarDays} label="Reçu" value={formatDate(submission.createdAt).split(" à ")[0]} detail="Horodatage formulaire." tone="orange" />
        <AdminMetricCard icon={Phone} label="Téléphone" value={submission.phone} detail="Contact direct." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <EditorialPanel title="Message client" description="Informations transmises depuis le formulaire public.">
          <div className="rounded-3xl bg-ebm-navy p-5 text-white">
            <div className="flex flex-wrap gap-2">
              <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                {submission.serviceInterest ?? submission.sourcePage}
              </Badge>
              <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                {formatDate(submission.createdAt)}
              </Badge>
            </div>
            <h2 className="font-heading mt-4 text-3xl font-semibold">{submission.name}</h2>
            <p className="mt-2 text-white/70">{submission.email}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldShell label="Nom">
              <Input value={submission.name} readOnly />
            </FieldShell>
            <FieldShell label="Email">
              <Input value={submission.email} readOnly />
            </FieldShell>
            <FieldShell label="Téléphone">
              <Input value={submission.phone} readOnly />
            </FieldShell>
            <FieldShell label="Source">
              <Input value={submission.serviceInterest ?? submission.sourcePage} readOnly />
            </FieldShell>
          </div>

          <FieldShell label="Message">
            <Textarea rows={9} value={submission.message} readOnly />
          </FieldShell>

          <div className="flex flex-wrap gap-2">
            <ContactEmailAction email={submission.email} subject={submission.subject} label="Répondre par email" />
            <Button type="button" variant="outline" asChild>
              <a href={phoneHref}>
                <Phone className="size-4" />
                Appeler
              </a>
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/contact-forms">
                <ArrowLeft className="size-4" />
                Retour à l'inbox
              </Link>
            </Button>
          </div>
        </EditorialPanel>

        <EditorialPanel title="Suivi interne" description="Qualification, assignation et notes visibles uniquement dans l'admin.">
          <form key={submission.id} action={updateContactSubmission} className="space-y-4">
            <input type="hidden" name="id" value={submission.id} />
            <FieldShell label="Statut">
              <select
                name="status"
                defaultValue={submission.status}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </FieldShell>
            <FieldShell label="Assigné à">
              <Input name="assignedTo" defaultValue={submission.assignedTo ?? ""} placeholder="Nom du commercial / équipe" />
            </FieldShell>
            <FieldShell label="Notes internes">
              <Textarea
                name="internalNotes"
                rows={8}
                defaultValue={submission.internalNotes ?? ""}
                placeholder="Historique d'appel, décision, prochaine action..."
              />
            </FieldShell>
            <div className="grid gap-2">
              <Button type="submit">Enregistrer le suivi</Button>
              <Button type="submit" variant="outline" name="status" value="callback">
                Marquer à rappeler
              </Button>
              <Button type="submit" variant="outline" name="status" value="closed">
                Clôturer la demande
              </Button>
            </div>
          </form>
        </EditorialPanel>
      </div>
    </div>
  );
}
