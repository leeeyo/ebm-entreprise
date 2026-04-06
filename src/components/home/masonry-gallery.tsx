import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { realisations } from "@/content/home";
import { cn } from "@/lib/utils";

const tiles = [
  { id: "a", src: "/placeholders/gallery-1.svg", className: "sm:col-span-2 sm:row-span-2 min-h-[200px]" },
  { id: "b", src: "/placeholders/gallery-2.svg", className: "min-h-[140px]" },
  { id: "c", src: "/placeholders/gallery-3.svg", className: "min-h-[140px]" },
  { id: "d", src: "/placeholders/gallery-4.svg", className: "sm:col-span-2 min-h-[160px]" },
  { id: "e", src: "/placeholders/gallery-5.svg", className: "min-h-[160px]" },
] as const;

export function MasonryGallery() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
          {realisations.title}
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:grid-rows-3">
          {tiles.map((t) => (
            <div
              key={t.id}
              className={cn(
                "group relative isolate overflow-hidden rounded-xl border bg-muted shadow-sm transition-[transform,box-shadow] duration-500 ease-out hover:z-10 hover:scale-[1.02] hover:shadow-lg",
                t.className,
              )}
            >
              <Image
                src={t.src}
                alt="Réalisation EBM — visuel placeholder"
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 flex items-end p-4">
                <span className="text-xs font-medium text-foreground drop-shadow-sm">
                  Réalisation EBM — visuel placeholder
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="transition-transform hover:-translate-y-0.5">
            <Link href="/projets">{realisations.cta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
