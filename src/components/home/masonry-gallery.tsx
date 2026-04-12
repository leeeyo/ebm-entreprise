import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { realisations } from "@/content/home";
import { getResidenceCover } from "@/content/residence-covers";
import { projets } from "@/content/projets";
import { cn } from "@/lib/utils";

const HOME_GALLERY_COUNT = 6;

/** Masonry cell classes for `sm:grid-cols-3` (six residence shots). */
const GALLERY_LAYOUT = [
  "sm:col-span-2 sm:row-span-2 min-h-[200px]",
  "min-h-[140px]",
  "min-h-[140px]",
  "sm:col-span-2 min-h-[160px]",
  "min-h-[160px]",
  "sm:col-span-3 min-h-[140px]",
] as const;

export function MasonryGallery() {
  const slice = projets.slice(0, HOME_GALLERY_COUNT);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
          {realisations.title}
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:auto-rows-auto">
          {slice.map((p, i) => {
            const cover = getResidenceCover(p.slug, p.title);
            const layout = GALLERY_LAYOUT[i] ?? "min-h-[160px]";
            return (
              <Link
                key={p.slug}
                href={`/projets/${p.slug}`}
                className={cn(
                  "group relative isolate block overflow-hidden rounded-xl border bg-muted shadow-sm transition-[transform,box-shadow] duration-500 ease-out hover:z-10 hover:scale-[1.02] hover:shadow-lg",
                  layout,
                )}
              >
                {cover ? (
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-zinc-200 to-zinc-500 dark:from-zinc-800 dark:to-zinc-950" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 flex items-end p-4">
                  <span className="text-xs font-medium text-foreground drop-shadow-sm">{p.title}</span>
                </div>
              </Link>
            );
          })}
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
