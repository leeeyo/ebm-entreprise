"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  calculateCta,
  offerCards,
  optionItems,
  simulateurPage,
  styleCards,
  typeCards,
} from "@/content/simulateur";
import { tunisLocations } from "@/content/tunis-locations";
import { computeEstimateTnd, type OfferTier, type SimulationInput } from "@/lib/simulator-pricing";
import type { SimulatorSettingsSnapshot } from "@/types/simulator";
import { cn } from "@/lib/utils";

const STEP_LABELS = [
  simulateurPage.steps.design,
  simulateurPage.steps.dimensions,
  simulateurPage.steps.offre,
  simulateurPage.steps.equipements,
  simulateurPage.steps.resultat,
];

export function SimulateurWizard() {
  const [settings, setSettings] = useState<SimulatorSettingsSnapshot | null>(null);
  const [step, setStep] = useState(0);
  const [style, setStyle] = useState<SimulationInput["style"]>("moderne");
  const [buildType, setBuildType] = useState<SimulationInput["buildType"]>("plainPied");
  const [surface, setSurface] = useState(220);
  const [locationQuery, setLocationQuery] = useState("");
  const [location, setLocation] = useState("Tunis");
  const [terrain, setTerrain] = useState<"oui" | "cours">("oui");
  const [offer, setOffer] = useState<OfferTier>("premium");
  const [options, setOptions] = useState({ pool: false, basement: false, garden: false });
  const [estimate, setEstimate] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/simulator/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => toast.error("Impossible de charger les paramètres du simulateur."));
  }, []);

  const filteredLocations = useMemo(() => {
    const q = locationQuery.trim().toLowerCase();
    if (!q) return tunisLocations.slice(0, 8);
    return tunisLocations.filter((l) => l.toLowerCase().includes(q)).slice(0, 12);
  }, [locationQuery]);

  const simulationPayload = useMemo(
    () => ({
      style,
      buildType,
      surfaceM2: surface,
      location,
      terrain,
      offer,
      options,
    }),
    [style, buildType, surface, location, terrain, offer, options],
  );

  const runEstimate = useCallback(() => {
    if (!settings) return;
    const input: SimulationInput = {
      style,
      buildType,
      surfaceM2: surface,
      offer,
      options,
    };
    setEstimate(computeEstimateTnd(input, settings));
    setStep(4);
  }, [settings, style, buildType, surface, offer, options]);

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          estimateTnd: estimate ?? undefined,
          simulation: simulationPayload,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Merci — votre demande a bien été enregistrée.");
      setName("");
      setEmail("");
      setPhone("");
    } catch {
      toast.error("Envoi impossible. Réessayez ou contactez-nous par téléphone.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!settings) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
        Chargement du simulateur…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 border-b pb-4">
        <p className="text-sm font-medium text-ebm-navy">
          Étape {Math.min(step + 1, 5)} / 5 : {STEP_LABELS[Math.min(step, 4)]}
        </p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((Math.min(step, 4) + 1) / 5) * 100}%` }}
          />
        </div>
      </div>

      {step === 0 && (
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Style architectural</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {styleCards.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id)}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-colors hover:bg-muted/50",
                    style === s.id ? "border-primary bg-primary/5" : "border-transparent bg-card",
                  )}
                >
                  <p className="font-medium">{s.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                </button>
              ))}
            </div>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Type de construction</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {typeCards.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setBuildType(t.id)}
                  className={cn(
                    "rounded-xl border-2 px-4 py-6 text-center font-medium transition-colors",
                    buildType === t.id
                      ? "border-ebm-navy bg-ebm-navy text-white"
                      : "border-muted bg-card hover:bg-muted/40",
                  )}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </section>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setStep(1)}>
              Continuer
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <Label>Surface à bâtir (m²)</Label>
              <span className="text-sm font-medium tabular-nums">{surface} m²</span>
            </div>
            <Slider
              min={80}
              max={1000}
              step={10}
              value={[surface]}
              onValueChange={(v) => {
                const n = Array.isArray(v) ? v[0] : v;
                setSurface(typeof n === "number" ? n : 80);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loc">Emplacement</Label>
            <Input
              id="loc"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Rechercher (ex. La Marsa, Tunis)"
              autoComplete="off"
            />
            <div className="flex flex-wrap gap-2">
              {filteredLocations.map((l) => (
                <Button
                  key={l}
                  type="button"
                  variant={location === l ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setLocation(l);
                    setLocationQuery(l);
                  }}
                >
                  {l}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Sélection actuelle : {location}</p>
          </div>
          <div className="space-y-3">
            <Label>Avez-vous déjà votre titre foncier ?</Label>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant={terrain === "oui" ? "default" : "outline"} onClick={() => setTerrain("oui")}>
                Oui
              </Button>
              <Button
                type="button"
                variant={terrain === "cours" ? "default" : "outline"}
                onClick={() => setTerrain("cours")}
              >
                En cours
              </Button>
            </div>
          </div>
          <div className="flex justify-between gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(0)}>
              Retour
            </Button>
            <Button type="button" onClick={() => setStep(2)}>
              Continuer
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {offerCards.map((o) => (
              <Card
                key={o.id}
                className={cn(
                  "cursor-pointer transition-shadow",
                  offer === o.id ? "ring-2 ring-primary" : "hover:shadow-md",
                )}
                onClick={() => setOffer(o.id)}
              >
                <CardHeader>
                  <CardTitle className="text-base">{o.title}</CardTitle>
                  <CardDescription>{o.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="flex justify-between gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              Retour
            </Button>
            <Button type="button" onClick={() => setStep(3)}>
              Continuer
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {optionItems.map((o) => (
              <label
                key={o.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4"
              >
                <Checkbox
                  checked={options[o.id]}
                  onCheckedChange={(v) =>
                    setOptions((prev) => ({ ...prev, [o.id]: Boolean(v) }))
                  }
                />
                <span className="text-sm font-medium leading-none">{o.label}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-between gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(2)}>
              Retour
            </Button>
            <Button type="button" onClick={runEstimate}>
              {calculateCta}
            </Button>
          </div>
        </div>
      )}

      {step === 4 && estimate != null && (
        <div className="space-y-8">
          <Card className="border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle>Estimation indicative</CardTitle>
              <CardDescription>
                Fourchette basée sur vos critères et les paramètres marché (TND, hors imprévus).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold tabular-nums text-primary">
                {estimate.toLocaleString("fr-TN")} TND
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {surface} m² — {location} — {offer === "grosOeuvre" ? "Gros œuvre" : offer === "premium" ? "Clé en main premium" : "Clé en main luxe"}
              </p>
            </CardContent>
          </Card>

          <form onSubmit={submitLead} className="space-y-4 rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold">Recevoir cette estimation</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Envoi…" : "Envoyer ma demande"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setStep(3)}>
                Modifier mes choix
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
