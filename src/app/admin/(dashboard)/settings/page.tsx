import { AdminPageHeader } from "@/components/admin/admin-ui";
import { SimulatorSettingsForm } from "./settings-form";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Opérations / Tarification"
        title="Garder le simulateur aligné avec le marché tunisien."
        description="Ajustez les hypothèses du simulateur avancé : prix au m², coefficients de structure, zones tunisiennes, options, décomposition et marges."
      />
      <SimulatorSettingsForm />
    </div>
  );
}
