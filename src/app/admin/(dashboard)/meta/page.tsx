import type { LucideIcon } from "lucide-react";
import { Activity, AlertTriangle, CheckCircle2, KeyRound, Settings, ShieldCheck } from "lucide-react";
import { AdminMetricCard, AdminPageHeader, EditorialPanel } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { connectDB } from "@/lib/db";
import { MetaCapiEvent } from "@/models/MetaCapiEvent";

type MetaCapiStatus =
  | "success"
  | "http_error"
  | "network_error"
  | "skipped_disabled"
  | "skipped_missing_config";

type MetaCapiEventRow = {
  _id: unknown;
  eventName: "Lead" | "Contact";
  eventId: string;
  source: "simulator" | "contact";
  status: MetaCapiStatus;
  eventSourceUrl?: string;
  valueTnd?: number;
  httpStatus?: number;
  errorMessage?: string;
  eventsReceived?: number;
  fbtraceId?: string;
  graphVersion?: string;
  testEventCodeUsed?: boolean;
  createdAt?: Date | string;
};

const statusLabels: Record<MetaCapiStatus, string> = {
  success: "Succès",
  http_error: "Erreur HTTP",
  network_error: "Erreur réseau",
  skipped_disabled: "Désactivé",
  skipped_missing_config: "Config manquante",
};

const statusClasses: Record<MetaCapiStatus, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  http_error: "border-red-200 bg-red-50 text-red-700",
  network_error: "border-red-200 bg-red-50 text-red-700",
  skipped_disabled: "border-slate-200 bg-slate-50 text-slate-700",
  skipped_missing_config: "border-amber-200 bg-amber-50 text-amber-700",
};

const dateFormatter = new Intl.DateTimeFormat("fr-TN", {
  dateStyle: "medium",
  timeStyle: "short",
});

function envFlagEnabled(...values: Array<string | undefined>) {
  return values.some((value) => {
    const normalized = value?.trim().toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "yes";
  });
}

function configuredLabel(value: boolean) {
  return value ? "Configuré" : "Manquant";
}

function formatDate(value: MetaCapiEventRow["createdAt"]) {
  if (!value) return "Date inconnue";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "Date inconnue" : dateFormatter.format(date);
}

function formatTnd(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Sans valeur";
  return `${Math.round(value).toLocaleString("fr-TN")} TND`;
}

