import { useSyncExternalStore, useCallback } from "react"
import type { EstimateData, LineItem, Markups, ProjectInfo, Division, CostType } from "./types"
import initialData from "@/data/estimate.json"

type Listener = () => void

let state: EstimateData = initialData as EstimateData
let listeners: Listener[] = []

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: Listener) {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

function getSnapshot() {
  return state
}

function getServerSnapshot() {
  return initialData as EstimateData
}

// --- Mutations ---

export function updateProject(project: ProjectInfo) {
  state = { ...state, project }
  emitChange()
}

export function addLineItem(item: Omit<LineItem, "id">) {
  const id = String(Date.now())
  state = { ...state, lineItems: [...state.lineItems, { ...item, id }] }
  emitChange()
}

export function updateLineItem(id: string, updates: Partial<LineItem>) {
  state = {
    ...state,
    lineItems: state.lineItems.map((li) =>
      li.id === id ? { ...li, ...updates } : li
    ),
  }
  emitChange()
}

export function deleteLineItem(id: string) {
  state = {
    ...state,
    lineItems: state.lineItems.filter((li) => li.id !== id),
  }
  emitChange()
}

export function updateMarkups(markups: Markups) {
  state = { ...state, markups }
  emitChange()
}

export function addDivision(division: Division) {
  state = { ...state, divisions: [...state.divisions, division] }
  emitChange()
}

// --- Derived data helpers ---

export function getLineTotal(item: LineItem): number {
  return item.quantity * item.unitCost
}

export function getDivisionSubtotal(
  items: LineItem[],
  divisionId: string
): number {
  return items
    .filter((li) => li.division === divisionId)
    .reduce((sum, li) => sum + getLineTotal(li), 0)
}

export function getCostTypeSubtotal(
  items: LineItem[],
  costType: CostType
): number {
  return items
    .filter((li) => li.costType === costType)
    .reduce((sum, li) => sum + getLineTotal(li), 0)
}

export function getDirectCosts(items: LineItem[]): number {
  return items.reduce((sum, li) => sum + getLineTotal(li), 0)
}

export function calculateMarkups(directCosts: number, markups: Markups) {
  const materialSubtotal = 0 // used for tax calc if needed
  const overhead = directCosts * (markups.overhead / 100)
  const profit = directCosts * (markups.profit / 100)
  const contingency = directCosts * (markups.contingency / 100)
  const subtotalBeforeBond = directCosts + overhead + profit + contingency
  const bond = subtotalBeforeBond * (markups.bond / 100)
  const salesTax = materialSubtotal * (markups.salesTax / 100)
  const totalBidPrice = subtotalBeforeBond + bond + salesTax

  return {
    overhead,
    profit,
    contingency,
    bond,
    salesTax,
    totalBidPrice,
  }
}

// --- Hook ---

export function useEstimate() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return data
}

export function useEstimateActions() {
  return {
    updateProject: useCallback((p: ProjectInfo) => updateProject(p), []),
    addLineItem: useCallback((i: Omit<LineItem, "id">) => addLineItem(i), []),
    updateLineItem: useCallback(
      (id: string, u: Partial<LineItem>) => updateLineItem(id, u),
      []
    ),
    deleteLineItem: useCallback((id: string) => deleteLineItem(id), []),
    updateMarkups: useCallback((m: Markups) => updateMarkups(m), []),
    addDivision: useCallback((d: Division) => addDivision(d), []),
  }
}
