import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
              <TableHead className="text-right">Estimation (TND)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Aucun lead pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((l) => (
                <TableRow key={String(l._id)}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {l.createdAt
                      ? new Date(l.createdAt as string).toLocaleString("fr-FR")
                      : "—"}
                  </TableCell>
                  <TableCell>{l.name}</TableCell>
                  <TableCell>{l.email}</TableCell>
                  <TableCell>{l.phone}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {l.estimateTnd != null ? l.estimateTnd.toLocaleString("fr-TN") : "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
