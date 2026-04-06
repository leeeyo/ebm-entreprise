import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/admin/actions";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin" className="font-semibold">
            Administration EBM
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            <Link className="text-muted-foreground hover:text-foreground" href="/admin/leads">
              Leads
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/admin/settings">
              Simulateur
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/admin/chantiers">
              Chantiers
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/">
              Site public
            </Link>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm">
                Déconnexion
              </Button>
            </form>
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
