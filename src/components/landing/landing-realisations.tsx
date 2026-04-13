import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InteractiveSelector } from "@/components/ui/interactive-selector";
import { Reveal } from "@/components/home/reveal";
import { realisations } from "@/content/home";
import { getResidenceCover } from "@/content/residence-covers";
import { projets } from "@/content/projets";

const HOME_SHOWCASE_COUNT = 6;

export function LandingRealisations() {
  const slice = projets.slice(0, HOME_SHOWCASE_COUNT);
  const items = slice.map((p) => {
    const cover = getResidenceCover(p.slug, p.title);
    return {
      id: p.slug,
      title: p.title,
      description: p.shortDescription,
      href: `/projets/${p.slug}`,
      imageSrc: cover?.src ?? "",
      imageAlt: cover?.alt ?? p.title,
    };
  });

  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal variant="fade-up">
          <div>
            <span className="mb-2 block h-0.5 w-8 rounded-full bg-primary/80" aria-hidden />
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{realisations.title}</h2>
          </div>
        </Reveal>

        <Reveal className="mt-5 sm:mt-6" delayMs={80} variant="fade-up">
          <InteractiveSelector items={items} />
        </Reveal>

        <Reveal className="mt-5 flex justify-center sm:mt-6" delayMs={120} variant="scale">
          <Button
            asChild
            size="lg"
            className="min-w-48 shadow-md transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Link href="/projets">{realisations.cta}</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
