import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, ShieldCheck, SlidersHorizontal, UsersRound } from "lucide-react";
import { AdminLoginForm } from "@/app/admin/login/login-form";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <section className="relative grid min-h-screen lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.72fr)]">
        <div className="relative flex min-h-[54vh] flex-col justify-between overflow-hidden bg-ebm-navy px-5 py-6 text-white sm:px-8 lg:min-h-screen lg:px-12 lg:py-10">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_18px)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-3xl"
            aria-hidden
          />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <Image src="/logo-ebm.png" alt="EBM Ben Mokhtar" width={46} height={46} priority />
              <div>
                <p className="font-heading text-lg font-semibold tracking-tight">EBM Ben Mokhtar</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Back-office</p>
              </div>
            </Link>
            <Link
              href="/"
              className="hidden items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Site public
            </Link>
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-5xl items-end gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Salle des opérations</p>
              <h1 className="font-heading mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                Accès propre. Décisions rapides.
              </h1>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white p-4 shadow-2xl shadow-black/25">
              <div className="relative mx-auto aspect-square max-w-64 overflow-hidden rounded-[1.5rem] bg-white">
                <Image
                  src="/mascot/mascot-landing-without-background.png"
                  alt="Mascotte EBM accueillant l'équipe dans le back-office"
                  fill
                  priority
                  sizes="(min-width: 1024px) 320px, 256px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="relative z-10 grid gap-3 text-sm text-white/70 sm:grid-cols-3">
            {[
              { icon: UsersRound, label: "Leads qualifiés" },
              { icon: SlidersHorizontal, label: "Tarifs maîtrisés" },
              { icon: ShieldCheck, label: "Accès protégé" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <Icon className="size-4 text-primary" aria-hidden />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative flex items-center justify-center bg-[#f4f1ec] px-4 py-10 sm:px-6 lg:px-10">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,140,0,0.12),transparent_38%)]"
            aria-hidden
          />
          <div className="relative w-full max-w-md">
            <Suspense
              fallback={
                <div className="rounded-3xl border border-black/10 bg-white p-8 text-center text-sm text-muted-foreground shadow-xl">
                  Chargement de l&apos;accès sécurisé…
                </div>
              }
            >
              <AdminLoginForm />
            </Suspense>
            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ebm-navy hover:text-primary sm:hidden"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Retour au site public
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
