"use client";

import { m, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { Reveal } from "@/components/home/reveal";
import { cn } from "@/lib/utils";

export type ImageSplitBlockProps = {
  image: { src: string; alt: string };
  eyebrow?: string;
  title: ReactNode;
  body: ReactNode;
  children?: ReactNode;
  /** Image side on desktop. Defaults to right. */
  imageSide?: "left" | "right";
  className?: string;
};

/**
 * Alternating copy + photo block with a small parallax on the cover.
 * Must be rendered inside a `LazyMotionProvider`.
 */
export function ImageSplitBlock({
  image,
  eyebrow,
  title,
  body,
  children,
  imageSide = "right",
  className,
}: ImageSplitBlockProps) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const flip = imageSide === "left";

  return (
    <div
      className={cn(
        "grid items-center gap-10 md:grid-cols-2 md:gap-14",
        className,
      )}
    >
      <Reveal variant="fade-up" className={cn(flip ? "md:order-2" : "md:order-1")}>
        <div className="max-w-xl">
          {eyebrow ? (
            <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="font-heading text-balance text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            {title}
          </h3>
          <div className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            {body}
          </div>
          {children ? <div className="mt-6">{children}</div> : null}
        </div>
      </Reveal>

      <Reveal
        delayMs={120}
        variant="fade-up"
        className={cn(flip ? "md:order-1" : "md:order-2")}
      >
        <div
          ref={mediaRef}
          className="relative aspect-4/3 overflow-hidden rounded-3xl border border-border/55 bg-muted shadow-sm"
        >
          <m.div className="absolute inset-[-6%]" style={{ y }}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
          </m.div>
        </div>
      </Reveal>
    </div>
  );
}
