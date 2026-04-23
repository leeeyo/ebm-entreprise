"use client";

import { ArrowUpRight } from "lucide-react";
import { m, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

export type ProjectCardItem = {
  slug: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  /** Optional meta tag shown above the title (e.g. "Résidentiel"). */
  tag?: string;
};

export type ProjectCardProps = {
  item: ProjectCardItem;
  /** If true, image is fetched eagerly (above the fold). */
  eager?: boolean;
  /** Aspect ratio to use on the cover. */
  aspect?: "4/5" | "3/4" | "16/10";
  className?: string;
};

/**
 * Unified project card — tilt + cover parallax. Must render inside a
 * `LazyMotionProvider` (typically the page level).
 */
export function ProjectCard({
  item,
  eager = false,
  aspect = "4/5",
  className,
}: ProjectCardProps) {
  const outerRef = useTilt<HTMLAnchorElement>({ max: 5, scale: 1 });
  const mediaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  const aspectClass =
    aspect === "3/4"
      ? "aspect-3/4"
      : aspect === "16/10"
        ? "aspect-16/10"
        : "aspect-4/5";

  return (
    <Link
      ref={outerRef}
      href={`/projets/${item.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-3xl border border-border/55 bg-card shadow-sm",
        "transition-[box-shadow,border-color] duration-300 ease-out will-change-transform",
        "hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5",
        className,
      )}
    >
      <div ref={mediaRef} className="relative overflow-hidden">
        <div className={cn("relative w-full bg-muted", aspectClass)}>
          {item.image ? (
            <m.div className="absolute inset-[-7%]" style={{ y }}>
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
                loading={eager ? "eager" : "lazy"}
                priority={eager}
              />
            </m.div>
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-zinc-200 to-zinc-500 dark:from-zinc-800 dark:to-zinc-950" />
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent"
            aria-hidden
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
          {item.tag ? (
            <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/75">
              {item.tag}
            </p>
          ) : null}
          <div className="translate-y-2 transition-transform duration-400 ease-out group-hover:translate-y-0">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-heading text-lg font-semibold leading-tight tracking-tight">
                {item.title}
              </h3>
              <span
                className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:bg-primary group-hover:ring-primary"
                aria-hidden
              >
                <ArrowUpRight className="size-4" />
              </span>
            </div>
            <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-white/85 opacity-85 transition-opacity duration-300 group-hover:opacity-100 sm:text-[0.9375rem]">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
