import Link from "next/link";
import { BadgeDollarSign, Inbox, Ruler, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { BrandedMascotState } from "@/components/brand/mascot-state";
import { AdminMetricCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function formatTnd(value: unknown) {
  return typeof value === "number" ? `${Math.round(value).toLocaleString("fr-TN")} TND` : "—";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getSimulationSummary(simulation: unknown) {
  if (
    !isRecord(simulation) ||
    (simulation.kind !== "advanced" && simulation.kind !== "advanced-wizard") ||
    !isRecord(simulation.project)
  ) {
    return null;
  }

  const project = simulation.project;
  const totals = isRecord(simulation.totals) ? simulation.totals : {};
  const surface = typeof project.surfaceM2 === "number" ? `${project.surfaceM2} m²` : "Surface non précisée";
  const location = typeof project.location === "string" ? project.location : "Emplacement non précisé";
  const offer = typeof project.offer === "string" ? project.offer : "offre";

  return {
    project: `${surface} — ${location}`,
    offer,
    range: `${formatTnd(totals.lowRange)} - ${formatTnd(totals.highRange)}`,
  };
}

export default async function AdminLeadsPage() {
  await auth();
  await connectDB();
  const leads = await Lead.find().sort({ createdAt: -1 }).limit(200).lean();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Opérations / Leads"
        title="Transformer les estimations en opportunités suivies."
        description="Tous les contacts issus du simulateur, avec leur budget, leur surface et les hypothèses utiles pour préparer un rappel commercial précis."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <AdminMetricCard icon={Inbox} label="Volume" value={`${leads.length}`} detail="Derniers leads chargés." tone="dark" />
        <AdminMetricCard icon={Sparkles} label="Origine" value="Simulateur" detail="Demandes qualifiées." />
        <AdminMetricCard icon={Ruler} label="Projet" value="Surface + zone" detail="Critères clés visibles." />
        <AdminMetricCard icon={BadgeDollarSign} label="Budget" value="Fourchette" detail="Estimation TND." tone="orange" />
      </div>

      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Fourchette</TableHead>
              <TableHead className="text-right">Estimation (TND)</TableHead>
              <TableHead className="text-right">Dossier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="p-4">
                  <BrandedMascotState
                    kind="empty"
                    eyebrow="Pipeline"
                    title="Aucun lead pour le moment."
                    description="Les demandes envoyées depuis le simulateur apparaîtront ici avec budget, surface et coordonnées."
                    primaryAction={{ label: "Ouvrir le simulateur", href: "/simulateur" }}
                    variant="inline"
                    className="shadow-none"
                  />
                </TableCell>
              </TableRow>
            ) : (
              leads.map((l) => {
                const summary = getSimulationSummary(l.simulation);

                return (
                  <TableRow key={String(l._id)}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {l.createdAt
                        ? new Date(l.createdAt as string).toLocaleString("fr-FR")
                        : "—"}
                    </TableCell>
                    <TableCell>{l.name}</TableCell>
                    <TableCell>{l.email}</TableCell>
                    <TableCell>{l.phone}</TableCell>
                    <TableCell>
                      {summary ? (
                        <span>
                          {summary.project}
                          <span className="block text-xs text-muted-foreground">{summary.offer}</span>
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                      {summary?.range ?? "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {l.estimateTnd != null ? l.estimateTnd.toLocaleString("fr-TN") : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/leads/${String(l._id)}`}>Voir détails</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
