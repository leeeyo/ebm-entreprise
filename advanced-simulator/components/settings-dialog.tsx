"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AgentSettings } from "@/lib/types"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agentSettings: AgentSettings
  onUpdateAgentSettings: (settings: AgentSettings) => void
}

const MODELS = [
  { value: "anthropic/claude-opus-4-6", label: "Claude Opus 4.6" },
  { value: "openai/gpt-5.4", label: "GPT 5.4" },
]

export function SettingsDialog({
  open,
  onOpenChange,
  agentSettings,
  onUpdateAgentSettings,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="agent" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="general" className="flex-1">
              General
            </TabsTrigger>
            <TabsTrigger value="agent" className="flex-1">
              Agent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                LoadBear is a construction estimate builder for GCs and subs.
                All data is stored locally in your browser session.
              </p>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  About
                </p>
                <p className="text-sm text-foreground">
                  Built with Next.js, shadcn/ui, and AI SDK 6 via the Vercel AI
                  Gateway.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="agent" className="mt-4">
            <div className="flex flex-col gap-5">
              {/* Model */}
              <div className="grid gap-2">
                <Label>Model</Label>
                <Select
                  value={agentSettings.model}
                  onValueChange={(v) =>
                    onUpdateAgentSettings({ ...agentSettings, model: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Temperature */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Temperature</Label>
                  <span className="font-mono text-xs text-muted-foreground">
                    {agentSettings.temperature.toFixed(1)}
                  </span>
                </div>
                <Slider
                  value={[agentSettings.temperature]}
                  onValueChange={([v]) =>
                    onUpdateAgentSettings({ ...agentSettings, temperature: v })
                  }
                  min={0}
                  max={1}
                  step={0.1}
                />
                <p className="text-xs text-muted-foreground">
                  Lower = more precise, higher = more creative
                </p>
              </div>

              {/* Max tokens */}
              <div className="grid gap-2">
                <Label htmlFor="max-tokens">Max Tokens</Label>
                <Input
                  id="max-tokens"
                  type="number"
                  value={agentSettings.maxTokens}
                  onChange={(e) =>
                    onUpdateAgentSettings({
                      ...agentSettings,
                      maxTokens: parseInt(e.target.value) || 2048,
                    })
                  }
                />
              </div>

              {/* System prompt */}
              <div className="grid gap-2">
                <Label htmlFor="sys-prompt">System Prompt</Label>
                <Textarea
                  id="sys-prompt"
                  rows={5}
                  className="text-xs leading-relaxed font-mono"
                  value={agentSettings.systemPrompt}
                  onChange={(e) =>
                    onUpdateAgentSettings({
                      ...agentSettings,
                      systemPrompt: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Defines the AI assistant{"'"}s behavior and expertise context.
                </p>
              </div>

              {/* Capabilities */}
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Agent Capabilities
                </p>
                <ul className="flex flex-col gap-1.5 text-xs text-foreground">
                  <li>Estimate scope review & validation</li>
                  <li>Unit cost research & benchmarking</li>
                  <li>Markup strategy recommendations</li>
                  <li>CSI division classification help</li>
                  <li>Bid competitiveness analysis</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
