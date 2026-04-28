import { OGImage, OGImageAlt } from "@/components/docs/brand-assets"

export default async function OGPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ alt?: string }>
}) {
  const params = await searchParams
  const showAlt = params.alt === "1"

  return (
    <div
      className="flex items-center justify-center bg-[oklch(0.12_0.01_260)]"
      style={{ width: "100vw", height: "100vh" }}
    >
      <div style={{ width: "1200px", maxWidth: "100vw" }}>
        {showAlt ? <OGImageAlt /> : <OGImage />}
      </div>
    </div>
  )
}
