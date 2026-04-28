"use client"

import { Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEstimateActions, getLineTotal } from "@/lib/estimate-store"
import { formatCurrency } from "@/lib/format"
import type { LineItem, Division, CostType } from "@/lib/types"
import { UNITS, COST_TYPES } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface LineItemRowProps {
  item: LineItem
  divisions: Division[]
  index: number
}

const costTypeColors: Record<CostType, string> = {
  material: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  labor: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  equipment: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  subcontractor: "bg-chart-3/15 text-chart-3 border-chart-3/30",
}

export function LineItemRow({ item, divisions, index }: LineItemRowProps) {
  const { updateLineItem, deleteLineItem } = useEstimateActions()
  const total = getLineTotal(item)
  const divName =
    divisions.find((d) => d.id === item.division)?.name ?? item.division

  return (
    <TableRow className="group">
      {/* Row number */}
      <TableCell className="w-8 text-center font-mono text-xs text-muted-foreground">
        {index + 1}
      </TableCell>

      {/* Division */}
      <TableCell className="hidden lg:table-cell">
        <Select
          value={item.division}
          onValueChange={(v) => updateLineItem(item.id, { division: v })}
        >
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {divisions.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                <span className="font-mono mr-1">{d.id}</span> {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      {/* Description */}
      <TableCell className="min-w-40">
        <Input
          className="h-8 border-transparent bg-transparent text-sm shadow-none focus-visible:border-input focus-visible:bg-card"
          value={item.description}
          onChange={(e) =>
            updateLineItem(item.id, { description: e.target.value })
          }
        />
      </TableCell>

      {/* Cost type badge */}
      <TableCell className="hidden md:table-cell">
        <Select
          value={item.costType}
          onValueChange={(v) =>
            updateLineItem(item.id, { costType: v as CostType })
          }
        >
          <SelectTrigger className={cn("h-7 w-28 rounded-full border text-xs font-medium", costTypeColors[item.costType])}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COST_TYPES.map((ct) => (
              <SelectItem key={ct.value} value={ct.value}>
                {ct.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      {/* Qty */}
      <TableCell>
        <Input
          type="number"
          className="h-8 w-20 border-transparent bg-transparent text-right font-mono text-sm shadow-none focus-visible:border-input focus-visible:bg-card"
          value={item.quantity}
          onChange={(e) =>
            updateLineItem(item.id, {
              quantity: parseFloat(e.target.value) || 0,
            })
          }
        />
      </TableCell>

      {/* Unit */}
      <TableCell>
        <Select
          value={item.unit}
          onValueChange={(v) => updateLineItem(item.id, { unit: v })}
        >
          <SelectTrigger className="h-8 w-16 text-xs font-mono">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UNITS.map((u) => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      {/* Unit cost */}
      <TableCell>
        <Input
          type="number"
          step="0.01"
          className="h-8 w-24 border-transparent bg-transparent text-right font-mono text-sm shadow-none focus-visible:border-input focus-visible:bg-card"
          value={item.unitCost}
          onChange={(e) =>
            updateLineItem(item.id, {
              unitCost: parseFloat(e.target.value) || 0,
            })
          }
        />
      </TableCell>

      {/* Total */}
      <TableCell className="text-right font-mono text-sm font-semibold text-foreground">
        {formatCurrency(total)}
      </TableCell>

      {/* Delete */}
      <TableCell className="w-8">
        <Button
          variant="ghost"
          size="icon-sm"
          className="opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => deleteLineItem(item.id)}
        >
          <Trash2 className="size-3.5 text-destructive" />
          <span className="sr-only">Delete line item</span>
        </Button>
      </TableCell>
    </TableRow>
  )
}
