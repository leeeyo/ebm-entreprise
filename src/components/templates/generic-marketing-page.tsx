import { notFound } from "next/navigation";
import { MarketingInnerPage } from "@/components/templates/marketing-inner-page";
import { genericServicePages } from "@/content/service-pages";

export function GenericMarketingPage({ pageKey }: { pageKey: string }) {
  const data = genericServicePages[pageKey];
  if (!data) {
    notFound();
  }
  return (
    <MarketingInnerPage h1={data.title} intro={data.intro}>
      <section>
        <h2 className="text-xl font-semibold">Points clés</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          {data.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>
    </MarketingInnerPage>
  );
}
