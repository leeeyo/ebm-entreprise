import { ArrowRight, Calculator } from "lucide-react";
import type { LucideIcon, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/home/reveal";
import { MagneticLink } from "./magnetic-link";
import { cn } from "@/lib/utils";

export type CtaBandAction = {
  label: string;
  href: string;
  variant?: "default" | "outline" | "secondary";
};

export type CtaBandProps = {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  icon?: LucideIcon;
  primary: CtaBandAction;
  secondary?: CtaBandAction;
  className?: string;
};

/**
 * Navy-mesh band with magnetic CTAs. Generalizes the landing simulator teaser.
 * Pure CSS animations; no Framer Motion — no LazyMotionProvider needed to use.
 */
export function CtaBand({
  eyebrow = "Passons à l'action",
  title,
  body,
  icon,
  primary,
  secondary,
  className,
}: CtaBandProps) {
  const Icon = icon ?? Calculator;
  return (
    <section
      className={cn(
        "cv-auto relative isolate overflow-hidden border-t py-20 text-white sm:py-24",
        className,
      )}
      style={{
        backgroundColor: "var(--ebm-navy)",
        containIntrinsicSize: "auto 480px",
      }}
    >
      {/* Drifting blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="ebm-blob ebm-blob-a left-[-10%] top-[-20%] size-136"
          style={{ backgroundColor: "var(--ebm-orange)" }}
        />
        <div
          className="ebm-blob ebm-blob-b right-[-12%] bottom-[-30%] size-160"
          style={{ backgroundColor: "oklch(0.55 0.14 258)" }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(transparent_96%,white_96%),linear-gradient(90deg,transparent_96%,white_96%)] bg-size-[56px_56px] opacity-[0.08]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
          <Reveal variant="fade-up">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                <Icon className="size-7 text-white/95" aria-hidden />
              </div>
              <div className="min-w-0">
                {eyebrow ? (
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-white/65">
                    {eyebrow}
                  </p>
                ) : null}
                <h2 className="font-heading mt-2 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                  {title}
                </h2>
                {body ? (
                  <p className="mt-4 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-white/85 sm:text-base">
                    {body}
                  </p>
                ) : null}
              </div>
            </div>
          </Reveal>

          <Reveal className="flex flex-wrap justify-start gap-3 md:justify-end" delayMs={120} variant="scale">
            <Button
              size="lg"
              variant={primary.variant ?? "secondary"}
              asChild
              className="min-w-[min(100%,18rem)] shadow-lg transition-shadow duration-300 hover:shadow-2xl"
            >
              <MagneticLink href={primary.href} className="group will-change-transform">
                <span>{primary.label}</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticLink>
            </Button>
            {secondary ? (
              <Button
                size="lg"
                variant={secondary.variant ?? "outline"}
                asChild
                className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <MagneticLink href={secondary.href} className="will-change-transform">
                  {secondary.label}
                </MagneticLink>
              </Button>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
