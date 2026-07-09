import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const BM_GROUP_URL = "https://bmgroup.tn";

export function BMGroupFooterBadge() {
  return (
    <a
      href={BM_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visiter BM Group"
      className="inline-flex w-fit items-center gap-3 rounded-xl border bg-white p-3 pr-4 shadow-sm transition-all duration-300 hover:border-[var(--ebm-orange)]/70 hover:shadow-md"
    >
      <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-muted/60 p-2">
        <Image
          src="/bmgroup.png"
          alt="BM Group"
          width={120}
          height={72}
          className="h-auto max-h-8 w-auto object-contain"
        />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ebm-orange)]">
          Membre de
        </span>
        <span className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--ebm-navy)]">
          BM Group
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        </span>
      </span>
    </a>
  );
}
