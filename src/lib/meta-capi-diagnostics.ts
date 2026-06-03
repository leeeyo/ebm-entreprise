import { MetaCapiEvent } from "@/models/MetaCapiEvent";

export type MetaCapiDiagnosticInput = {
  eventName: "Lead" | "Contact";
  eventId: string;
  source: "simulator" | "contact";
  status:
    | "success"
    | "http_error"
    | "network_error"
    | "skipped_disabled"
    | "skipped_missing_config";
  eventSourceUrl?: string;
  valueTnd?: number;
  httpStatus?: number;
  errorMessage?: string;
  eventsReceived?: number;
  fbtraceId?: string;
  graphVersion?: string;
  testEventCodeUsed?: boolean;
};

export async function recordMetaCapiDiagnostic(input: MetaCapiDiagnosticInput) {
  try {
    await MetaCapiEvent.create(input);
  } catch (error) {
    console.error(
      "[meta-capi] diagnostic write failed:",
      error instanceof Error ? error.message : error,
    );
  }
}
