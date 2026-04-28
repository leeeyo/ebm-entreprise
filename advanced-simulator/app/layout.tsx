import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://loadbear.vercel.app"),
  title: "LoadBear — Construction Estimate Builder",
  description:
    "Construction estimate starter kit for GCs and subs. CSI line items, division grouping, configurable markups, live bid totals, and an AI estimating agent. Built with Next.js 16 and AI SDK 6.",
  openGraph: {
    title: "LoadBear — Construction Estimate Builder",
    description:
      "Fork-ready Next.js starter kit for construction estimating: CSI divisions, markup section, AI agent, and live bid summary.",
    images: [{ url: "/og-preview", width: 1200, height: 630 }],
  },
}

export const viewport: Viewport = {
  themeColor: "#b37a1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="bottom-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
