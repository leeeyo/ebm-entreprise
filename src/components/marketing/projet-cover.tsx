"use client";

import { m, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type ProjetCoverProps = {
  src: string;
  alt: string;
  title: string;
  breadcrumb?: { href: string; label: string };
};

/** Parallax cover used on the project detail page. */
export function ProjetCover({ src, alt, title, breadcrumb }: ProjetCoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  return (
    <section
      ref={ref}
      className="relative isolate aspect-[21/9] min-h-[22rem] w-full overflow-hidden bg-muted sm:min-h-[28rem] lg:min-h-[34rem]"
    >
      <m.div className="absolute inset-[-8%]" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </m.div>
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-10 sm:px-6 sm:pb-14">
        {breadcrumb ? (
          <Link
            href={breadcrumb.href}
            className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            ← {breadcrumb.label}
          </Link>
        ) : null}
        <h1 className="font-heading text-balance text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
      </div>
    </section>
  );
}
