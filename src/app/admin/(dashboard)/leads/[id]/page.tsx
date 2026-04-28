import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Mail, MapPin, Phone, Ruler, Sparkles } from "lucide-react";
import { isValidObjectId } from "mongoose";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ADVANCED_DIVISIONS } from "@/lib/advanced-simulator/defaults";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

type DisplayRow = {
  label: string;
  value: string;
};

const DIVISION_LABELS = Object.fromEntries(
  ADVANCED_DIVISIONS.map((division) => [division.id, division.name]),
);

const COST_TYPE_LABELS: Record<string, string> = {
  material: "Matériaux",
  labor: "Main-d'œuvre",
  equipment: "Matériel",
  subcontractor: "Sous-traitance",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function formatTnd(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? `${Math.round(value).toLocaleString("fr-TN")} TND`
    : "—";
}

function formatDate(value: unknown) {
  return value ? new Date(value as string).toLocaleString("fr-FR") : "—";
}

function stringifyValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value.toLocaleString("fr-TN") : "—";
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (value == null) return "—";
  return JSON.stringify(value);
}

function getNestedRecord(parent: Record<string, unknown>, key: string) {
  const value = parent[key];
  return isRecord(value) ? value : {};
}

function getProjectRows(project: Record<string, unknown>): DisplayRow[] {
  const options = getNestedRecord(project, "options");
  const optionSurfaces = getNestedRecord(project, "optionSurfaces");

  return [
    { label: "Style architectural", value: stringifyValue(project.style) },
    { label: "Type de construction", value: stringifyValue(project.buildType) },
    { label: "Offre", value: stringifyValue(project.offer) },
    { label: "Surface à bâtir", value: `${stringifyValue(project.surfaceM2)} m²` },
    { label: "Emplacement", value: stringifyValue(project.location) },
    { label: "Zone tarifaire", value: stringifyValue(project.zone) },
    { label: "Titre foncier", value: project.terrain === "oui" ? "Disponible" : "En cours" },
    { label: "Piscine", value: options.pool ? `${stringifyValue(optionSurfaces.poolM2)} m²` : "Non" },
    { label: "Sous-sol / garage", value: options.basement ? `${stringifyValue(optionSurfaces.basementM2)} m²` : "Non" },
    { label: "Jardin / clôtures", value: options.garden ? `${stringifyValue(optionSurfaces.gardenM2)} m²` : "Non" },
  ];
}

function getLineItems(simulation: Record<string, unknown>) {
  const value = simulation.lineItems;
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function getMarkupsRows(markups: Record<string, unknown>): DisplayRow[] {
  return [
    { label: "Frais généraux", value: percentValue(markups.overhead) },
    { label: "Marge", value: percentValue(markups.profit) },
    { label: "Imprévus", value: percentValue(markups.contingency) },
    { label: "Taxe matériaux", value: percentValue(markups.tax) },
  ];
}

function percentValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : "—";
}

function snapshotValue(value: unknown) {
  const formatted = stringifyValue(value);
  return formatted === "—" ? "Non enregistré (ancien lead)" : formatted;
}

function snapshotTnd(value: unknown) {
  const formatted = formatTnd(value);
  return formatted === "—" ? "Non enregistré (ancien lead)" : formatted;
}

