"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { BrandedMascotState } from "@/components/brand/mascot-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_ADVANCED_PROJECT,
  LOCATION_OPTIONS,
  LOCATION_ZONE_LABELS,
} from "@/lib/advanced-simulator/defaults";
import {
  calculateAdvancedEstimateTotals,
  createDefaultLineItems,
  formatTnd,
} from "@/lib/advanced-simulator/pricing";
import type { AdvancedProjectInput } from "@/lib/advanced-simulator/types";
import { calculateCta, offerCards, simulateurPage, styleCards, typeCards } from "@/content/simulateur";
import { cn } from "@/lib/utils";
import type { SimulatorSettingsSnapshot } from "@/types/simulator";

const STEPS = [
  "Projet",
  simulateurPage.steps.dimensions,
  simulateurPage.steps.offre,
  simulateurPage.steps.equipements,
  simulateurPage.steps.resultat,
];

const MIN_SURFACE_M2 = 80;
const MAX_SURFACE_M2 = 1000;
const STORAGE_KEY = "ebm-simulateur-progress-v2";

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

type StoredProgress = {
  step?: number;
  project?: Partial<AdvancedProjectInput>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function restoreProject(value: unknown): AdvancedProjectInput {
  if (!isRecord(value)) return DEFAULT_ADVANCED_PROJECT;

  const options = isRecord(value.options) ? value.options : {};
  const optionSurfaces = isRecord(value.optionSurfaces) ? value.optionSurfaces : {};

  return {
    ...DEFAULT_ADVANCED_PROJECT,
    ...value,
    surfaceM2: clampNumber(Number(value.surfaceM2), MIN_SURFACE_M2, MAX_SURFACE_M2),
    options: {
      pool: Boolean(options.pool),
      basement: Boolean(options.basement),
      garden: Boolean(options.garden),
    },
    optionSurfaces: {
      poolM2: Math.max(1, Number(optionSurfaces.poolM2) || DEFAULT_ADVANCED_PROJECT.optionSurfaces.poolM2),
      basementM2: Math.max(
        1,
        Number(optionSurfaces.basementM2) || DEFAULT_ADVANCED_PROJECT.optionSurfaces.basementM2,
      ),
      gardenM2: Math.max(1, Number(optionSurfaces.gardenM2) || DEFAULT_ADVANCED_PROJECT.optionSurfaces.gardenM2),
    },
  };
}

export function AdvancedSimulator() {
  const [settings, setSettings] = useState<SimulatorSettingsSnapshot | null>(null);
  const [step, setStep] = useState(0);
  const [project, setProject] = useState<AdvancedProjectInput>(DEFAULT_ADVANCED_PROJECT);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [estimateRevealed, setEstimateRevealed] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [serverEstimateTnd, setServerEstimateTnd] = useState<number | null>(null);
  const [progressRestored, setProgressRestored] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredProgress;
        setStep(clampNumber(Number(parsed.step), 0, STEPS.length - 1));
        setProject(restoreProject(parsed.project));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setProgressRestored(true);
  }, []);

  useEffect(() => {
    if (!progressRestored) return;
    const payload: StoredProgress = {
      step,
      project,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [progressRestored, project, step]);

  useEffect(() => {
    fetch("/api/simulator/settings")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((snapshot: SimulatorSettingsSnapshot) => setSettings(snapshot))
      .catch(() => toast.error("Impossible de charger les paramètres du simulateur."));
  }, []);

  const lineItems = useMemo(
    () => (settings ? createDefaultLineItems(project, settings) : []),
    [project, settings],
  );
  const totals = useMemo(
    () =>
      calculateAdvancedEstimateTotals(
        lineItems,
        settings?.advancedMarkups ?? { overhead: 0, profit: 0, contingency: 0, tax: 0 },
      ),
    [lineItems, settings],
  );
  const contactIsComplete = name.trim().length > 1 && email.includes("@") && phone.trim().length >= 5;

  async function submitLead(e: FormEvent) {
    e.preventDefault();
    if (submittedLeadId && estimateRevealed) {
      toast.message("Votre demande est déjà enregistrée.");
      return;
    }
    if (!contactIsComplete) {
      toast.error("Complétez vos coordonnées pour recevoir l'estimation.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          simulation: {
            kind: "advanced-wizard",
            project,
            notes,
          },
        }),
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      if (typeof result.id === "string") {
        setSubmittedLeadId(result.id);
      }
      if (typeof result.estimateTnd === "number") {
        setServerEstimateTnd(result.estimateTnd);
      }
      setEstimateRevealed(true);
      toast.success("Merci — votre estimation est prête.");
    } catch {
      toast.error("Envoi impossible. Réessayez ou contactez-nous par téléphone.");
    } finally {
      setSubmitting(false);
    }
  }

  function updateProject(nextProject: AdvancedProjectInput) {
    setEstimateRevealed(false);
    setSubmittedLeadId(null);
    setServerEstimateTnd(null);
    setProject(nextProject);
  }

  if (!settings) {
    return (
      <BrandedMascotState
        kind="loading"
        eyebrow="Calculateur EBM"
        title="Préparation de l'estimation."
        description="Les paramètres 2026, zones et options sont en cours de chargement."
        variant="compact"
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card className="overflow-hidden border-ebm-navy/10">
        <CardHeader className="bg-ebm-navy text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge className="mb-3 bg-primary text-primary-foreground">Simple pour vous, précis pour EBM</Badge>
              <CardTitle className="text-2xl">Estimez votre projet pas à pas</CardTitle>
              <CardDescription className="mt-2 max-w-xl text-white/75">
                Répondez à quelques questions. Le détail technique est calculé en arrière-plan à partir des
                paramètres du marché tunisien.
              </CardDescription>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm font-medium text-white/80">Étape {step + 1} / {STEPS.length}</p>
              <p className="mt-1 text-xs text-white/60">Progression sauvegardée sur cet appareil</p>
            </div>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <p className="mb-6 text-sm font-medium text-ebm-navy">{STEPS[step]}</p>

          {step === 0 && <ProjectStep project={project} onChange={updateProject} />}
          {step === 1 && <DimensionsStep project={project} onChange={updateProject} />}
          {step === 2 && <OfferStep project={project} onChange={updateProject} />}
          {step === 3 && <OptionsStep project={project} onChange={updateProject} />}
          {step === 4 && (
            <ResultStep
              project={project}
              total={totals.total}
              serverEstimateTnd={serverEstimateTnd}
              lowRange={totals.lowRange}
              highRange={totals.highRange}
              directCost={totals.directCost}
              onSubmit={submitLead}
              contactIsComplete={contactIsComplete}
              estimateRevealed={estimateRevealed}
              name={name}
              email={email}
              phone={phone}
              notes={notes}
              submitting={submitting}
              onNameChange={(value) => {
                setEstimateRevealed(false);
                setSubmittedLeadId(null);
                setServerEstimateTnd(null);
                setName(value);
              }}
              onEmailChange={(value) => {
                setEstimateRevealed(false);
                setSubmittedLeadId(null);
                setServerEstimateTnd(null);
                setEmail(value);
              }}
              onPhoneChange={(value) => {
                setEstimateRevealed(false);
                setSubmittedLeadId(null);
                setServerEstimateTnd(null);
                setPhone(value);
              }}
              onNotesChange={(value) => {
                setEstimateRevealed(false);
                setSubmittedLeadId(null);
                setServerEstimateTnd(null);
                setNotes(value);
              }}
            />
          )}

          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
            >
              <ArrowLeft className="size-4" />
              Retour
            </Button>
            {step < 4 ? (
              <Button type="button" onClick={() => setStep((current) => Math.min(4, current + 1))}>
                {step === 3 ? calculateCta : "Continuer"}
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(0)}>
                  Modifier mon projet
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    window.localStorage.removeItem(STORAGE_KEY);
                    setStep(0);
                    setProject(DEFAULT_ADVANCED_PROJECT);
                    setName("");
                    setEmail("");
                    setPhone("");
                    setNotes("");
                    setEstimateRevealed(false);
                    setSubmittedLeadId(null);
                    setServerEstimateTnd(null);
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type StepProps = {
  project: AdvancedProjectInput;
  onChange: (project: AdvancedProjectInput) => void;
};

function ProjectStep({ project, onChange }: StepProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Quel style souhaitez-vous ?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {styleCards.map((style) => (
            <ChoiceCard
              key={style.id}
              active={project.style === style.id}
              title={style.title}
              description={style.description}
              onClick={() => onChange({ ...project, style: style.id })}
            />
          ))}
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Quel type de construction ?</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {typeCards.map((type) => (
            <Button
              key={type.id}
              type="button"
              variant={project.buildType === type.id ? "default" : "outline"}
              onClick={() => onChange({ ...project, buildType: type.id })}
            >
              {type.title}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}

function DimensionsStep({ project, onChange }: StepProps) {
  const [surfaceText, setSurfaceText] = useState(String(project.surfaceM2));

  useEffect(() => {
    setSurfaceText(String(project.surfaceM2));
  }, [project.surfaceM2]);

  function updateSurface(value: number) {
    onChange({
      ...project,
      surfaceM2: clampNumber(value, MIN_SURFACE_M2, MAX_SURFACE_M2),
    });
  }

  function commitSurfaceInput() {
    const parsed = Number.parseFloat(surfaceText);
    const nextSurface = clampNumber(parsed, MIN_SURFACE_M2, MAX_SURFACE_M2);
    setSurfaceText(String(nextSurface));
    updateSurface(nextSurface);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Label>Surface à bâtir</Label>
          <span className="text-lg font-semibold tabular-nums">{project.surfaceM2} m²</span>
        </div>
        <input
          type="range"
          aria-label="Surface à bâtir"
          min={MIN_SURFACE_M2}
          max={MAX_SURFACE_M2}
          step={10}
          value={project.surfaceM2}
          onChange={(e) => updateSurface(Number.parseFloat(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{MIN_SURFACE_M2} m²</span>
          <span>{MAX_SURFACE_M2} m²</span>
        </div>
        <div className="max-w-48 space-y-2">
          <Label htmlFor="surface-input">Ou saisir directement</Label>
          <Input
            id="surface-input"
            type="number"
            min={MIN_SURFACE_M2}
            max={MAX_SURFACE_M2}
            step={10}
            value={surfaceText}
            onChange={(e) => {
              setSurfaceText(e.target.value);
            }}
            onBlur={commitSurfaceInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitSurfaceInput();
              }
            }}
          />
          <p className="text-xs text-muted-foreground">
            Vous pouvez glisser le curseur ou taper une valeur entre {MIN_SURFACE_M2} et {MAX_SURFACE_M2} m².
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sim-location">Emplacement</Label>
          <select
            id="sim-location"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            value={project.location}
            onChange={(e) => {
              const selected = LOCATION_OPTIONS.find((option) => option.label === e.target.value);
              onChange({
                ...project,
                location: e.target.value,
                zone: selected?.zone ?? project.zone,
              });
            }}
          >
            {LOCATION_OPTIONS.map((option) => (
              <option key={option.label} value={option.label}>
                {option.label} - {LOCATION_ZONE_LABELS[option.zone]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Titre foncier</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={project.terrain === "oui" ? "default" : "outline"}
              onClick={() => onChange({ ...project, terrain: "oui" })}
            >
              Oui
            </Button>
            <Button
              type="button"
              variant={project.terrain === "cours" ? "default" : "outline"}
              onClick={() => onChange({ ...project, terrain: "cours" })}
            >
              En cours
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OfferStep({ project, onChange }: StepProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Choisissez le niveau de prestation</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {offerCards.map((offer) => (
          <ChoiceCard
            key={offer.id}
            active={project.offer === offer.id}
            title={offer.title}
            description={offer.description}
            onClick={() => onChange({ ...project, offer: offer.id })}
          />
        ))}
      </div>
    </div>
  );
}

function OptionsStep({ project, onChange }: StepProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Ajoutez les options importantes</h2>
      <p className="text-sm text-muted-foreground">
        Ces options changent fortement le budget. Sélectionnez uniquement ce qui est réellement prévu.
      </p>
      <div className="grid gap-3">
        <OptionSurfaceCard
          checked={project.options.pool}
          label="Piscine"
          hint="Surface du bassin et plage technique estimée."
          surfaceLabel="Surface piscine (m²)"
          surface={project.optionSurfaces.poolM2}
          onCheckedChange={(checked) =>
            onChange({ ...project, options: { ...project.options, pool: checked } })
          }
          onSurfaceChange={(surface) =>
            onChange({ ...project, optionSurfaces: { ...project.optionSurfaces, poolM2: surface } })
          }
        />
        <OptionSurfaceCard
          checked={project.options.basement}
          label="Sous-sol / garage enterré"
          hint="Surface utile du garage ou sous-sol à construire."
          surfaceLabel="Surface garage (m²)"
          surface={project.optionSurfaces.basementM2}
          onCheckedChange={(checked) =>
            onChange({ ...project, options: { ...project.options, basement: checked } })
          }
          onSurfaceChange={(surface) =>
            onChange({ ...project, optionSurfaces: { ...project.optionSurfaces, basementM2: surface } })
          }
        />
        <OptionSurfaceCard
          checked={project.options.garden}
          label="Jardin paysager & clôtures"
          hint="Surface extérieure à aménager, hors bâti."
          surfaceLabel="Surface jardin (m²)"
          surface={project.optionSurfaces.gardenM2}
          onCheckedChange={(checked) =>
            onChange({ ...project, options: { ...project.options, garden: checked } })
          }
          onSurfaceChange={(surface) =>
            onChange({ ...project, optionSurfaces: { ...project.optionSurfaces, gardenM2: surface } })
          }
        />
      </div>
    </div>
  );
}

function OptionSurfaceCard({
  checked,
  label,
  hint,
  surfaceLabel,
  surface,
  onCheckedChange,
  onSurfaceChange,
}: {
  checked: boolean;
  label: string;
  hint: string;
  surfaceLabel: string;
  surface: number;
  onCheckedChange: (checked: boolean) => void;
  onSurfaceChange: (surface: number) => void;
}) {
  return (
    <div className={cn("rounded-2xl border bg-card p-4", checked && "border-primary bg-primary/5")}>
      <label className="flex cursor-pointer items-start gap-3">
        <Checkbox checked={checked} onCheckedChange={(value) => onCheckedChange(Boolean(value))} />
        <span>
          <span className="block font-medium">{label}</span>
          <span className="mt-1 block text-sm text-muted-foreground">{hint}</span>
        </span>
      </label>
      {checked && (
        <div className="mt-4 max-w-56 space-y-2 pl-7">
          <Label>{surfaceLabel}</Label>
          <Input
            type="number"
            min={1}
            step={1}
            value={surface}
            onChange={(e) => onSurfaceChange(Math.max(1, Number.parseFloat(e.target.value) || 1))}
            required
          />
        </div>
      )}
    </div>
  );
}

type ResultStepProps = {
  project: AdvancedProjectInput;
  total: number;
  serverEstimateTnd: number | null;
  lowRange: number;
  highRange: number;
  directCost: number;
  onSubmit: (e: FormEvent) => void;
  contactIsComplete: boolean;
  estimateRevealed: boolean;
  name: string;
  email: string;
  phone: string;
  notes: string;
  submitting: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onNotesChange: (value: string) => void;
};

function ResultStep({
  project,
  total,
  serverEstimateTnd,
  lowRange,
  highRange,
  directCost,
  onSubmit,
  contactIsComplete,
  estimateRevealed,
  name,
  email,
  phone,
  notes,
  submitting,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onNotesChange,
}: ResultStepProps) {
  const displayedTotal = serverEstimateTnd ?? total;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div className="rounded-3xl border border-primary/30 bg-primary/10 p-6">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
            <CheckCircle2 className="size-4" />
            {estimateRevealed ? "Estimation indicative" : "Dernière étape"}
          </div>
          {estimateRevealed ? (
            <>
              <p className="text-4xl font-semibold tabular-nums text-primary">{formatTnd(displayedTotal)}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Fourchette réaliste : {formatTnd(lowRange)} - {formatTnd(highRange)}
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-semibold text-primary">Complétez le formulaire pour afficher l'estimation.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Cela permet à EBM de vous envoyer le détail et de vérifier les hypothèses techniques.
              </p>
            </>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <ResultFact label="Projet" value={`${project.surfaceM2} m² à ${project.location}`} />
          <ResultFact label="Base technique" value={estimateRevealed ? formatTnd(directCost) : "Calculée"} />
          <ResultFact label="Zone" value={LOCATION_ZONE_LABELS[project.zone]} />
          <ResultFact label="Titre foncier" value={project.terrain === "oui" ? "Disponible" : "En cours"} />
        </div>
        {estimateRevealed ? (
          <BrandedMascotState
            kind="success"
            eyebrow="Estimation prête"
            title="Le dossier est qualifié."
            description="Vos hypothèses sont enregistrées pour que l'équipe puisse préparer un rappel précis."
            variant="inline"
            className="border-primary/20 shadow-none"
          />
        ) : null}
        <p className="text-sm leading-relaxed text-muted-foreground">
          Le visiteur garde une lecture simple. EBM reçoit aussi le détail technique généré automatiquement
          pour affiner le devis lors du rappel.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border bg-card p-5">
        <h3 className="text-lg font-semibold">Recevoir cette estimation</h3>
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input id="name" value={name} onChange={(e) => onNameChange(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" value={phone} onChange={(e) => onPhoneChange(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Précisions utiles</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Délais, terrain, niveau de finition..."
          />
        </div>
        <Button type="submit" className="w-full" disabled={submitting || !contactIsComplete}>
          <Send className="size-4" />
          {submitting
            ? "Envoi…"
            : contactIsComplete
              ? estimateRevealed
                ? "Renvoyer ma demande"
                : "Envoyer et afficher le prix"
              : "Complétez vos coordonnées"}
        </Button>
        {!estimateRevealed ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Le prix apparaît après l'envoi du formulaire pour que l'équipe puisse vous transmettre le détail.
            Vos coordonnées ne sont pas sauvegardées dans ce navigateur.
          </p>
        ) : null}
      </form>
    </div>
  );
}

function ChoiceCard({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-4 text-left transition hover:border-primary/60 hover:bg-primary/5",
        active ? "border-primary bg-primary/10" : "bg-card",
      )}
    >
      <span className="font-medium">{title}</span>
      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{description}</span>
    </button>
  );
}

function ResultFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
