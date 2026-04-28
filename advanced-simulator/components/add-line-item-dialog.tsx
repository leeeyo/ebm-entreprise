"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEstimate, useEstimateActions } from "@/lib/estimate-store"
import { UNITS, COST_TYPES } from "@/lib/types"
import type { CostType } from "@/lib/types"
import { toast } from "sonner"

interface AddLineItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultItem = {
  division: "01",
  description: "",
  quantity: 1,
  unit: "EA" as string,
  unitCost: 0,
  costType: "material" as CostType,
}

export function AddLineItemDialog({
  open,
  onOpenChange,
}: AddLineItemDialogProps) {
  const { divisions } = useEstimate()
  const { addLineItem } = useEstimateActions()
  const [draft, setDraft] = useState(defaultItem)

  function handleAdd() {
    if (!draft.description.trim()) {
      toast.error("Description is required")
      return
    }
    addLineItem(draft)
    toast.success("Line item added")
    setDraft(defaultItem)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Line Item</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="add-desc">Description</Label>
            <Input
              id="add-desc"
              placeholder="e.g. Concrete slab on grade"
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Division</Label>
              <Select
                value={draft.division}
                onValueChange={(v) => setDraft({ ...draft, division: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.id} — {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Cost Type</Label>
              <Select
                value={draft.costType}
                onValueChange={(v) =>
                  setDraft({ ...draft, costType: v as CostType })
                }
              >
                <SelectTrigger>
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
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="add-qty">Quantity</Label>
              <Input
                id="add-qty"
                type="number"
                value={draft.quantity}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    quantity: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Unit</Label>
              <Select
                value={draft.unit}
                onValueChange={(v) => setDraft({ ...draft, unit: v })}
              >
                <SelectTrigger>
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
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-cost">Unit Cost ($)</Label>
              <Input
                id="add-cost"
                type="number"
                step="0.01"
                value={draft.unitCost}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    unitCost: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleAdd}>Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
