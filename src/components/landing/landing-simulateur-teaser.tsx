"use client";

import Link from "next/link";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/home/reveal";
import { simulateurTeaser } from "@/content/home";

export function LandingSimulateurTeaser() {
  return (
    <section className="ebm-teaser-bg border-t py-16 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
          <Reveal variant="fade-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <Calculator className="size-7 text-white/95" aria-hidden />
              </div>
              <div className="min-w-0">
                <h2 className="font-heading text-balance text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                  {simulateurTeaser.title}
                </h2>
                <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-white/88 sm:text-base">
                  {simulateurTeaser.text}
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal className="flex justify-start md:justify-end" delayMs={100} variant="scale">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="min-w-[min(100%,16rem)] shadow-lg transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              <Link href="/simulateur">{simulateurTeaser.cta}</Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
