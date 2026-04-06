"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SimulatorSettingsSnapshot } from "@/types/simulator";

export function SimulatorSettingsForm() {
  const [data, setData] = useState<SimulatorSettingsSnapshot | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setData)
      .catch(() => toast.error("Chargement impossible."));
  }, []);

  async function onSubmit(e: React.FormEvent) {
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
    <form onSubmit={onSubmit} className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="base">Prix de base (TND / m²)</Label>
        <Input
          id="base"
          type="number"
          min={1}
          step={1}
          value={data.baseTndPerM2}
          onChange={(e) =>
            setData({ ...data, baseTndPerM2: Number.parseFloat(e.target.value) || 0 })
          }
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Mult. gros œuvre</Label>
          <Input
            type="number"
            step="0.01"
            value={data.offerMultipliers.grosOeuvre}
            onChange={(e) =>
              setData({
                ...data,
                offerMultipliers: {
                  ...data.offerMultipliers,
                  grosOeuvre: Number.parseFloat(e.target.value) || 0,
                },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Mult. premium</Label>
          <Input
            type="number"
            step="0.01"
            value={data.offerMultipliers.premium}
            onChange={(e) =>
              setData({
                ...data,
                offerMultipliers: {
                  ...data.offerMultipliers,
                  premium: Number.parseFloat(e.target.value) || 0,
                },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Mult. luxe</Label>
          <Input
            type="number"
            step="0.01"
            value={data.offerMultipliers.luxe}
            onChange={(e) =>
              setData({
                ...data,
                offerMultipliers: {
                  ...data.offerMultipliers,
                  luxe: Number.parseFloat(e.target.value) || 0,
                },
              })
            }
          />
        </div>
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}
