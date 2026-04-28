import Link from "next/link";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Leads simulateur</h1>
      <div className="rounded-md border bg-card">
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
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  Aucun lead pour le moment.
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
