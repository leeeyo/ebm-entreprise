"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { ArrowRight, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type InteractiveSelectorItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  imageSrc?: string;
  imageAlt: string;
};

type InteractiveSelectorProps = {
  items: InteractiveSelectorItem[];
  className?: string;
};

const SWIPE_MIN_PX = 48;
const LAYOUT_WIDTH = 1600;
const LAYOUT_HEIGHT = 1200;

/** One horizontal band on large screens: image + side rails share this max height. */
const DESKTOP_BAND_MAX =
  "lg:max-h-[min(56svh,520px)] lg:min-h-0";

export function InteractiveSelector({ items, className }: InteractiveSelectorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const regionRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const labelId = useId();

  const count = items.length;
  const active = items[activeIndex];

  const go = useCallback(
    (delta: number) => {
      if (count === 0) return;
      setActiveIndex((i) => (i + delta + count) % count);
    },
    [count],
  );

  const select = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const onTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (count <= 1) return;
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }, [count]);

  const onTouchEnd = useCallback(
    (e: ReactTouchEvent<HTMLDivElement>) => {
      if (count <= 1 || !touchStartRef.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartRef.current.x;
      const dy = t.clientY - touchStartRef.current.y;
      touchStartRef.current = null;
      if (Math.abs(dx) < SWIPE_MIN_PX) return;
      if (Math.abs(dx) < Math.abs(dy)) return;
      if (dx > 0) go(-1);
      else go(1);
    },
    [count, go],
  );

  const onTouchCancel = useCallback(() => {
    touchStartRef.current = null;
  }, []);

  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        go(1);
      } else if (e.key === "Home") {
        e.preventDefault();
        select(0);
      } else if (e.key === "End") {
        e.preventDefault();
        select(count - 1);
      }
    };
    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [go, select, count]);

  if (count === 0 || !active) return null;

  const thumbBtn = (item: InteractiveSelectorItem, index: number, variant: "bar" | "rail") => {
    const selected = index === activeIndex;
    return (
      <button
        key={item.id}
        type="button"
        role="listitem"
        aria-current={selected ? true : undefined}
        aria-label={`Afficher ${item.title}`}
        onClick={() => select(index)}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-lg border-2 bg-muted transition-[box-shadow,border-color,opacity] duration-200",
          variant === "bar" &&
            "h-14 w-20 snap-center sm:h-16 sm:w-24",
          variant === "rail" &&
            "aspect-4/3 w-full border-border/40 lg:max-w-15",
          selected
            ? "border-primary shadow-md ring-2 ring-primary/20"
            : "border-transparent opacity-80 hover:opacity-100",
        )}
      >
        {item.imageSrc && item.imageSrc.length > 0 ? (
          <Image src={item.imageSrc} alt="" fill className="object-cover" sizes="96px" />
        ) : (
          <div className="absolute inset-0 bg-muted-foreground/20" aria-hidden />
        )}
      </button>
    );
  };

  const captionBlock = (
    <div className="flex flex-col justify-center gap-3 px-4 py-4 sm:px-5 lg:h-full lg:max-h-[min(56svh,520px)] lg:overflow-y-auto lg:py-6 lg:pr-6 lg:pl-5">
      <div className="flex gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg">
            {active.title}
          </h3>
          <p className="mt-1.5 line-clamp-3 text-pretty text-sm leading-relaxed text-muted-foreground lg:line-clamp-4">
            {active.description}
          </p>
        </div>
      </div>
      <Button asChild size="lg" className="w-full shrink-0 shadow-sm lg:mt-1">
        <Link href={active.href} className="gap-2">
          Voir la fiche
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Button>
    </div>
  );

  return (
    <div
      ref={regionRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carrousel"
      aria-labelledby={labelId}
      className={cn(
        "group/gallery overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <p id={labelId} className="sr-only">
        Galerie des réalisations : glissez sur la photo, utilisez les flèches, les miniatures ou le clavier pour
        naviguer. Sur grand écran, le détail est à droite de l&apos;image.
      </p>

      {/* Desktop + tablet lg: one row — thumbs | image | caption. Mobile: stacked compact. */}
      <div
        className={cn(
          "flex min-h-0 flex-col lg:flex-row lg:items-stretch",
          DESKTOP_BAND_MAX,
        )}
      >
        {/* Thumbnails: rail on lg, bar below image on mobile */}
        {count > 1 ? (
          <>
            <div
              className="hidden lg:flex lg:w-20 lg:shrink-0 lg:flex-col lg:gap-2 lg:overflow-y-auto lg:overflow-x-hidden lg:border-r lg:border-border/60 lg:bg-muted/20 lg:p-2.5 xl:w-[5.25rem]"
              role="list"
              aria-label="Miniatures"
            >
              {items.map((item, index) => thumbBtn(item, index, "rail"))}
            </div>
          </>
        ) : null}

        {/* Main image — uses remaining width; object-contain preserves photo */}
        <div
          className={cn(
            "relative order-1 min-h-0 flex-1 touch-pan-y bg-muted lg:order-2 lg:min-w-0",
            "max-h-[min(48svh,380px)] lg:max-h-none",
          )}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchCancel}
        >
          <div className="flex h-full min-h-48 w-full items-center justify-center px-2 py-3 sm:min-h-64 lg:min-h-0 lg:p-4">
            {active.imageSrc && active.imageSrc.length > 0 ? (
              <Image
                key={active.id}
                src={active.imageSrc}
                alt={active.imageAlt}
                width={LAYOUT_WIDTH}
                height={LAYOUT_HEIGHT}
                className="h-auto max-h-full w-full object-contain lg:max-h-[min(56svh,520px)]"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority={activeIndex === 0}
              />
            ) : (
              <div
                className="aspect-4/3 w-full max-h-full bg-linear-to-br from-muted to-muted-foreground/20"
                aria-hidden
              />
            )}
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-background/70 to-transparent lg:h-20"
            aria-hidden
          />

          <div className="absolute inset-x-0 bottom-0 flex items-end p-3 lg:p-4">
            <p
              className="rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm tabular-nums"
              aria-live="polite"
            >
              {activeIndex + 1} / {count}
            </p>
          </div>

          {count > 1 ? (
            <>
              <div className="absolute left-2 top-1/2 z-10 -translate-y-1/2 lg:left-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  className="size-9 border border-border/80 bg-background/95 shadow-md backdrop-blur-sm hover:bg-background"
                  onClick={() => go(-1)}
                  aria-label="Réalisation précédente"
                >
                  <ChevronLeft className="size-5" aria-hidden />
                </Button>
              </div>
              <div className="absolute right-2 top-1/2 z-10 -translate-y-1/2 lg:right-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  className="size-9 border border-border/80 bg-background/95 shadow-md backdrop-blur-sm hover:bg-background"
                  onClick={() => go(1)}
                  aria-label="Réalisation suivante"
                >
                  <ChevronRight className="size-5" aria-hidden />
                </Button>
              </div>
            </>
          ) : null}
        </div>

        {/* Caption: right rail on lg only here; mobile copy below */}
        <div className="order-3 hidden min-w-0 border-border lg:flex lg:max-w-[min(100%,340px)] lg:shrink-0 lg:flex-col lg:border-l">
          {captionBlock}
        </div>
      </div>

      {/* Mobile: thumbnails + caption */}
      <div className="border-t border-border/60 lg:hidden">
        {count > 1 ? (
          <div
            className="flex gap-2 overflow-x-auto overflow-y-hidden px-3 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory sm:justify-center sm:px-4 [&::-webkit-scrollbar]:hidden"
            role="list"
            aria-label="Miniatures"
          >
            {items.map((item, index) => thumbBtn(item, index, "bar"))}
          </div>
        ) : null}
        <div className="border-t border-border/60">{captionBlock}</div>
      </div>
    </div>
  );
}
