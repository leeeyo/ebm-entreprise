import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/home/reveal";
import { cn } from "@/lib/utils";

export type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Optional side link (desktop only is enforced by layout). */
  link?: { href: string; label: string };
  /** Center the heading block. */
  centered?: boolean;
  /** Level tag (defaults to h2). */
  as?: "h2" | "h3";
  className?: string;
};

/** Standardized section heading used across every marketing page. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  link,
  centered = false,
  as = "h2",
  className,
}: SectionHeadingProps) {
  const Tag = as;
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        centered && "flex-col items-center text-center",
        className,
      )}
    >
      <Reveal variant="fade-up">
        <div className={cn("max-w-2xl", centered && "mx-auto")}>
          <span
            className={cn(
              "mb-3 block h-1 w-9 rounded-full bg-primary/80",
              centered && "mx-auto",
            )}
            aria-hidden
          />
          {eyebrow ? (
            <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <Tag
            className={cn(
              "font-heading text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl",
            )}
          >
            {title}
          </Tag>
          {subtitle ? (
            <p className="mt-3 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>
      </Reveal>

      {link ? (
        <Reveal delayMs={80} variant="fade-up">
          <Link
            href={link.href}
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            {link.label}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      ) : null}
    </div>
  );
}
