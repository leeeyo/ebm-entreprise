"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState("");

  function onPhoneChange(event: React.ChangeEvent<HTMLInputElement>) {
    const digits = event.currentTarget.value.replace(/\D/g, "").slice(0, 8);
    const formatted = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 8)].filter(Boolean).join(" ");
    setPhone(formatted);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const phoneValue = formValue(formData, "phone");

    if (!/^\d{2} \d{3} \d{3}$/.test(phoneValue)) {
      toast.error("Le téléphone doit respecter le format xx xxx xxx.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: formValue(formData, "name"),
          email: formValue(formData, "email"),
          phone: phoneValue,
          subject: formValue(formData, "subject"),
          serviceInterest: formValue(formData, "serviceInterest"),
          message: formValue(formData, "message"),
          sourcePage: "/contact",
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Contact submission failed");
      }

      toast.success("Votre demande a bien été envoyée.");
      form.reset();
      setPhone("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Envoi impossible. Vous pouvez aussi nous appeler directement.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-border/60 bg-card/85 p-5 shadow-sm backdrop-blur-sm sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Nom complet</Label>
          <Input id="contact-name" name="name" required placeholder="Votre nom" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-phone">Téléphone</Label>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            value={phone}
            onChange={onPhoneChange}
            inputMode="numeric"
            pattern="\d{2} \d{3} \d{3}"
            maxLength={10}
            placeholder="22 181 181"
            title="Format attendu : xx xxx xxx"
          />
          <p className="text-xs text-muted-foreground">Format attendu : 22 181 181</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" name="email" type="email" required placeholder="vous@exemple.tn" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-service">Service concerné</Label>
          <select
            id="contact-service"
            name="serviceInterest"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            defaultValue="Construction"
          >
            <option>Construction</option>
            <option>Rénovation</option>
            <option>Services techniques</option>
            <option>Projet / réalisation</option>
            <option>Autre demande</option>
          </select>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Label htmlFor="contact-subject">Sujet</Label>
        <Input id="contact-subject" name="subject" required placeholder="Construction villa R+1 à Ariana" />
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
    </form>
  );
}
