export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

/** Deterministic date formatter that avoids hydration mismatches.
 *  Parses "YYYY-MM-DD" strings without going through the Date constructor
 *  so timezone differences between server and client can't shift the day. */
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-")
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]
  const m = parseInt(month, 10)
  const d = parseInt(day, 10)
  return `${monthNames[m - 1]} ${d}, ${year}`
}
