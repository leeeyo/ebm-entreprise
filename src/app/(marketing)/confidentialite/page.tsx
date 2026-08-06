import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Database, Mail, ShieldCheck } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/marketing";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({
  title: "Confidentialité",
  description:
    "Politique de confidentialité EBM Ben Mokhtar : données de contact, simulateur, Meta Pixel et Conversions API.",
  path: "/confidentialite",
});

const dataUses = [
  {
    icon: Mail,
    title: "Répondre aux demandes",
    text: "Les informations envoyées via le formulaire de contact ou le simulateur servent à qualifier le projet et à recontacter le demandeur.",
  },
  {
    icon: Database,
    title: "Gérer le suivi commercial",
    text: "Les demandes sont enregistrées dans l'espace de suivi EBM afin de gérer les échanges, les estimations et les relances utiles.",
  },
  {
    icon: Activity,
    title: "Mesurer les campagnes",
    text: "Avec l'accord du visiteur, le site peut utiliser Google Analytics, Meta Pixel et Conversions API pour mesurer les visites et les actions principales.",
  },
] as const;

export default function ConfidentialitePage() {
  return (
    <>
      <PageHero
        eyebrow="Confidentialité"
        title="Vos données restent liées à votre projet."
        accent="projet"
        subtitle="Cette page résume les données collectées par EBM Ben Mokhtar et l'usage des outils de mesure Google Analytics, Meta Pixel et Conversions API."
        compact
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Données"
          title="Ce que nous utilisons"
          subtitle="Nous collectons uniquement les informations nécessaires pour traiter une demande, établir une estimation ou mesurer la qualité des campagnes."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {dataUses.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-5 font-heading text-xl font-semibold tracking-tight">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-ebm-navy text-white">
              <ShieldCheck className="size-5" />
            </div>
            <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight">Meta Pixel et CAPI</h2>
          </div>
          <div className="space-y-5 text-sm leading-7 text-muted-foreground">
            <p>
              Meta Pixel peut mesurer les pages visitées et certains événements publics du site. Conversions API envoie
              une copie serveur des conversions importantes, notamment les prospects issus du simulateur et les demandes de contact,
              avec un identifiant d'événement partagé pour éviter les doublons.
            </p>
            <p>
              Les données transmises à Meta peuvent inclure des informations de correspondance comme email, téléphone,
              nom, adresse IP, navigateur, cookies Meta et page source. Les informations personnelles envoyées côté
              serveur sont normalisées puis hachées lorsque Meta l'exige.
            </p>
            <p>
              Les événements principaux suivis sont le succès du simulateur, les demandes de contact, les vues de contenu
              public et les premières interactions avec le simulateur ou le formulaire.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pt-16 sm:px-6 sm:pt-20">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">Google Analytics et choix des traceurs</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            Google Analytics peut mesurer les pages consultées et les interactions principales afin de comprendre
            l'utilisation du site. Les outils Google et Meta ne sont chargés qu'après l'acceptation du visiteur.
          </p>
          <p>
            Le choix est enregistré dans le navigateur. Il peut être rouvert à tout moment avec le lien « Gérer les
            traceurs » présent dans le pied de page.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">Contact et droits</h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Pour toute question sur vos données, vous pouvez contacter EBM Ben Mokhtar à{" "}
          <a className="underline underline-offset-4" href="mailto:contact@ebm-entreprise.tn">
            contact@ebm-entreprise.tn
          </a>
          . Vous pouvez aussi envoyer une demande via la page{" "}
          <Link className="underline underline-offset-4" href="/contact">
            Contact
          </Link>
          .
        </p>
      </section>
    </>
  );
}
