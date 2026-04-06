import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Tableau de bord</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/leads">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>Leads simulateur</CardTitle>
              <CardDescription>Consulter les demandes et coordonnées.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/admin/settings">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>Tarification simulateur</CardTitle>
              <CardDescription>Modifier le prix au m² et les multiplicateurs.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/admin/chantiers">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>Photos chantiers</CardTitle>
              <CardDescription>Déposer des visuels (stockage local).</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
