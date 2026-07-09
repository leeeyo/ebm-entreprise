import { ArrowUpRight } from "lucide-react";

const BM_GROUP_URL = "https://bmgroup.tn";

export function BMGroupGateway() {
  return (
    <section className="bg-muted/30 text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-12">
        <a
          href={BM_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Découvrir BM Group"
          className="group relative grid gap-6 overflow-hidden rounded-lg border bg-white p-5 shadow-[0_18px_55px_-38px_rgba(25,52,92,0.55)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--ebm-orange)]/60 hover:shadow-[0_24px_70px_-42px_rgba(25,52,92,0.7)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"
        >
          <span
            aria-hidden
            className="absolute inset-y-5 left-0 w-1 rounded-r-full bg-[var(--ebm-orange)]"
          />
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--ebm-orange)]">
              Une expertise du groupe
            </p>
            <div>
              <h2 className="font-heading max-w-4xl text-2xl font-bold tracking-tight !text-[var(--ebm-navy)] sm:text-3xl">
                BM Group rassemble construction, immobilier et agencement.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                Découvrez la vision commune, les sociétés du groupe et les projets
                portés par la famille Ben Mokhtar en Tunisie.
              </p>
            </div>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-md bg-[var(--ebm-orange)] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-18px_rgba(255,140,0,0.9)] transition group-hover:bg-[var(--ebm-navy)]">
            Visiter bmgroup.tn
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        </a>
      </div>
    </section>
  );
}
