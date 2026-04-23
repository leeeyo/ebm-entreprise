import type { Metadata } from "next";
import Image from "next/image";
import {
  Clock,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { contactContent } from "@/content/contact";
import { contactMap } from "@/content/media";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import {
  CtaBand,
  MagneticLink,
  PageHero,
  SectionHeading,
  TrustStrip,
} from "@/components/marketing";
import { Reveal } from "@/components/home/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez EBM Ben Mokhtar — Ariana, Tunisie. Téléphone 22 181 181, email contact@ebm-entreprise.tn.",
};

const phoneHref = `tel:+216${contactContent.phone.replace(/\s/g, "")}`;
const mailHref = `mailto:${contactContent.email}`;
const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${contactContent.addressLine}, Ariana, Tunisie`,
)}`;

const INFO_ITEMS: Array<{
  icon: typeof MapPin;
  label: string;
  value: string;
  hint?: string;
  href?: string;
}> = [
  {
    icon: MapPin,
    label: "Adresse",
    value: contactContent.addressLine,
    hint: "Ariana, Tunisie",
    href: mapsHref,
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: contactContent.phone,
    hint: "Lun–Ven · 08h30–17h00",
    href: phoneHref,
  },
  {
    icon: Mail,
    label: "Email",
    value: contactContent.email,
    hint: "Réponse sous 24 h ouvrées",
    href: mailHref,
  },
  {
    icon: Clock,
    label: contactContent.hoursTitle,
    value: contactContent.hoursWeek,
    hint: contactContent.hoursWeekend,
  },
];

const TRUST_ITEMS = [
  {
    icon: Timer,
    label: "Réponse sous 24 h",
    hint: "Jours ouvrés",
  },
  {
    icon: ShieldCheck,
    label: "Données confidentielles",
    hint: "Vos échanges restent entre nous",
  },
  {
    icon: MapPinned,
    label: "Tunisie entière",
    hint: "Basés à Ariana — interventions nationales",
  },
];

function InfoCard({ item, index }: { item: (typeof INFO_ITEMS)[number]; index: number }) {
  const Icon = item.icon;
  const body = (
    <article className="group relative h-full rounded-2xl border border-border/55 bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-[box-shadow,border-color,transform] duration-300 ease-out will-change-transform hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5">
      <div className="flex items-start gap-4">
        <span
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:-translate-y-0.5"
          aria-hidden
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {item.label}
          </p>
          <p className="mt-1.5 wrap-break-word text-base font-medium text-foreground sm:text-[1.05rem]">
            {item.value}
          </p>
          {item.hint ? (
            <p className="mt-1 text-sm text-muted-foreground">{item.hint}</p>
          ) : null}
        </div>
      </div>
    </article>
  );

  return (
    <Reveal delayMs={index * 60} variant="fade-up">
      {item.href ? (
        <a
          href={item.href}
          className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
          {...(item.href.startsWith("http")
            ? { target: "_blank", rel: "noreferrer" }
            : {})}
        >
          {body}
        </a>
      ) : (
        body
      )}
    </Reveal>
  );
}

export default function ContactPage() {
  return (
    <LazyMotionProvider>
      <PageHero
        eyebrow="Contact"
        title="Parlons de votre projet."
        accent="projet"
        subtitle="Une question, une estimation, un rendez-vous ? L'équipe EBM vous répond sous 24 heures ouvrées."
        compact
      />

      <section
        className="cv-auto mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        style={{ containIntrinsicSize: "auto 1100px" }}
      >
        <SectionHeading
          eyebrow="Coordonnées"
          title="Tous les chemins mènent à EBM."
          subtitle="Choisissez le canal qui vous convient — nous sommes basés à Ariana et intervenons partout en Tunisie."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_1fr]">
          <ul className="grid gap-4 sm:grid-cols-2">
            {INFO_ITEMS.map((item, idx) => (
              <li key={item.label} className="h-full">
                <InfoCard item={item} index={idx} />
              </li>
            ))}
          </ul>

          <Reveal variant="fade-up" delayMs={80}>
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
              <div className="relative aspect-4/3 w-full sm:aspect-3/2 lg:aspect-auto lg:h-full lg:min-h-[420px]">
                <Image
                  src={contactMap.src}
                  alt={contactMap.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/85 via-background/20 to-transparent"
                  aria-hidden
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
                <div className="min-w-0">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">
                    Nos bureaux
                  </p>
                  <p className="mt-1 font-heading text-lg font-semibold tracking-tight text-foreground">
                    {contactContent.addressLine}
                  </p>
                </div>
                <MagneticLink
                  href={mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 sm:self-end"
                >
                  <MapPinned className="size-4" aria-hidden />
                  Ouvrir dans Maps
                </MagneticLink>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-14">
          <TrustStrip items={TRUST_ITEMS} />
        </div>
      </section>

      <CtaBand
        eyebrow="Un projet en tête ?"
        title="Obtenez une première estimation en 2 minutes."
        body="Le simulateur vous donne un ordre de grandeur immédiat — nous prenons ensuite le relais pour un devis personnalisé."
        primary={{ label: "Lancer le simulateur", href: "/simulateur" }}
        secondary={{ label: "Écrire à l'équipe", href: mailHref }}
      />
    </LazyMotionProvider>
  );
}
