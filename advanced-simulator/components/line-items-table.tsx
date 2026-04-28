"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DivisionChips } from "@/components/division-chips"
import { LineItemRow } from "@/components/line-item-row"
import { AddLineItemDialog } from "@/components/add-line-item-dialog"
import {
  useEstimate,
  useEstimateActions,
  getLineTotal,
  getDivisionSubtotal,
} from "@/lib/estimate-store"
import { formatCurrency } from "@/lib/format"

export function LineItemsTable() {
  const { lineItems, divisions } = useEstimate()
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const filteredItems = selectedDivision
    ? lineItems.filter((li) => li.division === selectedDivision)
    : lineItems

  const filteredTotal = filteredItems.reduce(
    (sum, li) => sum + getLineTotal(li),
    0
  )

  // Group items by division for subtotal display
  const activeDivisions = selectedDivision
    ? divisions.filter((d) => d.id === selectedDivision)
    : divisions.filter((d) => lineItems.some((li) => li.division === d.id))

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4 flex-wrap">
        <CardTitle className="text-base">Line Items</CardTitle>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="size-4" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="mb-4">
          <DivisionChips
            divisions={divisions}
            selected={selectedDivision}
            onSelect={setSelectedDivision}
          />
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-8 text-center">#</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Division
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-8">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeDivisions.map((div) => {
                const divItems = filteredItems.filter(
                  (li) => li.division === div.id
                )
                if (divItems.length === 0) return null
                const divTotal = getDivisionSubtotal(filteredItems, div.id)

                return (
                  <DivisionGroup key={div.id}>
                    {/* Division header row */}
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell
                        colSpan={9}
                        className="py-2 font-semibold text-sm text-foreground"
                      >
                        <span className="font-mono text-xs text-muted-foreground mr-2">
                          Div {div.id}
                        </span>
                        {div.name}
                        <span className="ml-3 font-mono text-xs text-muted-foreground">
                          ({divItems.length} items)
                        </span>
                      </TableCell>
                    </TableRow>
                    {divItems.map((item, i) => (
                      <LineItemRow
                        key={item.id}
                        item={item}
                        divisions={divisions}
                        index={i}
                      />
                    ))}
                    {/* Division subtotal */}
                    <TableRow className="border-b-2 hover:bg-transparent">
                      <TableCell
                        colSpan={7}
                        className="text-right text-xs font-medium text-muted-foreground pr-2"
                      >
                        Div {div.id} Subtotal
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-bold text-foreground">
                        {formatCurrency(divTotal)}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </DivisionGroup>
                )
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-right font-semibold text-foreground"
                >
                  Direct Costs Total
                </TableCell>
                <TableCell className="text-right font-mono text-base font-bold text-foreground">
                  {formatCurrency(filteredTotal)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {filteredItems.length} line item{filteredItems.length !== 1 && "s"}
          {selectedDivision && " (filtered)"}
        </p>
      </CardContent>

      <AddLineItemDialog open={addOpen} onOpenChange={setAddOpen} />
    </Card>
  )
}

function DivisionGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