function snapshotPercent(value: unknown) {
  const formatted = percentValue(value);
  return formatted === "—" ? "Non enregistré (ancien lead)" : formatted;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  await auth();

  if (!isValidObjectId(id)) {
    notFound();
  }

  await connectDB();
  const lead = await Lead.findById(id).lean();
  if (!lead) {
    notFound();
  }

  const simulation = isRecord(lead.simulation) ? lead.simulation : {};
  const project = getNestedRecord(simulation, "project");
  const totals = getNestedRecord(simulation, "totals");
  const markups = getNestedRecord(simulation, "markups");
  const settingsSnapshot = isRecord(lead.settingsSnapshot)
    ? lead.settingsSnapshot
    : isRecord(simulation.settingsSnapshot)
      ? simulation.settingsSnapshot
      : {};
  const snapshotAdvancedMarkups = getNestedRecord(settingsSnapshot, "advancedMarkups");
  const snapshotOfferMultipliers = getNestedRecord(settingsSnapshot, "offerMultipliers");
  const snapshotLocationMultipliers = getNestedRecord(settingsSnapshot, "locationMultipliers");
  const snapshotOptionUnitPrices = getNestedRecord(settingsSnapshot, "optionUnitPrices");
  const lineItems = getLineItems(simulation);
  const projectRows = getProjectRows(project);
  const markupRows = getMarkupsRows(markups);
  const notes = typeof simulation.notes === "string" && simulation.notes.trim() ? simulation.notes : "—";

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/admin/leads">
          <ArrowLeft className="size-4" />
          Retour aux leads
        </Link>
      </Button>

      <section className="overflow-hidden rounded-[2rem] border bg-ebm-navy text-white shadow-xl">
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 translate-x-16 -translate-y-20 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-72 translate-y-16 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <Badge className="mb-4 bg-primary text-primary-foreground">
                <Sparkles className="size-3" />
                Dossier simulateur complet
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{lead.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                Toutes les réponses du visiteur, les hypothèses générées et les postes de prix calculés pour
                préparer le rappel commercial.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/75">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  <Mail className="size-4" />
                  {lead.email}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  <Phone className="size-4" />
                  {lead.phone}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  <CalendarDays className="size-4" />
                  {formatDate(lead.createdAt)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  Version prix: {lead.pricingVersion ?? stringifyValue(simulation.pricingVersion)}
                </span>
              </div>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-white/65">Estimation transmise</p>
              <p className="mt-2 text-4xl font-semibold tabular-nums">{formatTnd(lead.estimateTnd)}</p>
              <p className="mt-2 text-sm text-white/65">
                Fourchette : {formatTnd(totals.lowRange)} - {formatTnd(totals.highRange)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={Ruler} label="Surface" value={`${stringifyValue(project.surfaceM2)} m²`} />
        <MetricCard icon={MapPin} label="Emplacement" value={stringifyValue(project.location)} />
        <MetricCard icon={Sparkles} label="Offre" value={stringifyValue(project.offer)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Réponses du simulateur</CardTitle>
            <CardDescription>Tout ce que le visiteur a saisi ou sélectionné.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {projectRows.map((row) => (
              <InfoTile key={row.label} label={row.label} value={row.value} />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coordonnées</CardTitle>
              <CardDescription>Données de contact reçues avec la demande.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoTile label="Nom" value={lead.name} />
              <InfoTile label="Email" value={lead.email} />
              <InfoTile label="Téléphone" value={lead.phone} />
              <InfoTile label="Contacté" value={lead.contacted ? "Oui" : "Non"} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Version tarification</CardTitle>
              <CardDescription>Conservée avec le lead pour expliquer les anciens devis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoTile
                label="Version"
                value={lead.pricingVersion ?? snapshotValue(simulation.pricingVersion)}
              />
              <InfoTile label="Base TND / m²" value={snapshotTnd(settingsSnapshot.baseTndPerM2)} />
              <InfoTile label="Premium" value={`x${snapshotValue(snapshotOfferMultipliers.premium)}`} />
              <InfoTile label="Luxe" value={`x${snapshotValue(snapshotOfferMultipliers.luxe)}`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes client</CardTitle>
              <CardDescription>Précisions libres envoyées depuis le formulaire.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="rounded-2xl border bg-muted/40 p-4 text-sm leading-relaxed">{notes}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Décomposition de l&apos;estimation</CardTitle>
          <CardDescription>Lignes techniques générées en arrière-plan depuis les paramètres du dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          {lineItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Poste</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead>Unité</TableHead>
                  <TableHead className="text-right">Prix unitaire</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item, index) => {
                  const quantity = typeof item.quantity === "number" ? item.quantity : 0;
                  const unitCost = typeof item.unitCostTnd === "number" ? item.unitCostTnd : 0;
                  return (
                    <TableRow key={`${stringifyValue(item.id)}-${index}`}>
                      <TableCell className="min-w-64 font-medium">{stringifyValue(item.description)}</TableCell>
                      <TableCell>{DIVISION_LABELS[stringifyValue(item.divisionId)] ?? stringifyValue(item.divisionId)}</TableCell>
                      <TableCell>{COST_TYPE_LABELS[stringifyValue(item.costType)] ?? stringifyValue(item.costType)}</TableCell>
                      <TableCell className="text-right tabular-nums">{quantity.toLocaleString("fr-TN")}</TableCell>
                      <TableCell>{stringifyValue(item.unit)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatTnd(unitCost)}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatTnd(quantity * unitCost)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune ligne technique enregistrée.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Totaux calculés</CardTitle>
            <CardDescription>Résumé financier complet reçu avec le lead.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <InfoTile label="Coûts directs" value={formatTnd(totals.directCost)} />
            <InfoTile label="Matériaux" value={formatTnd(totals.materialSubtotal)} />
            <InfoTile label="Main-d'œuvre" value={formatTnd(totals.laborSubtotal)} />
            <InfoTile label="Matériel" value={formatTnd(totals.equipmentSubtotal)} />
            <InfoTile label="Sous-traitance" value={formatTnd(totals.subcontractorSubtotal)} />
            <InfoTile label="Frais généraux" value={formatTnd(totals.overhead)} />
            <InfoTile label="Marge" value={formatTnd(totals.profit)} />
            <InfoTile label="Imprévus" value={formatTnd(totals.contingency)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hypothèses appliquées</CardTitle>
            <CardDescription>Marges et paramètres sauvegardés au moment de la demande.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {markupRows.map((row) => (
                <InfoTile key={row.label} label={row.label} value={row.value} />
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoTile label="Grand Tunis" value={`x${snapshotValue(snapshotLocationMultipliers.grandTunis)}`} />
              <InfoTile label="Zones côtières" value={`x${snapshotValue(snapshotLocationMultipliers.coastal)}`} />
              <InfoTile label="Piscine / m²" value={snapshotTnd(snapshotOptionUnitPrices.poolTndPerM2)} />
              <InfoTile label="Garage enterré / m²" value={snapshotTnd(snapshotOptionUnitPrices.basementTndPerM2)} />
              <InfoTile label="Jardin / m²" value={snapshotTnd(snapshotOptionUnitPrices.gardenTndPerM2)} />
              <InfoTile label="Marge snapshot" value={snapshotPercent(snapshotAdvancedMarkups.profit)} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Ruler;
  label: string;
  value: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoTile({ label, value }: DisplayRow) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 wrap-break-word font-medium">{value}</p>
    </div>
  );
}
