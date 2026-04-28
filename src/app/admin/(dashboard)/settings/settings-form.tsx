"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ADVANCED_DIVISIONS,
  DEFAULT_ADVANCED_PROJECT,
  LOCATION_ZONE_LABELS,
} from "@/lib/advanced-simulator/defaults";
import {
  calculateAdvancedEstimateTotals,
  createDefaultLineItems,
  formatTnd,
} from "@/lib/advanced-simulator/pricing";
import type { AdvancedProjectInput } from "@/lib/advanced-simulator/types";
import type { SimulatorDecompositionItem, SimulatorSettingsSnapshot } from "@/types/simulator";

type FieldGroupProps = {
  title: string;
  description: string;
  children: ReactNode;
};

function FieldGroup({ title, description, children }: FieldGroupProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</CardContent>
    </Card>
  );
}

function percentValue(value: number) {
  return Number((value * 100).toFixed(2));
}

const UNITS: SimulatorDecompositionItem["unit"][] = ["m²", "ml", "m³", "u", "jour", "forfait", "lot"];
const COST_TYPES: Array<{ value: SimulatorDecompositionItem["costType"]; label: string }> = [
  { value: "material", label: "Matériaux" },
  { value: "labor", label: "Main-d'œuvre" },
  { value: "equipment", label: "Matériel" },
  { value: "subcontractor", label: "Sous-traitance" },
];
const QUANTITY_MODES: Array<{ value: SimulatorDecompositionItem["quantityMode"]; label: string }> = [
  { value: "surface", label: "Surface du projet" },
  { value: "surfaceMultiplier", label: "Surface x coefficient" },
  { value: "fixed", label: "Quantité fixe" },
];
const OFFER_OPTIONS: Array<{ value: SimulatorDecompositionItem["offers"][number]; label: string }> = [
  { value: "grosOeuvre", label: "Gros œuvre" },
  { value: "premium", label: "Premium" },
  { value: "luxe", label: "Luxe" },
];
const SETTINGS_TABS = [
  { id: "base", label: "Base" },
  { id: "decomposition", label: "Décomposition" },
  { id: "options", label: "Options" },
  { id: "marges", label: "Marges" },
  { id: "zones", label: "Zones" },
] as const;
type SettingsTab = (typeof SETTINGS_TABS)[number]["id"];

