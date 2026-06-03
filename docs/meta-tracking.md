# Meta Pixel + Conversions API

This project implements a paired browser Pixel and server Conversions API layer.

## Environment

Set these variables in production:

```bash
NEXT_PUBLIC_META_PIXEL_ID=
META_PIXEL_ID=
META_ACCESS_TOKEN=
META_GRAPH_API_VERSION=v25.0
META_TEST_EVENT_CODE=
NEXT_PUBLIC_META_TRACKING_DISABLED=false
META_TRACKING_DISABLED=false
NEXT_PUBLIC_SITE_URL=https://example.com
```

- `NEXT_PUBLIC_META_PIXEL_ID` enables browser Pixel.
- `META_PIXEL_ID` is an optional server-side fallback override.
- `META_ACCESS_TOKEN` enables server CAPI.
- `META_GRAPH_API_VERSION` defaults to `v25.0`.
- `META_TEST_EVENT_CODE` sends events into Meta Events Manager Test Events.
- `NEXT_PUBLIC_META_TRACKING_DISABLED` disables browser Pixel and browser event relay.
- `META_TRACKING_DISABLED` disables server CAPI.
- `NEXT_PUBLIC_SITE_URL` is used to validate `event_source_url`; `AUTH_URL` and `VERCEL_URL` are fallbacks.

## Event Mapping

- Public route changes: Pixel `PageView` plus CAPI `PageView`.
- Service, project, news, and simulator pages: Pixel/CAPI `ViewContent`.
- Simulator first interaction: custom `SimulationStarted`.
- Simulator success: standard `Lead`, optimized as the main campaign conversion.
- Contact form first interaction: custom `ContactFormStarted`.
- Contact form success: standard `Contact`, kept separate from simulator `Lead`.

For `Lead` and `Contact`, the MongoDB document `_id` is returned to the browser and reused as the shared Pixel/CAPI `event_id` for deduplication.

## Diagnostics

The admin page at `/admin/meta` shows:

- Pixel and CAPI configuration status.
- Graph API version and test event code status.
- Tracking kill-switch status.
- Recent high-value CAPI attempts for `Lead` and `Contact`.

Only high-value conversion attempts and failures are stored in MongoDB. Pageviews and other low-funnel relay events are not persisted as diagnostics.

## Meta References

- Meta April 15, 2026 announcement: https://about.fb.com/br/news/2026/04/removendo-barreiras-tecnicas-para-ajudar-empresas-de-todos-os-tamanhos-a-obterem-melhores-resultados-com-seus-anuncios/
- Meta CAPI schema reference: https://github.com/facebookarchive/Facebook-Server-Side-API-Swagger/blob/main/server-side-api.yaml
- Meta Node SDK: https://github.com/facebook/facebook-nodejs-business-sdk
