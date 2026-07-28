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

import { getActiveLanguage } from "@/store/useLocaleStore"

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

   const code = (currency || "USD").toUpperCase()
   const abs = Math.abs(value)

   /*
    * Intl, not a symbol table.
    *
    * There used to be a hand-written map of seven currencies here, and any
    * code outside it rendered as "SEK 1.2k". Intl already knows every ISO
    * code, and it also knows that symbols are not universally prefixed -
    * "1,2 Mio. €" in German, "$1.2M" in English - which no amount of
    * `${symbol}${number}` string-building can express.
    * **/
   /*
    * Scale here rather than asking for `notation: "compact"`.
    *
    * Hermes honours compact notation for plain numbers but ignores it under
    * `style: "currency"` while still applying `maximumFractionDigits` - which
    * is how "€50,000.0" appeared, a stray digit rather than the "€50K" that
    * was asked for. Doing the division ourselves is predictable everywhere.
    * **/
   let scaled = value
   let unit = ""
   if (abs >= 1_000_000) {
      scaled = value / 1_000_000
      unit = "M"
   } else if (abs >= 10_000) {
      scaled = value / 1000
      unit = "k"
   }

   try {
      const parts = new Intl.NumberFormat(getActiveLanguage(), {
         style: "currency",
         currency: code,
         /*
          * `minimumFractionDigits: 0` is required, not tidy-up. Currency style
          * defaults the minimum to the currency's own precision (2 for EUR),
          * and when that minimum exceeds the maximum Intl raises the minimum
          * to match - which rendered a round 50 as "€50.0k".
          * **/
         minimumFractionDigits: 0,
         maximumFractionDigits: unit ? 1 : 0,
      }).formatToParts(scaled)

      /*
       * The unit goes after the number, not at the end of the string: the
       * symbol trails the amount in plenty of locales ("1,2 Mio. €"), and
       * `${formatted}${unit}` would render "1,2 €M" there.
       * **/
      const numeric = new Set(["integer", "group", "decimal", "fraction"])
      let lastNumeric = -1
      parts.forEach((part, i) => {
         if (numeric.has(part.type)) lastNumeric = i
      })

      return parts
         .map((part, i) => (i === lastNumeric ? part.value + unit : part.value))
         .join("")
   } catch {
      /* Unknown code, or a runtime without the ICU data for it. */
      return `${code} ${Math.round(value).toLocaleString()}${unit}`
   }
}
