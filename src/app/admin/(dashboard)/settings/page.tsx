import { SimulatorSettingsForm } from "./settings-form";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Simulateur — tarification</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ajustez les hypothèses du simulateur avancé : prix au m², coefficients de structure,
          zones tunisiennes, options et marges.
        </p>
      </div>
      <SimulatorSettingsForm />
    </div>
  );
}
