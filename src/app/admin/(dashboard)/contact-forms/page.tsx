import { Inbox, MailOpen, PhoneCall, UserRoundCheck } from "lucide-react";
import { AdminMetricCard, AdminPageHeader, EditorialPanel } from "@/components/admin/admin-ui";
import { ContactFormsInbox } from "@/app/admin/(dashboard)/contact-forms/contact-forms-inbox";
import { listContactSubmissions } from "@/lib/cms-content";

type Props = { searchParams?: Promise<{ status?: string }> };

export default async function AdminContactFormsPage({ searchParams }: Props) {
  const status = (await searchParams)?.status;
  const messages = await listContactSubmissions();
  const newCount = messages.filter((message) => message.status === "new").length;
  const callbackCount = messages.filter((message) => message.status === "callback").length;
  const assignedCount = messages.filter((message) => message.status === "assigned").length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Opérations / Contact forms"
        title="Traiter les demandes entrantes avec le même sérieux que les leads simulateur."
        description="Inbox branchée au formulaire public : recherche, export CSV, réponse email, assignation et fiches détaillées."
      />

      {status === "closed" ? (
        <div className="rounded-3xl border border-primary/25 bg-primary/10 p-4 text-sm text-foreground">
          <p className="font-medium">Demande clôturée.</p>
          <p className="mt-1 text-muted-foreground">
            Le statut a bien été mis à jour et la demande reste disponible dans l'historique de l'inbox.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <AdminMetricCard icon={Inbox} label="Inbox" value={`${messages.length} demandes`} detail="Toutes sources." tone="dark" />
        <AdminMetricCard icon={MailOpen} label="Nouveaux" value={`${newCount} à lire`} detail="Priorité commerciale." />
        <AdminMetricCard icon={PhoneCall} label="Rappels" value={`${callbackCount} à rappeler`} detail="Actions à planifier." tone="orange" />
        <AdminMetricCard icon={UserRoundCheck} label="Assignés" value={`${assignedCount} dossiers`} detail="Suivi équipe." />
      </div>

      <EditorialPanel title="Demandes reçues" description="Sélectionnez des lignes pour exporter, ou ouvrez une fiche pour traiter le dossier.">
        <ContactFormsInbox messages={messages} />
      </EditorialPanel>
    </div>
  );
}
