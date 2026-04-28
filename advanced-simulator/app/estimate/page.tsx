"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { ProjectHeader } from "@/components/project-header"
import { LineItemsTable } from "@/components/line-items-table"
import { MarkupSection } from "@/components/markup-section"
import { BidSummary } from "@/components/bid-summary"
import { ChatPanel } from "@/components/chat-panel"
import { SettingsDialog } from "@/components/settings-dialog"
import type { AgentSettings } from "@/lib/types"
import defaultAgentSettings from "@/data/agent-settings.json"

export default function EstimatePage() {
  const [chatOpen, setChatOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [agentSettings, setAgentSettings] = useState<AgentSettings>(
    defaultAgentSettings as AgentSettings
  )

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        onToggleChat={() => setChatOpen((v) => !v)}
        onToggleSettings={() => setSettingsOpen(true)}
        chatOpen={chatOpen}
        subpage="Estimate"
      />

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <ProjectHeader />

          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="flex flex-col gap-6">
              <LineItemsTable />
              <MarkupSection />
            </div>
            <div className="lg:sticky lg:top-20 lg:self-start">
              <BidSummary />
            </div>
          </div>
        </div>
      </main>

      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        agentSettings={agentSettings}
      />

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        agentSettings={agentSettings}
        onUpdateAgentSettings={setAgentSettings}
      />
    </div>
  )
}
