import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex max-w-lg flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <Image
              src="/logo-ebm.png"
              alt="EBM Ben Mokhtar — entreprise de construction"
              width={200}
              height={64}
              className="h-12 w-auto shrink-0 object-contain object-left"
            />
            <div>
              <p className="text-sm font-semibold">EBM Ben Mokhtar</p>
              <p className="text-sm text-muted-foreground">
                Construction, rénovation et projets clé en main en Tunisie.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/contact">Demander un devis</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/simulateur">Lancer le simulateur</Link>
            </Button>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div className="text-sm text-muted-foreground">
            <p>Résidence el Amen, Riadh el Andalous, Ariana</p>
            <p>Tél. 22 181 181</p>
            <p>
              <a className="underline underline-offset-4" href="mailto:contact@ebm-entreprise.tn">
                contact@ebm-entreprise.tn
              </a>
            </p>
          </div>
          <p className="text-xs text-muted-foreground sm:max-w-xs sm:text-right">
            Entreprise de construction Tunisie — génie civil — prix construction m² Tunisie (estimation
            indicative via simulateur).
          </p>
        </div>
      </div>
    </footer>
  );
}
