import Link from "next/link";
import type { Metadata } from "next";
import { MarketingInnerPage } from "@/components/templates/marketing-inner-page";
import { groupNavChildren, navSections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Fluides, électricité, menuiserie et aménagements extérieurs — l’offre technique EBM Ben Mokhtar en Tunisie.",
};

export default function ServicesHubPage() {
  const section = navSections.find((s) => s.title === "Services");
  const children = section?.children ?? [];
  const groups = groupNavChildren(children);

  return (
    <MarketingInnerPage
      h1="Services"
      intro="Découvrez nos domaines d’expertise : installations, second œuvre et aménagements extérieurs, avec une mise en œuvre coordonnée sur vos chantiers."
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((g) => (
          <div key={g.label || "all"}>
            {g.label ? (
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</p>
            ) : null}
            <ul className="space-y-2">
              {g.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <section className="rounded-xl border bg-muted/20 p-6">
        <h2 className="text-lg font-semibold">Construction & rénovation</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pour les projets neufs ou la réhabilitation, consultez aussi nos pages{" "}
          <Link href="/construction" className="font-medium text-foreground underline-offset-4 hover:underline">
            Construction
          </Link>{" "}
          et{" "}
          <Link href="/renovation" className="font-medium text-foreground underline-offset-4 hover:underline">
            Rénovation
          </Link>
          .
        </p>
      </section>
    </MarketingInnerPage>
  );
}
