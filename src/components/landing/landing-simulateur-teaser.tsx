"use client";

import { ArrowRight, Calculator } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/home/reveal";
import { useMagnetic } from "@/hooks/use-magnetic";
import { simulateurTeaser } from "@/content/home";

function MagneticButton() {
  const ref = useMagnetic<HTMLAnchorElement>({ strength: 10, radius: 140 });
  return (
    <Button
      size="lg"
      variant="secondary"
      asChild
      className="min-w-[min(100%,18rem)] shadow-lg transition-shadow duration-300 hover:shadow-2xl"
    >
      <Link ref={ref} href="/simulateur" className="group will-change-transform">
        <span>{simulateurTeaser.cta}</span>
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </Button>
  );
}

export function LandingSimulateurTeaser() {
  return (
    <section
      className="cv-auto relative isolate overflow-hidden border-t py-20 text-white sm:py-24"
      style={{
        backgroundColor: "var(--ebm-navy)",
        containIntrinsicSize: "auto 480px",
      }}
    >
      {/* Drifting blobs — transform-only, blurred surface is static. */}
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

      {/* Subtle grid overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(transparent_96%,white_96%),linear-gradient(90deg,transparent_96%,white_96%)] bg-size-[56px_56px] opacity-[0.08]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
          <Reveal variant="fade-up">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                <Calculator className="size-7 text-white/95" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-white/65">
                  Simulateur EBM
                </p>
                <h2 className="font-heading mt-2 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                  {simulateurTeaser.title}
                </h2>
                <p className="mt-4 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-white/85 sm:text-base">
                  {simulateurTeaser.text}
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal className="flex justify-start md:justify-end" delayMs={120} variant="scale">
            <MagneticButton />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
