"use client";

import type { LucideIcon } from "lucide-react";
import { Box, Building2, ChevronLeft, ChevronRight, Hammer, Layers } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/home/reveal";
import { domaines } from "@/content/home";
import { cn } from "@/lib/utils";

const DOMAIN_ICONS: Record<string, LucideIcon> = {
  "Gros Œuvre & Structure": Building2,
  "Projets Clé en Main": Layers,
  "Rénovation & Extension": Hammer,
  "Ouvrages Spécialisés": Box,
};

function DomainIcon({ title }: { title: string }) {
  const Icon = DOMAIN_ICONS[title] ?? Building2;
  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary/15">
      <Icon className="size-5" aria-hidden />
    </div>
  );
}

type Domaine = (typeof domaines)[number];

function DomainCard({
  title,
  description,
  image,
  priorityImage,
}: Domaine & { priorityImage?: boolean }) {
  return (
    <article
      data-domain-slide
      className={cn(
        "group flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5",
      )}
    >
      <div className="relative aspect-5/3 w-full shrink-0 overflow-hidden bg-muted sm:min-h-44">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 640px) 85vw, 320px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          priority={priorityImage}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/45 via-transparent to-background/10"
          aria-hidden
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <DomainIcon title={title} />
        <div>
          <h3 className="font-heading text-lg font-semibold leading-snug tracking-tight text-foreground">{title}</h3>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

export function LandingDomaines() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const pad = 4;
    setAtStart(scrollLeft <= pad);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - pad);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    const ro = new ResizeObserver(() => updateEdges());
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      ro.disconnect();
    };
  }, [updateEdges]);

  const scrollByCard = (direction: -1 | 1) => {
    const root = scrollerRef.current;
    if (!root) return;
    const slide = root.querySelector<HTMLElement>("[data-domain-slide]");
    if (!slide) return;
    const gap = 16;
    const step = slide.offsetWidth + gap;
    root.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const carouselId = "domaines-carousel";

  return (
    <section className="relative py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal variant="fade">
          <div>
            <span className="mb-3 block h-1 w-9 rounded-full bg-primary/80" aria-hidden />
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              Nos domaines d&apos;intervention
            </h2>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
              De la structure porteuse aux ouvrages les plus exigeants, nos équipes couvrent l&apos;ensemble du cycle
              de votre projet.
            </p>
          </div>
        </Reveal>

        <Reveal variant="fade-up" delayMs={60} className="mt-10">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-background to-transparent sm:w-12" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-background to-transparent sm:w-12" />

            <div
              id={carouselId}
              ref={scrollerRef}
              role="region"
              aria-roledescription="carrousel"
              aria-label="Domaines d'intervention"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  scrollByCard(-1);
                }
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  scrollByCard(1);
                }
              }}
              className={cn(
                "flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1",
                "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              )}
            >
              {domaines.map((d, idx) => (
                <div
                  key={d.title}
                  className="w-[min(85vw,22rem)] shrink-0 snap-start sm:w-80"
                >
                  <DomainCard {...d} priorityImage={idx === 0} />
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full border border-border/80 bg-background/95 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-35"
                aria-controls={carouselId}
                aria-label="Carte précédente"
                disabled={atStart}
                onClick={() => scrollByCard(-1)}
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full border border-border/80 bg-background/95 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-35"
                aria-controls={carouselId}
                aria-label="Carte suivante"
                disabled={atEnd}
                onClick={() => scrollByCard(1)}
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
