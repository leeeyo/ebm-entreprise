"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  useEstimate,
  useEstimateActions,
  getDirectCosts,
  calculateMarkups,
} from "@/lib/estimate-store"
import { formatCurrency, formatPercent } from "@/lib/format"

export function MarkupSection() {
  const { lineItems, markups } = useEstimate()
  const { updateMarkups } = useEstimateActions()
  const directCosts = getDirectCosts(lineItems)
  const calculated = calculateMarkups(directCosts, markups)

  function handleChange(field: keyof typeof markups, value: string) {
    updateMarkups({ ...markups, [field]: parseFloat(value) || 0 })
  }

  const rows = [
    {
      label: "Overhead",
      field: "overhead" as const,
      value: markups.overhead,
      amount: calculated.overhead,
      description: "General & administrative costs",
    },
    {
      label: "Profit",
      field: "profit" as const,
      value: markups.profit,
      amount: calculated.profit,
      description: "Contractor margin",
    },
    {
      label: "Contingency",
      field: "contingency" as const,
      value: markups.contingency,
      amount: calculated.contingency,
      description: "Risk allowance (typically 5-10%)",
    },
    {
      label: "Bond",
      field: "bond" as const,
      value: markups.bond,
      amount: calculated.bond,
      description: "Performance / payment bond",
    },
    {
      label: "Sales Tax (Materials)",
      field: "salesTax" as const,
      value: markups.salesTax,
      amount: calculated.salesTax,
      description: "Applied to material costs only",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Markups & Adjustments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          {/* Header */}
          <div className="grid grid-cols-[1fr_80px_1fr] items-center gap-4 bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span>Item</span>
            <span className="text-center">Rate %</span>
            <span className="text-right">Amount</span>
          </div>

          {/* Direct costs base */}
          <div className="grid grid-cols-[1fr_80px_1fr] items-center gap-4 border-b px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Direct Costs (Base)
              </p>
              <p className="text-xs text-muted-foreground">
                Sum of all line items
              </p>
            </div>
            <span />
            <p className="text-right font-mono text-sm font-bold text-foreground">
              {formatCurrency(directCosts)}
            </p>
          </div>

          {/* Markup rows */}
          {rows.map((row) => (
            <div
              key={row.field}
              className="grid grid-cols-[1fr_80px_1fr] items-center gap-4 border-b px-4 py-3 last:border-b-0"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {row.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {row.description}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  className="h-8 w-16 text-center font-mono text-sm"
                  value={row.value}
                  onChange={(e) => handleChange(row.field, e.target.value)}
                />
              </div>
              <p className="text-right font-mono text-sm text-foreground">
                {formatCurrency(row.amount)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
