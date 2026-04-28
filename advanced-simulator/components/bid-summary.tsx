"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  useEstimate,
  getDirectCosts,
  getCostTypeSubtotal,
  calculateMarkups,
} from "@/lib/estimate-store"
import { formatCurrency } from "@/lib/format"
import type { CostType } from "@/lib/types"
import { cn } from "@/lib/utils"

const costTypeConfig: {
  type: CostType
  label: string
  colorClass: string
}[] = [
  { type: "material", label: "Materials", colorClass: "bg-chart-1" },
  { type: "labor", label: "Labor", colorClass: "bg-chart-2" },
  { type: "equipment", label: "Equipment", colorClass: "bg-chart-4" },
  { type: "subcontractor", label: "Subcontractors", colorClass: "bg-chart-3" },
]

export function BidSummary() {
  const { lineItems, markups } = useEstimate()
  const directCosts = getDirectCosts(lineItems)
  const calculated = calculateMarkups(directCosts, markups)

  const costBreakdown = costTypeConfig.map((ct) => ({
    ...ct,
    amount: getCostTypeSubtotal(lineItems, ct.type),
    pct: directCosts > 0
      ? (getCostTypeSubtotal(lineItems, ct.type) / directCosts) * 100
      : 0,
  }))

  return (
    <Card className="border-2 border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-base">Bid Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Cost type breakdown */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Cost Breakdown
          </p>
          <div className="flex flex-col gap-2.5">
            {costBreakdown.map((item) => (
              <div key={item.type}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn("size-2.5 rounded-full", item.colorClass)}
                    />
                    <span className="text-foreground">{item.label}</span>
                  </div>
                  <span className="font-mono text-foreground">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div
                    className={cn("h-1.5 rounded-full transition-all", item.colorClass)}
                    style={{ width: `${Math.min(item.pct, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex flex-col gap-2">
            <SummaryRow
              label="Direct Costs"
              value={formatCurrency(directCosts)}
            />
            <SummaryRow
              label={`Overhead (${markups.overhead}%)`}
              value={formatCurrency(calculated.overhead)}
              muted
            />
            <SummaryRow
              label={`Profit (${markups.profit}%)`}
              value={formatCurrency(calculated.profit)}
              muted
            />
            <SummaryRow
              label={`Contingency (${markups.contingency}%)`}
              value={formatCurrency(calculated.contingency)}
              muted
            />
            {calculated.bond > 0 && (
              <SummaryRow
                label={`Bond (${markups.bond}%)`}
                value={formatCurrency(calculated.bond)}
                muted
              />
            )}
            {calculated.salesTax > 0 && (
              <SummaryRow
                label="Sales Tax"
                value={formatCurrency(calculated.salesTax)}
                muted
              />
            )}
            <div className="my-1 h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-foreground">
                Total Bid Price
              </span>
              <span className="text-xl font-bold font-mono text-primary">
                {formatCurrency(calculated.totalBidPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Per SF if applicable */}
        {directCosts > 0 && (
          <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              {lineItems.length} line items
            </span>
            <span className="font-mono text-foreground">
              Avg {formatCurrency(directCosts / lineItems.length)}/item
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SummaryRow({
  label,
  value,
  muted = false,
}: {
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={muted ? "text-muted-foreground" : "text-foreground font-medium"}>
        {label}
      </span>
      <span className={cn("font-mono", muted ? "text-muted-foreground" : "text-foreground font-medium")}>
        {value}
      </span>
    </div>
  )
}
