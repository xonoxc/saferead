/*
 * Rendering money.
 *
 * The server already did the arithmetic and told us the currency, its symbol
 * and how many minor digits it has — this only formats. That split matters:
 * grouping and symbol placement are not universal ("$1,234.56" but
 * "1.234,56 €" and "¥1,235"), and getting them from the *locale* rather than
 * hardcoding a template is the whole difference between an app that ships
 * worldwide and one that ships in America.
 * **/

export interface MoneyParts {
   amount: string
   currency: string
   symbol: string
   digits: number
}

/**
 * Format with `Intl`, falling back to symbol + number if the runtime's ICU
 * data does not know the currency. Hermes ships full ICU on both platforms,
 * but a fallback beats a crash on an old device.
 */
export function formatMoney(parts: MoneyParts, locale?: string): string {
   const value = Number(parts.amount)
   if (!Number.isFinite(value)) return `${parts.symbol}${parts.amount}`

   try {
      return new Intl.NumberFormat(locale, {
         style: "currency",
         currency: parts.currency,
         minimumFractionDigits: parts.digits,
         maximumFractionDigits: parts.digits,
      }).format(value)
   } catch {
      const fixed = value.toFixed(parts.digits)
      return `${parts.symbol}${fixed}`
   }
}

/**
 * The headline number without decimals, for the big price on a plan card.
 * Returns the currency symbol separately so the card can size them apart.
 */
export function formatMoneyCompact(
   parts: MoneyParts,
   locale?: string
): { symbol: string; value: string } {
   const value = Number(parts.amount)
   if (!Number.isFinite(value)) return { symbol: parts.symbol, value: parts.amount }

   try {
      const formatted = new Intl.NumberFormat(locale, {
         maximumFractionDigits: 0,
      }).format(value)
      return { symbol: parts.symbol, value: formatted }
   } catch {
      return { symbol: parts.symbol, value: String(Math.round(value)) }
   }
}

/* Per-cycle suffix, e.g. "/mo". Kept here so the plan card and the
 * confirmation line cannot drift apart. */
export function billingSuffix(cycle: string): string {
   switch (cycle) {
      case "monthly":
         return "/mo"
      case "yearly":
         return "/yr"
      case "lifetime":
         return ""
      default:
         return ""
   }
}
