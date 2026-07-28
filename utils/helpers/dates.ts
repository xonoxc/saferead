/*
 * Date and money formatting for the obligation graph.
 *
 * Contracts are almost entirely dates and amounts, and both were being
 * formatted ad hoc wherever they appeared. Two things make that worse here
 * than usual:
 *
 * 1. **Deadlines are relative to today, not absolute.** "12 Mar 2027" makes a
 *    reader do arithmetic; "in 8 months" does not. But "in 3 days" is
 *    alarming and "12 Mar" is not, so the useful form depends on distance.
 * 2. **The API sends `YYYY-MM-DD` date strings, not timestamps.** Passing
 *    those to `new Date()` parses them as UTC midnight, which in any negative
 *    UTC offset renders as the *previous day*. A due date that silently shows
 *    a day early is worse than no date at all, so these parse explicitly.
 * **/

const MS_PER_DAY = 86_400_000

const MONTHS = [
   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

/*
 * Parse a `YYYY-MM-DD` API date into a *local* midnight Date.
 *
 * `new Date("2027-03-12")` is UTC midnight; west of Greenwich that is
 * 11 March locally. Splitting the parts and using the numeric constructor
 * keeps the calendar day the server meant.
 * **/
export function parseApiDate(value: string | null | undefined): Date | null {
   if (!value) return null

   const [datePart] = value.split("T")
   const [y, m, d] = datePart.split("-").map(Number)

   if (!y || !m || !d) return null

   const parsed = new Date(y, m - 1, d)
   return Number.isNaN(parsed.getTime()) ? null : parsed
}

/* Today at local midnight, so day arithmetic is not skewed by the clock. */
function startOfToday(): Date {
   const now = new Date()
   return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

/*
 * Whole days from today. Negative = in the past.
 * Returns null for an absent date rather than 0, which would read as "today".
 * **/
export function daysUntil(value: string | null | undefined): number | null {
   const target = parseApiDate(value)
   if (!target) return null

   return Math.round((target.getTime() - startOfToday().getTime()) / MS_PER_DAY)
}

/* "12 Mar 2027", or "12 Mar" when it is this year. */
export function formatShortDate(value: string | null | undefined): string {
   const date = parseApiDate(value)
   if (!date) return "—"

   const sameYear = date.getFullYear() === new Date().getFullYear()
   const base = `${date.getDate()} ${MONTHS[date.getMonth()]}`

   return sameYear ? base : `${base} ${date.getFullYear()}`
}

/*
 * A deadline phrased the way someone would say it out loud.
 *
 * Deliberately vague past about a month — nobody schedules around "in 47
 * days", and the precise date is shown alongside anyway. Overdue stays exact,
 * because "8 days late" is actionable in a way "last month" is not.
 * **/
export function formatRelativeDeadline(value: string | null | undefined): string {
   const days = daysUntil(value)
   if (days === null) return "No date"

   if (days < 0) {
      /* "late" rather than "overdue": same meaning, four characters shorter,
       * and these strings sit in a narrow right-hand column where the longer
       * word wraps onto a second line. */
      const late = Math.abs(days)
      if (late === 1) return "1 day late"
      if (late < 30) return `${late} days late`
      return `Late since ${formatShortDate(value)}`
   }

   if (days === 0) return "Today"
   if (days === 1) return "Tomorrow"
   if (days < 14) return `In ${days} days`
   if (days < 60) return `In ${Math.round(days / 7)} weeks`
   if (days < 365) return `In ${Math.round(days / 30)} months`

   return `In ${Math.round((days / 365) * 10) / 10} years`
}

/* Relative time for things that already happened (activity feeds). */
export function formatTimeAgo(value: string | null | undefined): string {
   if (!value) return ""

   const then = new Date(value).getTime()
   if (Number.isNaN(then)) return ""

   const minutes = Math.floor((Date.now() - then) / 60_000)

   if (minutes < 1) return "just now"
   if (minutes < 60) return `${minutes}m ago`

   const hours = Math.floor(minutes / 60)
   if (hours < 24) return `${hours}h ago`

   const days = Math.floor(hours / 24)
   if (days < 7) return `${days}d ago`
   if (days < 30) return `${Math.floor(days / 7)}w ago`

   return formatShortDate(value.split("T")[0])
}

/*
 * Money, compacted.
 *
 * Portfolio totals run to six or seven figures and sit in narrow cards, so
 * "$1.2M" beats "$1,240,000.00" — the exact cent is never the decision.
 * Amounts arrive as strings because DRF serialises Decimal that way; parsing
 * here keeps every call site from remembering that.
 * **/
export function formatMoney(
   amount: string | number | null | undefined,
   currency = "USD"
): string {
   const value = typeof amount === "string" ? parseFloat(amount) : amount

   if (value === null || value === undefined || Number.isNaN(value)) return "—"

   const symbol = CURRENCY_SYMBOLS[currency?.toUpperCase()] ?? `${currency} `
   const abs = Math.abs(value)

   if (abs >= 1_000_000) return `${symbol}${trim(value / 1_000_000)}M`
   if (abs >= 10_000) return `${symbol}${trim(value / 1000)}k`

   return `${symbol}${Math.round(value).toLocaleString()}`
}

/* One decimal place, but no trailing ".0". */
function trim(n: number): string {
   return (Math.round(n * 10) / 10).toString()
}

const CURRENCY_SYMBOLS: Record<string, string> = {
   USD: "$",
   EUR: "€",
   GBP: "£",
   INR: "₹",
   JPY: "¥",
   AUD: "A$",
   CAD: "C$",
}
