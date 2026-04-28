import {
  consumeStream,
  convertToModelMessages,
  streamText,
  tool,
  type UIMessage,
} from "ai"
import { z } from "zod"

export const maxDuration = 30

// Define tools that the AI can use to modify the estimate
// These tools don't have execute functions - they'll be executed client-side
const estimateTools = {
  updateMarkup: tool({
    description:
      "Update a markup percentage on the estimate. Use this when the user asks to change overhead, profit, contingency, bond, or sales tax percentages.",
    inputSchema: z.object({
      field: z
        .enum(["overhead", "profit", "contingency", "bond", "salesTax"])
        .describe("Which markup field to update"),
      value: z
        .number()
        .min(0)
        .max(100)
        .describe("The new percentage value (e.g., 10 for 10%)"),
    }),
  }),
  updateLineItemCost: tool({
    description:
      "Update the unit cost of a specific line item. Use this when the user asks to change a price or cost for a particular item.",
    inputSchema: z.object({
      description: z
        .string()
        .describe(
          "The description of the line item to update (partial match is fine)"
        ),
      unitCost: z.number().min(0).describe("The new unit cost in dollars"),
    }),
  }),
  updateLineItemQuantity: tool({
    description:
      "Update the quantity of a specific line item. Use this when the user asks to change quantity, amount, or count of an item.",
    inputSchema: z.object({
      description: z
        .string()
        .describe(
          "The description of the line item to update (partial match is fine)"
        ),
      quantity: z.number().min(0).describe("The new quantity"),
    }),
  }),
  addLineItem: tool({
    description:
      "Add a new line item to the estimate. Use this when the user asks to add a cost, item, or work item.",
    inputSchema: z.object({
      division: z
        .string()
        .describe(
          "Division ID (e.g., '02' for Site Work, '03' for Concrete, '05' for Metals, '07' for Thermal/Moisture, '09' for Finishes, '15' for Mechanical, '16' for Electrical, '01' for General Conditions)"
        ),
      description: z.string().describe("Description of the line item"),
      quantity: z.number().min(0).describe("Quantity"),
      unit: z
        .string()
        .describe("Unit of measure (SF, LF, EA, CY, HR, LS, etc.)"),
      unitCost: z.number().min(0).describe("Unit cost in dollars"),
      costType: z
        .enum(["material", "labor", "equipment", "subcontractor"])
        .describe("Type of cost"),
    }),
  }),
  deleteLineItem: tool({
    description:
      "Remove a line item from the estimate. Use this when the user asks to remove, delete, or take out an item.",
    inputSchema: z.object({
      description: z
        .string()
        .describe(
          "The description of the line item to delete (partial match is fine)"
        ),
    }),
  }),
}

export async function POST(req: Request) {
  const {
    messages,
    model,
    temperature,
    maxTokens,
    systemPrompt,
  }: {
    messages: UIMessage[]
    model?: string
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
  } = await req.json()

  const result = streamText({
    model: model || "anthropic/claude-opus-4-6",
    system:
      systemPrompt ||
      `You are a construction estimating assistant. You help general contractors and subcontractors build accurate cost estimates for construction projects.

You have tools to directly modify the estimate:
- updateMarkup: Change overhead, profit, contingency, bond, or sales tax percentages
- updateLineItemCost: Change the unit cost of an existing line item
- updateLineItemQuantity: Change the quantity of an existing line item
- addLineItem: Add a new line item to the estimate
- deleteLineItem: Remove a line item from the estimate

When the user asks you to make changes to the estimate, USE THESE TOOLS to actually make the changes. Don't just describe what to do - actually call the tool to do it.

For example:
- "Change overhead to 15%" → Call updateMarkup with field="overhead" and value=15
- "Update drywall to $3.50 per SF" → Call updateLineItemCost with description="drywall" and unitCost=3.5
- "Add 500 SF of ceramic tile at $12/SF" → Call addLineItem with the appropriate values

Be helpful, concise, and proactive about making the changes the user requests.`,
    messages: await convertToModelMessages(messages),
    tools: estimateTools,
    temperature: temperature ?? 0.4,
    maxOutputTokens: maxTokens ?? 2048,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}
