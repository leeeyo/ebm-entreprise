import Image from "next/image";
import { Reveal } from "@/components/home/reveal";
import { cn } from "@/lib/utils";

export type BentoImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type ImageBentoGridProps = {
  /** 5 items required for the asymmetric 2x3 layout. Extras are ignored. */
  images: BentoImage[];
  className?: string;
};

/**
 * 5-cell asymmetric bento grid for photo galleries. CSS-only hover zoom;
 * scroll-reveal per cell so the grid feels alive without heavy JS.
 *
 *  Desktop (3 cols / 2 rows):
 *    ┌────────────┬──────┐
 *    │     0      │  1   │
 *    │            ├──────┤
 *    │            │  2   │
 *    ├──────┬─────┴──────┤
 *    │  3   │     4      │
 *    └──────┴────────────┘
 */
export function ImageBentoGrid({ images, className }: ImageBentoGridProps) {
  const items = images.slice(0, 5);
  const cellClasses = [
    "sm:row-span-2 sm:col-span-2 aspect-4/3 sm:aspect-auto sm:min-h-[26rem]",
    "aspect-4/3",
    "aspect-4/3",
    "aspect-4/3",
    "sm:col-span-2 aspect-4/3 sm:aspect-auto sm:min-h-[20rem]",
  ];

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-3 sm:grid-rows-[auto_auto] sm:gap-4",
        className,
      )}
    >
      {items.map((img, idx) => (
        <Reveal key={`${img.src}-${idx}`} delayMs={idx * 80} variant="fade-up">
          <figure
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-border/55 bg-muted",
              cellClasses[idx],
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.05]"
              loading={idx === 0 ? "eager" : "lazy"}
            />
            {img.caption ? (
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/15 to-transparent p-4 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {img.caption}
              </figcaption>
            ) : null}
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
