"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import { Send, X, Bot, User, Loader2, Wrench, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { AgentSettings, Markups } from "@/lib/types"
import {
  useEstimate,
  useEstimateActions,
} from "@/lib/estimate-store"

interface ChatPanelProps {
  open: boolean
  onClose: () => void
  agentSettings: AgentSettings
}

export function ChatPanel({ open, onClose, agentSettings }: ChatPanelProps) {
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const estimate = useEstimate()
  const actions = useEstimateActions()

  const { messages, sendMessage, status, addToolOutput } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          messages,
          id,
          model: agentSettings.model,
          temperature: agentSettings.temperature,
          maxTokens: agentSettings.maxTokens,
          systemPrompt: agentSettings.systemPrompt,
        },
      }),
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall({ toolCall }) {
      if (toolCall.dynamic) return

      if (toolCall.toolName === "updateMarkup") {
        const { field, value } = toolCall.input as {
          field: keyof Markups
          value: number
        }
        const newMarkups = { ...estimate.markups, [field]: value }
        actions.updateMarkups(newMarkups)
        addToolOutput({
          tool: "updateMarkup",
          toolCallId: toolCall.toolCallId,
          output: `Updated ${field} to ${value}%`,
        })
      } else if (toolCall.toolName === "updateLineItemCost") {
        const { description, unitCost } = toolCall.input as {
          description: string
          unitCost: number
        }
        const item = estimate.lineItems.find((li) =>
          li.description.toLowerCase().includes(description.toLowerCase())
        )
        if (item) {
          actions.updateLineItem(item.id, { unitCost })
          addToolOutput({
            tool: "updateLineItemCost",
            toolCallId: toolCall.toolCallId,
            output: `Updated "${item.description}" unit cost to $${unitCost}`,
          })
        } else {
          addToolOutput({
            tool: "updateLineItemCost",
            toolCallId: toolCall.toolCallId,
            output: `Could not find line item matching "${description}"`,
          })
        }
      } else if (toolCall.toolName === "updateLineItemQuantity") {
        const { description, quantity } = toolCall.input as {
          description: string
          quantity: number
        }
        const item = estimate.lineItems.find((li) =>
          li.description.toLowerCase().includes(description.toLowerCase())
        )
        if (item) {
          actions.updateLineItem(item.id, { quantity })
          addToolOutput({
            tool: "updateLineItemQuantity",
            toolCallId: toolCall.toolCallId,
            output: `Updated "${item.description}" quantity to ${quantity}`,
          })
        } else {
          addToolOutput({
            tool: "updateLineItemQuantity",
            toolCallId: toolCall.toolCallId,
            output: `Could not find line item matching "${description}"`,
          })
        }
      } else if (toolCall.toolName === "addLineItem") {
        const { division, description, quantity, unit, unitCost, costType } =
          toolCall.input as {
            division: string
            description: string
            quantity: number
            unit: string
            unitCost: number
            costType: "material" | "labor" | "equipment" | "subcontractor"
          }
        actions.addLineItem({
          division,
          description,
          quantity,
          unit,
          unitCost,
          costType,
        })
        addToolOutput({
          tool: "addLineItem",
          toolCallId: toolCall.toolCallId,
          output: `Added line item: ${description} (${quantity} ${unit} @ $${unitCost})`,
        })
      } else if (toolCall.toolName === "deleteLineItem") {
        const { description } = toolCall.input as { description: string }
        const item = estimate.lineItems.find((li) =>
          li.description.toLowerCase().includes(description.toLowerCase())
        )
        if (item) {
          actions.deleteLineItem(item.id)
          addToolOutput({
            tool: "deleteLineItem",
            toolCallId: toolCall.toolCallId,
            output: `Deleted line item: "${item.description}"`,
          })
        } else {
          addToolOutput({
            tool: "deleteLineItem",
            toolCallId: toolCall.toolCallId,
            output: `Could not find line item matching "${description}"`,
          })
        }
      }
    },
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  if (!open) return null

  return (
    <div className="fixed bottom-0 right-0 z-40 flex h-[500px] w-full flex-col border-l border-t bg-card shadow-2xl sm:bottom-4 sm:right-4 sm:h-[560px] sm:w-96 sm:rounded-xl sm:border">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-md bg-primary/10 p-1.5">
            <Bot className="size-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Estimating Assistant
            </p>
            <p className="text-xs text-muted-foreground">
              {agentSettings.model.split("/").pop()}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <X className="size-4" />
          <span className="sr-only">Close chat</span>
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Bot className="mb-3 size-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              Ask me about your estimate
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              I can change markups, costs, quantities, or add new items.
            </p>
          </div>
        )}
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="size-3.5 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return <span key={index}>{part.text}</span>
                  }
                  if (part.type === "tool-invocation") {
                    const isComplete = part.state === "output-available"
                    return (
                      <div
                        key={index}
                        className="my-1 flex items-center gap-2 rounded bg-background/50 px-2 py-1 text-xs"
                      >
                        {isComplete ? (
                          <Check className="size-3 text-green-600" />
                        ) : (
                          <Wrench className="size-3 animate-pulse text-primary" />
                        )}
                        <span className="text-muted-foreground">
                          {part.toolInvocation.toolName === "updateMarkup" &&
                            `Updating ${(part.toolInvocation.input as { field: string }).field}...`}
                          {part.toolInvocation.toolName ===
                            "updateLineItemCost" &&
                            `Updating cost for "${(part.toolInvocation.input as { description: string }).description}"...`}
                          {part.toolInvocation.toolName ===
                            "updateLineItemQuantity" &&
                            `Updating quantity for "${(part.toolInvocation.input as { description: string }).description}"...`}
                          {part.toolInvocation.toolName === "addLineItem" &&
                            `Adding "${(part.toolInvocation.input as { description: string }).description}"...`}
                          {part.toolInvocation.toolName === "deleteLineItem" &&
                            `Removing "${(part.toolInvocation.input as { description: string }).description}"...`}
                        </span>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
              {message.role === "user" && (
                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <User className="size-3.5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-2">
              <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="size-3.5 text-primary" />
              </div>
              <div className="rounded-lg bg-muted px-3 py-2">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t p-3"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Change overhead to 12%..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          <Send className="size-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  )
}
