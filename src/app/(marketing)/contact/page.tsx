import type { Metadata } from "next";
import { contactContent } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez EBM Ben Mokhtar — Ariana, Tunisie. Téléphone 22 181 181, email contact@ebm-entreprise.tn.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contact</h1>
      <div className="mt-8 space-y-6 rounded-xl border bg-card p-8 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">Notre adresse</h2>
          <p className="mt-2 text-lg">{contactContent.addressLine}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">Coordonnées</h2>
          <p className="mt-2">
            Téléphone :{" "}
            <a className="font-medium underline underline-offset-4" href={`tel:+216${contactContent.phone.replace(/\s/g, "")}`}>
              {contactContent.phone}
            </a>
          </p>
          <p className="mt-1">
            Email :{" "}
            <a className="font-medium underline underline-offset-4" href={`mailto:${contactContent.email}`}>
              {contactContent.email}
            </a>
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">{contactContent.hoursTitle}</h2>
          <p className="mt-2">{contactContent.hoursWeek}</p>
          <p className="text-muted-foreground">{contactContent.hoursWeekend}</p>
        </div>
      </div>
    </div>
  );
}