export function SimulatorSettingsForm() {
  const [data, setData] = useState<SimulatorSettingsSnapshot | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("base");
  const [previewProject, setPreviewProject] = useState<AdvancedProjectInput>(DEFAULT_ADVANCED_PROJECT);

  const preview = useMemo(() => {
    if (!data) return null;
    const lineItems = createDefaultLineItems(previewProject, data);
    const totals = calculateAdvancedEstimateTotals(lineItems, data.advancedMarkups);
    return { lineItems, totals };
  }, [data, previewProject]);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setData)
      .catch(() => toast.error("Chargement impossible."));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setData(await res.json());
      toast.success("Paramètres enregistrés.");
    } catch {
      toast.error("Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  }

  if (!data) {
    return <p className="text-muted-foreground">Chargement…</p>;
  }

  return (
    <form onSubmit={onSubmit} className="max-w-5xl space-y-6">
      <SettingsSnapshot data={data} />

      <div className="flex flex-wrap gap-2 rounded-2xl border bg-card p-2">
        {SETTINGS_TABS.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === "base" ? (
        <>
          <PreviewPanel
            project={previewProject}
            onProjectChange={setPreviewProject}
            total={preview?.totals.total ?? 0}
            directCost={preview?.totals.directCost ?? 0}
            lineCount={preview?.lineItems.length ?? 0}
          />

          <FieldGroup
            title="Base marché"
            description="Le prix au m² agit comme un coefficient global sur les postes de décomposition."
          >
            <NumberField
              label="Prix de base (TND / m²)"
              min={1}
              step={1}
              value={data.baseTndPerM2}
              onChange={(value) => setData({ ...data, baseTndPerM2: value })}
            />
          </FieldGroup>

          <FieldGroup
            title="Offres commerciales"
            description="Les offres filtrent les postes applicables ET appliquent ces multiplicateurs."
          >
            <NumberField
              label="Gros œuvre"
              step={0.01}
              value={data.offerMultipliers.grosOeuvre}
              onChange={(value) =>
                setData({
                  ...data,
                  offerMultipliers: { ...data.offerMultipliers, grosOeuvre: value },
                })
              }
            />
            <NumberField
              label="Clé en main premium"
              step={0.01}
              value={data.offerMultipliers.premium}
              onChange={(value) =>
                setData({
                  ...data,
                  offerMultipliers: { ...data.offerMultipliers, premium: value },
                })
              }
            />
            <NumberField
              label="Clé en main luxe"
              step={0.01}
              value={data.offerMultipliers.luxe}
              onChange={(value) =>
                setData({
                  ...data,
                  offerMultipliers: { ...data.offerMultipliers, luxe: value },
                })
              }
            />
          </FieldGroup>

          <FieldGroup
            title="Structure et style"
            description="Ajustements selon la complexité constructive et le parti architectural."
          >
            <NumberField
              label="Plain-pied"
              step={0.01}
              value={data.typeMultipliers.plainPied}
              onChange={(value) =>
                setData({
                  ...data,
                  typeMultipliers: { ...data.typeMultipliers, plainPied: value },
                })
              }
            />
            <NumberField
              label="R+1"
              step={0.01}
              value={data.typeMultipliers.r1}
              onChange={(value) =>
                setData({ ...data, typeMultipliers: { ...data.typeMultipliers, r1: value } })
              }
            />
            <NumberField
              label="R+2"
              step={0.01}
              value={data.typeMultipliers.r2}
              onChange={(value) =>
                setData({ ...data, typeMultipliers: { ...data.typeMultipliers, r2: value } })
              }
            />
            <NumberField
              label="Style moderne"
              step={0.01}
              value={data.styleMultipliers.moderne}
              onChange={(value) =>
                setData({
                  ...data,
                  styleMultipliers: { ...data.styleMultipliers, moderne: value },
                })
              }
            />
            <NumberField
              label="Style méditerranéen"
              step={0.01}
              value={data.styleMultipliers.mediterraneenne}
              onChange={(value) =>
                setData({
                  ...data,
                  styleMultipliers: { ...data.styleMultipliers, mediterraneenne: value },
                })
              }
            />
          </FieldGroup>
        </>
      ) : null}

      {activeTab === "decomposition" ? (
        <DecompositionEditor
          items={data.decompositionItems}
          previewSurfaceM2={previewProject.surfaceM2}
          onChange={(items) => setData({ ...data, decompositionItems: items })}
        />
      ) : null}

      {activeTab === "options" ? (
        <>
          <FieldGroup
            title="Options projet"
            description="Coefficients historiques conservés pour compatibilité avec l'ancien calcul."
          >
            <PercentField
              label="Piscine"
              value={data.optionAdds.pool}
              onChange={(value) => setData({ ...data, optionAdds: { ...data.optionAdds, pool: value } })}
            />
            <PercentField
              label="Sous-sol / garage"
              value={data.optionAdds.basement}
              onChange={(value) =>
                setData({ ...data, optionAdds: { ...data.optionAdds, basement: value } })
              }
            />
            <PercentField
              label="Jardin / clôtures"
              value={data.optionAdds.garden}
              onChange={(value) =>
                setData({ ...data, optionAdds: { ...data.optionAdds, garden: value } })
              }
            />
          </FieldGroup>

          <FieldGroup
            title="Options avec surfaces"
            description="Prix unitaires utilisés lorsque le visiteur choisit une piscine, un garage enterré ou un jardin."
          >
            <NumberField
              label="Piscine (TND / m²)"
              min={0}
              step={10}
              value={data.optionUnitPrices.poolTndPerM2}
              hint="Bassin, équipements et local technique."
              onChange={(value) =>
                setData({
                  ...data,
                  optionUnitPrices: { ...data.optionUnitPrices, poolTndPerM2: value },
                })
              }
            />
            <NumberField
              label="Sous-sol / garage (TND / m²)"
              min={0}
              step={10}
              value={data.optionUnitPrices.basementTndPerM2}
              hint="Structure enterrée, excavation et étanchéité."
              onChange={(value) =>
                setData({
                  ...data,
                  optionUnitPrices: { ...data.optionUnitPrices, basementTndPerM2: value },
                })
              }
            />
            <NumberField
              label="Jardin / clôtures (TND / m²)"
              min={0}
              step={10}
              value={data.optionUnitPrices.gardenTndPerM2}
              hint="Aménagement paysager, clôtures et cheminements."
              onChange={(value) =>
                setData({
                  ...data,
                  optionUnitPrices: { ...data.optionUnitPrices, gardenTndPerM2: value },
                })
              }
            />
          </FieldGroup>
        </>
      ) : null}

      {activeTab === "marges" ? (
        <FieldGroup
          title="Marges avancées"
          description="Taux utilisés dans le résumé détaillé du devis public."
        >
          <PercentField
            label="Frais généraux"
            value={data.advancedMarkups.overhead}
            onChange={(value) =>
              setData({ ...data, advancedMarkups: { ...data.advancedMarkups, overhead: value } })
            }
          />
          <PercentField
            label="Marge"
            value={data.advancedMarkups.profit}
            onChange={(value) =>
              setData({ ...data, advancedMarkups: { ...data.advancedMarkups, profit: value } })
            }
          />
          <PercentField
            label="Imprévus"
            value={data.advancedMarkups.contingency}
            onChange={(value) =>
              setData({ ...data, advancedMarkups: { ...data.advancedMarkups, contingency: value } })
            }
          />
          <PercentField
            label="Taxe matériaux"
            value={data.advancedMarkups.tax}
            onChange={(value) =>
              setData({ ...data, advancedMarkups: { ...data.advancedMarkups, tax: value } })
            }
          />
        </FieldGroup>
      ) : null}

      {activeTab === "zones" ? (
        <FieldGroup
          title="Zones tunisiennes"
          description="Facteurs appliqués selon l'emplacement du projet."
        >
          {(Object.keys(data.locationMultipliers) as Array<keyof SimulatorSettingsSnapshot["locationMultipliers"]>).map(
            (zone) => (
              <NumberField
                key={zone}
                label={LOCATION_ZONE_LABELS[zone]}
                step={0.01}
                value={data.locationMultipliers[zone]}
                onChange={(value) =>
                  setData({
                    ...data,
                    locationMultipliers: { ...data.locationMultipliers, [zone]: value },
                  })
                }
              />
            ),
          )}
        </FieldGroup>
      ) : null}

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-2xl border bg-background/95 p-4 shadow-lg backdrop-blur">
        <p className="text-sm text-muted-foreground">
          Ces paramètres alimentent le simulateur public et les détails envoyés dans les leads.
        </p>
        <Button type="submit" disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer les paramètres"}
        </Button>
      </div>
    </form>
  );
}

function DecompositionEditor({
  items,
  previewSurfaceM2,
  onChange,
}: {
  items: SimulatorDecompositionItem[];
  previewSurfaceM2: number;
  onChange: (items: SimulatorDecompositionItem[]) => void;
}) {
  function updateItem(id: string, updates: Partial<SimulatorDecompositionItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }

  function addItem() {
    onChange([
      ...items,
      {
        id: `custom-${Date.now()}`,
        enabled: true,
        divisionId: "structure",
        description: "Nouveau poste de travaux",
        unit: "m²",
        costType: "material",
        quantityMode: "surface",
        quantityValue: 1,
        unitCostTnd: 0,
        offers: ["premium", "luxe"],
      },
    ]);
  }

  return (
    <Card className="border-ebm-navy/15">
      <CardHeader className="bg-ebm-navy text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle>Décomposition de l'estimation</CardTitle>
            <CardDescription className="text-white/70">
              Ces postes et prix unitaires génèrent le détail reçu dans chaque lead et le total du simulateur.
            </CardDescription>
          </div>
          <Button type="button" onClick={addItem}>
            Ajouter un poste
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-2xl border bg-background p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-3">
                <Checkbox
                  checked={item.enabled}
                  onCheckedChange={(checked) => updateItem(item.id, { enabled: Boolean(checked) })}
                />
                <span className="font-medium">Poste {index + 1}</span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  Total aperçu: {formatTnd(getDecompositionPreviewTotal(item, previewSurfaceM2))}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={items.length <= 1}
                  onClick={() => onChange(items.filter((candidate) => candidate.id !== item.id))}
                >
                  Supprimer
                </Button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-6">
              <div className="space-y-2 lg:col-span-2">
                <Label>Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, { description: e.target.value })}
                />
              </div>
              <SelectField
                label="Division"
                value={item.divisionId}
                options={ADVANCED_DIVISIONS.map((division) => ({
                  value: division.id,
                  label: division.name,
                }))}
                onChange={(divisionId) => updateItem(item.id, { divisionId })}
              />
              <SelectField
                label="Type coût"
                value={item.costType}
                options={COST_TYPES}
                onChange={(costType) =>
                  updateItem(item.id, { costType: costType as SimulatorDecompositionItem["costType"] })
                }
              />
              <SelectField
                label="Unité"
                value={item.unit}
                options={UNITS.map((unit) => ({ value: unit, label: unit }))}
                onChange={(unit) => updateItem(item.id, { unit: unit as SimulatorDecompositionItem["unit"] })}
              />
              <NumberField
                label="Prix unitaire TND"
                min={0}
                step={1}
                value={item.unitCostTnd}
                onChange={(unitCostTnd) => updateItem(item.id, { unitCostTnd })}
              />
              <SelectField
                label="Quantité"
                value={item.quantityMode}
                options={QUANTITY_MODES}
                onChange={(quantityMode) =>
                  updateItem(item.id, {
                    quantityMode: quantityMode as SimulatorDecompositionItem["quantityMode"],
                  })
                }
              />
              <NumberField
                label={item.quantityMode === "surfaceMultiplier" ? "Coefficient surface" : "Quantité"}
                min={0}
                step={item.quantityMode === "surfaceMultiplier" ? 0.01 : 1}
                value={item.quantityValue}
                hint={
                  item.quantityMode === "surface"
                    ? "Utilise automatiquement la surface saisie par le visiteur."
                    : undefined
                }
                onChange={(quantityValue) => updateItem(item.id, { quantityValue })}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {OFFER_OPTIONS.map((offer) => {
                const active = item.offers.includes(offer.value);
                return (
                  <Button
                    key={offer.value}
                    type="button"
                    variant={active ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const offers = active
                        ? item.offers.filter((value) => value !== offer.value)
                        : [...item.offers, offer.value];
                      updateItem(item.id, { offers: offers.length > 0 ? offers : [offer.value] });
                    }}
                  >
                    {offer.label}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function getDecompositionPreviewTotal(item: SimulatorDecompositionItem, surfaceM2: number) {
  const quantity =
    item.quantityMode === "fixed"
      ? item.quantityValue
      : item.quantityMode === "surfaceMultiplier"
        ? surfaceM2 * item.quantityValue
        : surfaceM2;
  return Math.max(0, quantity) * item.unitCostTnd;
}

function PreviewPanel({
  project,
  onProjectChange,
  total,
  directCost,
  lineCount,
}: {
  project: AdvancedProjectInput;
  onProjectChange: (project: AdvancedProjectInput) => void;
  total: number;
  directCost: number;
  lineCount: number;
}) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle>Aperçu estimateur</CardTitle>
        <CardDescription>
          Testez les paramètres actuels avant d&apos;enregistrer. Le calcul utilise les mêmes fonctions que le
          simulateur public.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField
            label="Surface aperçu (m²)"
            min={80}
            step={10}
            value={project.surfaceM2}
            onChange={(surfaceM2) => onProjectChange({ ...project, surfaceM2 })}
          />
          <SelectField
            label="Offre"
            value={project.offer}
            options={OFFER_OPTIONS}
            onChange={(offer) =>
              onProjectChange({
                ...project,
                offer: offer as AdvancedProjectInput["offer"],
              })
            }
          />
          <SelectField
            label="Type"
            value={project.buildType}
            options={[
              { value: "plainPied", label: "Plain-pied" },
              { value: "r1", label: "R+1" },
              { value: "r2", label: "R+2" },
            ]}
            onChange={(buildType) =>
              onProjectChange({
                ...project,
                buildType: buildType as AdvancedProjectInput["buildType"],
              })
            }
          />
          <SelectField
            label="Zone"
            value={project.zone}
            options={Object.entries(LOCATION_ZONE_LABELS).map(([value, label]) => ({ value, label }))}
            onChange={(zone) =>
              onProjectChange({
                ...project,
                zone: zone as AdvancedProjectInput["zone"],
              })
            }
          />
        </div>
        <div className="rounded-3xl bg-ebm-navy p-5 text-white">
          <p className="text-sm text-white/60">Total aperçu</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{formatTnd(total)}</p>
          <p className="mt-3 text-sm text-white/65">
            Direct: {formatTnd(directCost)} • {lineCount} postes
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <select
        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SettingsSnapshot({ data }: { data: SimulatorSettingsSnapshot }) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Tableau de bord tarification</CardTitle>
            <CardDescription>
              Ajustez les grandes hypothèses sans toucher au code. Les surfaces optionnelles sont demandées
              au visiteur uniquement lorsqu'elles sont utiles.
            </CardDescription>
          </div>
          <Badge>Marché tunisien</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat label="Base" value={`${data.baseTndPerM2.toLocaleString("fr-TN")} TND / m²`} />
        <MiniStat label="Premium" value={`x${data.offerMultipliers.premium}`} />
        <MiniStat label="Piscine" value={`${data.optionUnitPrices.poolTndPerM2.toLocaleString("fr-TN")} TND / m²`} />
        <MiniStat label="Marge + imprévus" value={`${percentValue(data.advancedMarkups.profit + data.advancedMarkups.contingency)}%`} />
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold tabular-nums">{value}</p>
    </div>
  );
}

type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
  hint?: string;
};

function NumberField({ label, value, onChange, min = 0, step = 0.01, hint }: NumberFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
      />
      {hint ? <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function PercentField({ label, value, onChange }: NumberFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label} (%)</Label>
      <Input
        type="number"
        min={0}
        step={0.1}
        value={percentValue(value)}
        onChange={(e) => onChange((Number.parseFloat(e.target.value) || 0) / 100)}
      />
    </div>
  );
}
