"use client"

import Link from "next/link"
import { HardHat, Menu, Settings, MessageSquare, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface AppHeaderProps {
  onToggleChat: () => void
  onToggleSettings: () => void
  chatOpen: boolean
  subpage?: string
}

export function AppHeader({
  onToggleChat,
  onToggleSettings,
  chatOpen,
  subpage,
}: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center justify-center rounded-lg bg-primary p-1.5 transition-opacity hover:opacity-80">
            <HardHat className="size-5 text-primary-foreground" />
          </Link>
          <div className="flex items-center gap-1.5">
            <Link href="/" className="text-lg font-bold tracking-tight text-foreground hover:text-primary transition-colors">
              LoadBear
            </Link>
            {subpage && (
              <>
                <ChevronRight className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{subpage}</span>
              </>
            )}
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant={chatOpen ? "default" : "outline"}
            size="sm"
            onClick={onToggleChat}
          >
            <MessageSquare className="size-4" />
            AI Assistant
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleSettings}>
            <Settings className="size-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="size-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </header>

      {/* Full-screen mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-card p-6 md:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center justify-center rounded-lg bg-primary p-1.5">
                <HardHat className="size-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">LoadBear</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="size-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="mt-12 flex flex-col gap-4">
            <Button
              variant="outline"
              size="lg"
              className="justify-start"
              onClick={() => {
                onToggleChat()
                setMobileMenuOpen(false)
              }}
            >
              <MessageSquare className="size-5" />
              AI Assistant
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="justify-start"
              onClick={() => {
                onToggleSettings()
                setMobileMenuOpen(false)
              }}
            >
              <Settings className="size-5" />
              Settings
            </Button>
          </nav>
        </div>
      )}
    </>
  )
}
