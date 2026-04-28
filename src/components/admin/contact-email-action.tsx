"use client";

import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ContactEmailActionProps = {
  email: string;
  subject: string;
  label?: string;
  size?: "sm" | "default";
  variant?: "default" | "outline";
};

export function ContactEmailAction({
  email,
  subject,
  label = "Répondre",
  size = "default",
  variant = "default",
}: ContactEmailActionProps) {
  function openEmailClient() {
    const encodedEmail = encodeURIComponent(email);
    const encodedSubject = encodeURIComponent(`Re: ${subject}`);
    const outlookHref = `ms-outlook://compose?to=${encodedEmail}&subject=${encodedSubject}`;

    void navigator.clipboard?.writeText(email).catch(() => undefined);
    toast.message("Ouverture d'Outlook...", {
      description: "L'adresse email a aussi été copiée si Windows bloque le protocole.",
    });
    window.location.href = outlookHref;
  }

  return (
    <Button type="button" size={size} variant={variant} onClick={openEmailClient}>
      <Mail className="size-4" />
      {label}
    </Button>
  );
}
