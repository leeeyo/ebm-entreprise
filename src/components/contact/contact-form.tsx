"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { BrandedMascotState } from "@/components/brand/mascot-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createMetaEventId,
  getMetaClientContext,
  sendMetaCapiClientEvent,
} from "@/lib/meta-client-events";
import {
  buildMetaAdvancedMatching,
  isMetaPixelEnabled,
  reinitMetaPixelWithAdvancedMatching,
  trackMetaContact,
  trackMetaCustom,
} from "@/lib/meta-pixel";
import { trackGaEvent } from "@/lib/google-analytics";

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState("");
  const formStartedTracked = useRef(false);

  function onPhoneChange(event: React.ChangeEvent<HTMLInputElement>) {
    const digits = event.currentTarget.value.replace(/\D/g, "").slice(0, 8);
    const formatted = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 8)].filter(Boolean).join(" ");
    setPhone(formatted);
  }

  function trackContactFormStarted() {
    if (formStartedTracked.current) return;
    formStartedTracked.current = true;

    trackGaEvent("contact_form_started", {
      content_category: "contact",
    });

    if (!isMetaPixelEnabled()) return;

    const eventId = createMetaEventId("contact_form_started");
    const payload = {
      eventId,
      contentId: "contact:form",
      contentName: "Formulaire de contact EBM",
      contentCategory: "contact",
    };

    trackMetaCustom("ContactFormStarted", payload);
    sendMetaCapiClientEvent({
      eventName: "ContactFormStarted",
      ...payload,
    });
  }

  function splitFullName(value: string) {
    const parts = value.trim().split(/\s+/).filter(Boolean);
    return {
      firstName: parts[0] ?? "",
      lastName: parts.length > 1 ? parts.slice(1).join(" ") : "",
    };
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const phoneValue = formValue(formData, "phone");

    const emailValue = formValue(formData, "email");
    if (!emailValue && !phoneValue) {
      toast.error("Indiquez un e-mail ou un numéro de téléphone.");
      return;
    }
    if (phoneValue && !/^\d{2} \d{3} \d{3}$/.test(phoneValue)) {
      toast.error("Le téléphone doit respecter le format xx xxx xxx.");
      return;
    }

    setSubmitting(true);
    try {
      const meta = getMetaClientContext();
      const name = formValue(formData, "name");
      const email = emailValue;
      const serviceInterest = formValue(formData, "serviceInterest");
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phoneValue,
          subject: formValue(formData, "subject"),
          serviceInterest,
          website: formValue(formData, "website"),
          message: formValue(formData, "message"),
          sourcePage: "/contact",
          meta,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Contact submission failed");
      }

      toast.success("Votre demande a bien été envoyée.");
      trackGaEvent("generate_lead", {
        lead_source: "contact_form",
        service_interest: serviceInterest,
      });
      const metaResult = (await response.json().catch(() => null)) as { id?: string } | null;
      if (metaResult?.id) {
        const { firstName, lastName } = splitFullName(name);
        reinitMetaPixelWithAdvancedMatching(
          buildMetaAdvancedMatching({
            email,
            phone: phoneValue,
            firstName,
            lastName,
            country: "tn",
          }),
        );
        trackMetaContact({
          eventId: metaResult.id,
          contentId: "contact:form",
          contentName: "Demande contact EBM",
          contentCategory: "contact",
          customData: {
            lead_source: "contact_form",
            service_interest: serviceInterest,
          },
        });
      }

      form.reset();
      setPhone("");
      setSubmitted(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Envoi impossible. Vous pouvez aussi nous appeler directement.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4 rounded-3xl border border-border/60 bg-card/85 p-4 shadow-sm backdrop-blur-sm sm:p-5">
        <BrandedMascotState
          kind="success"
          eyebrow="Demande transmise"
          title="Votre message est dans la salle des opérations."
          description="L'équipe EBM reçoit votre demande avec les informations nécessaires pour vous répondre rapidement."
          primaryAction={{ label: "Lancer le simulateur", href: "/simulateur" }}
          variant="compact"
          className="border-primary/20 shadow-none"
        />
        <Button type="button" variant="outline" onClick={() => setSubmitted(false)}>
          Envoyer une autre demande
        </Button>
      </div>
    );
  }

  return (
    <form
      action="/api/contact"
      method="post"
      onSubmit={onSubmit}
      onFocusCapture={trackContactFormStarted}
      className="rounded-3xl border border-border/60 bg-card/85 p-5 shadow-sm backdrop-blur-sm sm:p-6"
    >
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <Label htmlFor="contact-website">Site internet</Label>
        <Input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Nom complet</Label>
          <Input id="contact-name" name="name" required placeholder="Votre nom" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-phone">Téléphone <span className="text-muted-foreground">(ou e-mail)</span></Label>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={onPhoneChange}
            inputMode="numeric"
            pattern="\d{2} \d{3} \d{3}"
            maxLength={10}
            placeholder="xx xxx xxx"
            title="Format attendu : xx xxx xxx"
          />
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-email">E-mail <span className="text-muted-foreground">(ou téléphone)</span></Label>
          <Input id="contact-email" name="email" type="email" placeholder="vous@exemple.tn" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-service">Service concerné</Label>
          <select
            id="contact-service"
            name="serviceInterest"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Sélectionnez un service
            </option>
            <option>Construction</option>
            <option>Rénovation</option>
            <option>Services techniques</option>
            <option>Projet / réalisation</option>
            <option>Autre demande</option>
          </select>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Label htmlFor="contact-subject">Sujet <span className="text-muted-foreground">(facultatif)</span></Label>
        <Input id="contact-subject" name="subject" placeholder="Construction villa R+1 à Ariana" />
      </div>
      <div className="mt-4 space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="Décrivez votre projet, la localisation, la surface approximative et le délai souhaité."
        />
      </div>
      <Button type="submit" size="lg" disabled={submitting} className="mt-5 w-full sm:w-auto">
        <Send className="size-4" />
        {submitting ? "Envoi..." : "Envoyer ma demande"}
      </Button>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        Les informations saisies servent à traiter votre demande. Consultez notre{" "}
        <Link href="/confidentialite" className="underline underline-offset-4">
          politique de confidentialité
        </Link>
        .
      </p>
    </form>
  );
}
