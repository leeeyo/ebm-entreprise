import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import {
  BookOpenText,
  BriefcaseBusiness,
  FileQuestion,
  FolderKanban,
  Home,
  Inbox,
  Landmark,
  Newspaper,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/admin/actions";
import Image from "next/image";

const primaryNav = [
  { label: "Vue d'ensemble", href: "/admin", icon: Home },
  { label: "Leads simulateur", href: "/admin/leads", icon: Inbox },
  { label: "Demandes contact", href: "/admin/contact-forms", icon: BookOpenText },
  { label: "Tarification", href: "/admin/settings", icon: SlidersHorizontal },
] as const;

const contentNav = [
  { label: "Services", href: "/admin/content/services", icon: BriefcaseBusiness },
  { label: "Projets", href: "/admin/content/projects", icon: FolderKanban },
  { label: "FAQ", href: "/admin/content/faq", icon: FileQuestion },
  { label: "Blog MD", href: "/admin/content/blog", icon: Newspaper },
  { label: "Site global", href: "/admin/site", icon: Settings },
] as const;

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f1ec] text-foreground">
      <div className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-black/10 bg-ebm-navy text-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 p-6">
            <Link href="/admin" className="flex items-center gap-3">
              <Image src="/logo-ebm.png" alt="EBM Ben Mokhtar" width={44} height={44} />
              <span className="font-heading text-lg font-semibold tracking-tight">قاعة العمليات</span>
            </Link>
          </div>
          <div className="flex-1 space-y-7 overflow-y-auto p-4">
            <AdminNavGroup title="Opérations" items={primaryNav} />
            <AdminNavGroup title="Paramètres du site" items={contentNav} />
          </div>
          <div className="space-y-3 border-t border-white/10 p-4">
            <Button asChild variant="outline" className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10">
              <Link href="/">
                <Landmark className="size-4" />
                Site public
              </Link>
            </Button>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" className="w-full border-white/15 bg-transparent text-white hover:bg-white/10">
                Déconnexion
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-black/10 bg-[#f4f1ec]/90 backdrop-blur-xl lg:hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <Link href="/admin" className="font-heading text-lg font-semibold">
              EBM Admin
            </Link>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm">
                Déconnexion
              </Button>
            </form>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-3 text-sm">
            {[...primaryNav, ...contentNav].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full border bg-white px-3 py-1.5 text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

type AdminNavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

function AdminNavGroup({ title, items }: { title: string; items: readonly AdminNavItem[] }) {
  return (
    <nav className="space-y-2">
      <p className="px-3 text-xs font-medium uppercase tracking-[0.24em] text-white/35">{title}</p>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
