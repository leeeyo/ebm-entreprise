export default function MarketingLoading() {
  return (
    <section
      className="mx-auto w-full max-w-6xl animate-pulse px-4 py-16 sm:px-6 sm:py-20"
      aria-label="Chargement"
      aria-live="polite"
    >
      <span className="sr-only">Chargement de la page</span>
      <div className="h-4 w-28 rounded-full bg-muted" aria-hidden />
      <div className="mt-5 h-10 max-w-xl rounded-xl bg-muted" aria-hidden />
      <div className="mt-4 h-5 max-w-2xl rounded-lg bg-muted/70" aria-hidden />
      <div className="mt-10 grid gap-5 sm:grid-cols-3" aria-hidden>
        <div className="h-44 rounded-3xl bg-muted/70" />
        <div className="h-44 rounded-3xl bg-muted/70" />
        <div className="h-44 rounded-3xl bg-muted/70" />
      </div>
    </section>
  );
}
