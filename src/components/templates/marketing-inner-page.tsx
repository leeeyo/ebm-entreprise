import Link from "next/link";
import { Button } from "@/components/ui/button";

type MarketingInnerPageProps = {
  h1: string;
  intro: string;
  children?: React.ReactNode;
};

export function MarketingInnerPage({ h1, intro, children }: MarketingInnerPageProps) {
  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{h1}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{intro}</p>
      </header>
      {children ? <div className="mt-10 space-y-10">{children}</div> : null}
      <div className="mt-12 flex flex-wrap gap-3 rounded-xl border bg-muted/30 p-6">
        <Button asChild>
          <Link href="/contact">Demander un devis</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/simulateur">Lancer le simulateur</Link>
        </Button>
      </div>
    </article>
  );
}
