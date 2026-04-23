"use client";

import { ArrowUpRight } from "lucide-react";
import { m, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

export type HubTileProps = {
  href: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
  /** Optional meta tag (e.g. "Neuf", "Rénovation"). */
  tag?: string;
  /**
   * Optional pre-rendered icon element (e.g. `<Home className="size-5" />`).
   * Must be a rendered ReactNode — server components cannot pass component
   * references across the server/client boundary.
   */
  icon?: ReactNode;
  /** Optional preview list (e.g. sub-links revealed on hover). */
  bullets?: string[];
  eager?: boolean;
  className?: string;
};

/**
 * Large, photo-forward hub tile. Used on the hub pages
 * (/construction, /renovation, /services) to replace text-only card grids.
 *
 * Must render inside a `LazyMotionProvider`.
 */
export function HubTile({
  href,
  title,
  description,
  image,
  tag,
  icon,
  bullets,
  eager = false,
  className,
}: HubTileProps) {
  const ref = useTilt<HTMLAnchorElement>({ max: 4, scale: 1 });
  const mediaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <Link
      ref={ref}
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-3xl border border-border/55 bg-card shadow-sm",
        "transition-[box-shadow,border-color] duration-300 ease-out will-change-transform",
        "hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5",
        className,
      )}
    >
      <div ref={mediaRef} className="relative aspect-16/10 overflow-hidden sm:aspect-video">
        <m.div className="absolute inset-[-6%]" style={{ y }}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            loading={eager ? "eager" : "lazy"}
            priority={eager}
          />
        </m.div>
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
          {tag ? (
            <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-white/80">
              {tag}
            </p>
          ) : null}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {icon ? (
                <span
                  className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-sm"
                  aria-hidden
                >
                  {icon}
                </span>
              ) : null}
              <h3 className="font-heading text-balance text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                {title}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85 sm:text-[0.9375rem]">
                {description}
              </p>
              {bullets && bullets.length > 0 ? (
                <ul className="mt-3 grid max-h-0 grid-cols-1 gap-1 overflow-hidden opacity-0 transition-[max-height,opacity] duration-500 ease-out group-hover:max-h-40 group-hover:opacity-100 sm:grid-cols-2">
                  {bullets.slice(0, 4).map((b) => (
                    <li
                      key={b}
                      className="text-xs text-white/80 sm:text-sm"
                    >
                      · {b}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <span
              className="mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:bg-primary group-hover:ring-primary"
              aria-hidden
            >
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
