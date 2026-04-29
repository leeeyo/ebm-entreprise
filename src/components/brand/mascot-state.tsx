"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MascotKind = "404" | "lost" | "loading" | "forbidden" | "success" | "empty" | "contact" | "hope";

type MascotAction = {
  label: string;
  href: string;
};

const MASCOTS: Record<MascotKind, { src: string; alt: string }> = {
  "404": {
    src: "/mascot/mascot-404.png",
    alt: "Mascotte EBM inspectant une page introuvable",
  },
  lost: {
    src: "/mascot/mascot-lost.png",
    alt: "Mascotte EBM en repérage de chantier",
  },
  loading: {
    src: "/mascot/mascot-loading.png",
    alt: "Mascotte EBM pendant le chargement",
  },
  forbidden: {
    src: "/mascot/mascot-forbidden.png",
    alt: "Mascotte EBM gardant une zone réservée",
  },
  success: {
    src: "/mascot/mascot-success-state.png",
    alt: "Mascotte EBM validant une demande",
  },
  empty: {
    src: "/mascot/mascot-empty-state.png",
    alt: "Mascotte EBM devant un espace vide",
  },
  contact: {
    src: "/mascot/mascot-contact.png",
    alt: "Mascotte EBM prête à répondre",
  },
  hope: {
    src: "/mascot/mascot-hope.png",
    alt: "Mascotte EBM regardant vers le prochain projet",
  },
};

type BrandedMascotStateProps = {
  kind: MascotKind;
  eyebrow?: string;
  title: string;
  description: string;
  primaryAction?: MascotAction;
  secondaryAction?: MascotAction;
  className?: string;
  imagePriority?: boolean;
  imageClassName?: string;
  variant?: "page" | "compact" | "inline";
};

export function BrandedMascotState({
  kind,
  eyebrow = "EBM Ben Mokhtar",
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  imagePriority = false,
  imageClassName,
  variant = "page",
}: BrandedMascotStateProps) {
  const mascot = MASCOTS[kind];
  const isInline = variant === "inline";
  const isCompact = variant === "compact";
  const Heading = variant === "page" ? "h1" : "h2";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-black/10 bg-white text-foreground shadow-sm",
        isInline ? "p-4" : isCompact ? "p-6 sm:p-8" : "p-6 sm:p-10 lg:p-12",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(18,24,38,0.055)_0_1px,transparent_1px_18px)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className={cn(
          "relative grid items-center",
          isInline ? "grid-cols-[88px_1fr] gap-4" : "gap-8 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.72fr)]",
        )}
      >
        <div className={cn(isInline && "order-2")}>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
          ) : null}
          <Heading
            className={cn(
              "font-heading mt-3 font-semibold tracking-tight text-ebm-navy",
              isInline ? "text-lg" : isCompact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-5xl",
            )}
          >
            {title}
          </Heading>
          <p
            className={cn(
              "mt-3 max-w-2xl leading-7 text-muted-foreground",
              isInline ? "text-sm leading-6" : "text-sm sm:text-base",
            )}
          >
            {description}
          </p>
          {primaryAction || secondaryAction ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {primaryAction ? (
                <Button asChild>
                  <Link href={primaryAction.href}>
                    {primaryAction.label}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              ) : null}
              {secondaryAction ? (
                <Button asChild variant="outline">
                  <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className={cn("relative justify-self-center", isInline ? "order-1" : "md:justify-self-end")}>
          <div
            className={cn(
              "relative overflow-hidden rounded-[1.75rem] bg-white",
              "before:absolute before:inset-x-4 before:bottom-3 before:h-8 before:rounded-full before:bg-black/8 before:blur-xl",
              isInline ? "size-20" : isCompact ? "h-48 w-48 sm:h-56 sm:w-56" : "h-64 w-64 sm:h-80 sm:w-80",
            )}
          >
            <Image
              src={mascot.src}
              alt={mascot.alt}
              fill
              priority={imagePriority}
              sizes={isInline ? "88px" : isCompact ? "224px" : "(min-width: 640px) 320px, 256px"}
              className={cn("relative z-10 object-contain", kind === "loading" && "animate-pulse", imageClassName)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
