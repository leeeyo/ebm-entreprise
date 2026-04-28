import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
  };
};

export function AdminPageHeader({ eyebrow, title, description, action }: AdminPageHeaderProps) {
  const actionButton = action?.href ? (
    <Button asChild className="bg-ebm-navy text-white hover:opacity-90">
      <Link href={action.href}>{action.label}</Link>
    </Button>
  ) : action ? (
    <Button type="button" className="bg-ebm-navy text-white hover:opacity-90">
      {action.label}
    </Button>
  ) : null;

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-ebm-navy text-white shadow-2xl">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_16px)]" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-96 translate-y-16 rounded-full bg-white/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge className="mb-4 border-white/15 bg-white/10 text-white hover:bg-white/10">{eyebrow}</Badge>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">{description}</p>
        </div>
        {actionButton ? <div className="shrink-0">{actionButton}</div> : null}
      </div>
    </section>
  );
}

type AdminMetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "dark" | "light" | "orange";
};

export function AdminMetricCard({ label, value, detail, icon: Icon, tone = "light" }: AdminMetricCardProps) {
  return (
    <Card
      className={cn(
        "rounded-3xl border-black/10 shadow-sm transition-transform hover:-translate-y-0.5",
        tone === "dark" && "bg-ebm-navy text-white",
        tone === "orange" && "border-primary/30 bg-primary/10",
      )}
    >
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className={cn("text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground", tone === "dark" && "text-white/55")}>
            {label}
          </p>
          <p className="mt-3 font-heading text-2xl font-semibold tracking-tight">{value}</p>
          <p className={cn("mt-2 text-sm text-muted-foreground", tone === "dark" && "text-white/65")}>{detail}</p>
        </div>
        <span
          className={cn(
            "rounded-2xl border border-black/10 bg-white p-3 text-ebm-navy shadow-sm",
            tone === "dark" && "border-white/15 bg-white/10 text-white",
          )}
        >
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}

type AdminWorkspaceCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  meta: string;
};

export function AdminWorkspaceCard({ title, description, href, icon: Icon, meta }: AdminWorkspaceCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full rounded-3xl border-black/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
        <CardHeader>
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-2xl bg-ebm-navy p-3 text-white">
              <Icon className="size-5" />
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{meta}</span>
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="leading-6">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-ebm-navy">
            Ouvrir l'espace
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

type FieldShellProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

export function FieldShell({ label, hint, children }: FieldShellProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint ? <span className="block text-xs leading-5 text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

type EditorialPanelProps = {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

export function EditorialPanel({ title, description, children, className }: EditorialPanelProps) {
  return (
    <Card className={cn("rounded-3xl border-black/10 shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="leading-6">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
