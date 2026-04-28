import { Thumbnail } from "@/components/docs/brand-assets"

interface Props {
  searchParams: Promise<{ v?: string }>
}

export default async function ThumbnailPage({ searchParams }: Props) {
  const params = await searchParams
  const v = parseInt(params.v ?? "1")
  const variant = ([1, 2, 3, 4, 5].includes(v) ? v : 1) as 1 | 2 | 3 | 4 | 5

  return (
    <div
      className="flex items-center justify-center bg-[oklch(0.12_0.01_260)]"
      style={{ width: "100vw", height: "100vh" }}
    >
      <div style={{ width: "1200px", maxWidth: "100vw" }}>
        <Thumbnail variant={variant} />
      </div>
    </div>
  )
}