function ConfigStatus({
  icon: Icon,
  label,
  value,
  detail,
  ok,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  ok: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-xl bg-ebm-navy p-2 text-white">
          <Icon className="size-4" />
        </span>
        <Badge className={ok ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"}>{value}</Badge>
      </div>
      <p className="mt-4 font-medium">{label}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
    </div>
  );
}

export default async function AdminMetaDiagnosticsPage() {
  await connectDB();

  const publicPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const serverPixelId = process.env.META_PIXEL_ID?.trim() || publicPixelId;
  const accessToken = process.env.META_ACCESS_TOKEN?.trim();
  const graphVersion = process.env.META_GRAPH_API_VERSION?.trim() || "v25.0";
  const testEventCode = process.env.META_TEST_EVENT_CODE?.trim();
  const trackingDisabled = envFlagEnabled(
    process.env.META_TRACKING_DISABLED,
    process.env.NEXT_PUBLIC_META_TRACKING_DISABLED,
  );

  const [recentEvents, failureCount, leadCount, contactCount] = await Promise.all([
    MetaCapiEvent.find({}).sort({ createdAt: -1 }).limit(30).lean(),
    MetaCapiEvent.countDocuments({ status: { $ne: "success" } }),
    MetaCapiEvent.countDocuments({ eventName: "Lead" }),
    MetaCapiEvent.countDocuments({ eventName: "Contact" }),
  ]);
  const rows = recentEvents as MetaCapiEventRow[];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Meta diagnostics"
        title="Contrôle Pixel + Conversions API"
        description="Suivre la configuration Meta et les derniers signaux serveur à forte valeur pour le simulateur et le formulaire contact."
        action={{ label: "Voir les leads", href: "/admin/leads" }}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          icon={Activity}
          label="CAPI Lead"
          value={`${leadCount} tentatives`}
          detail="Optimisation principale du simulateur."
          tone="dark"
        />
        <AdminMetricCard
          icon={ShieldCheck}
          label="CAPI Contact"
          value={`${contactCount} tentatives`}
          detail="Optimisation séparée du formulaire."
          tone="orange"
        />
        <AdminMetricCard
          icon={AlertTriangle}
          label="Alertes"
          value={`${failureCount}`}
          detail="Erreurs, config manquante ou tracking désactivé."
        />
        <AdminMetricCard
          icon={Settings}
          label="Graph API"
          value={graphVersion}
          detail={testEventCode ? "Test Events activé." : "Aucun code de test actif."}
        />
      </div>

      <EditorialPanel
        title="Configuration active"
        description="Les statuts ci-dessous masquent les secrets et ne confirment que leur présence."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <ConfigStatus
            icon={Activity}
            label="Pixel navigateur"
            value={configuredLabel(Boolean(publicPixelId))}
            detail="Suit les visiteurs directement depuis le site web."
            ok={Boolean(publicPixelId)}
          />
          <ConfigStatus
            icon={KeyRound}
            label="CAPI serveur"
            value={configuredLabel(Boolean(serverPixelId && accessToken))}
            detail="Envoie les conversions à Meta depuis le serveur, plus fiable."
            ok={Boolean(serverPixelId && accessToken)}
          />
          <ConfigStatus
            icon={Settings}
            label="Test Events"
            value={testEventCode ? "Actif" : "Inactif"}
            detail="Mode test qui affiche les conversions en direct dans Events Manager."
            ok={Boolean(testEventCode)}
          />
          <ConfigStatus
            icon={CheckCircle2}
            label="Kill switch"
            value={trackingDisabled ? "Actif" : "Inactif"}
            detail="Interrupteur qui coupe entièrement le suivi Meta quand il est activé."
            ok={!trackingDisabled}
          />
        </div>
      </EditorialPanel>

      <EditorialPanel
        title="Derniers événements CAPI"
        description="Journal limité aux événements Lead et Contact, avec les échecs et les envois réussis les plus récents."
      >
        {rows.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-3 border-b bg-muted/40 px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground md:grid-cols-[0.7fr_0.8fr_1fr_1fr_1.2fr]">
              <span>Événement</span>
              <span>Statut</span>
              <span className="hidden md:block">Valeur</span>
              <span className="hidden md:block">Date</span>
              <span>Trace</span>
            </div>
            <div className="divide-y">
              {rows.map((event) => (
                <div
                  key={String(event._id)}
                  className="grid grid-cols-[1fr_1fr_1fr] gap-3 px-4 py-3 text-sm md:grid-cols-[0.7fr_0.8fr_1fr_1fr_1.2fr]"
                >
                  <div>
                    <p className="font-medium">{event.eventName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{event.source}</p>
                  </div>
                  <div>
                    <Badge variant="outline" className={statusClasses[event.status]}>
                      {statusLabels[event.status]}
                    </Badge>
                    {event.httpStatus ? <p className="mt-1 text-xs text-muted-foreground">HTTP {event.httpStatus}</p> : null}
                  </div>
                  <p className="hidden text-muted-foreground md:block">{formatTnd(event.valueTnd)}</p>
                  <p className="hidden text-muted-foreground md:block">{formatDate(event.createdAt)}</p>
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs text-muted-foreground">{event.eventId}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {event.errorMessage ?? event.fbtraceId ?? `${event.eventsReceived ?? 0} reçu`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-white p-6 text-sm text-muted-foreground">
            Aucun événement Lead ou Contact n'a encore été enregistré.
          </div>
        )}
      </EditorialPanel>
    </div>
  );
}
