import { SimulatorSettingsForm } from "./settings-form";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Simulateur — tarification</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Les montants sont indicatifs ; ajustez le prix au m² et les multiplicateurs selon le marché.
        </p>
      </div>
      <SimulatorSettingsForm />
    </div>
  );
}
