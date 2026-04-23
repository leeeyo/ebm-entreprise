"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useMagnetic } from "@/hooks/use-magnetic";

type MagneticLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
    strength?: number;
    radius?: number;
  };

/** `next/link` that adds a magnetic pointer-follow hover. */
export function MagneticLink({
  children,
  strength = 8,
  radius = 120,
  className,
  ...rest
}: MagneticLinkProps) {
  const ref = useMagnetic<HTMLAnchorElement>({ strength, radius });
  return (
    <Link ref={ref} className={className} {...rest}>
      {children}
    </Link>
  );
}
