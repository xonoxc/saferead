import { billingSuffix, formatMoneyCompact, type MoneyParts } from "./money"

import type { Plan, PlanFeatureMeta } from "@/services/plans.service"

/*
 * Turning a plan into the things a screen actually renders.
 *
 * Shared between the Settings upgrade card and the pricing screen so the two
 * cannot disagree about what a contact-priced tier looks like — the failure
 * mode being one of them rendering an enterprise plan's zero price as "Free".
 * **/

export const isContactPlan = (plan: Plan) => plan.pricing_mode === "contact"

/* The server already priced the plan; this only unpacks its answer. */
export const planMoneyParts = (plan: Plan): MoneyParts => ({
   amount: plan.display_price,
   currency: plan.display_currency,
   symbol: plan.display_currency_symbol,
   digits: plan.display_currency_digits,
})

/* The big number on a card, e.g. "$29/mo" — or the honest absence of one. */
export function planHeadlinePrice(plan: Plan, locale?: string): string {
   if (isContactPlan(plan)) return "Custom pricing"

   const { symbol, value } = formatMoneyCompact(planMoneyParts(plan), locale)
   return `${symbol}${value}${billingSuffix(plan.billing_cycle)}`
}

/*
 * What one catalogue facility says about one plan.
 *
 * Returns `null` when the feature is off and has nothing worth saying — a
 * comparison row reading "No API access" is useful on a free tier being
 * compared against a paid one, but "Approval workflow: off" with no phrasing
 * for the off state is just a struck-through line nobody reads.
 * **/
export function describeFeature(meta: PlanFeatureMeta, value: unknown): string | null {
   switch (meta.kind) {
      case "flag":
         if (value) return meta.on_label || meta.label
         return meta.off_label || null

      case "limit": {
         const noun = meta.unit || meta.label.toLowerCase()
         if (value === "unlimited") return `Unlimited ${noun}`
         if (value === 0 || value === null || value === undefined) return null
         return `${value} ${value === 1 ? singular(noun) : noun}`
      }

      case "number":
         return `${value} ${meta.unit}`.trim()

      case "formats":
         if (!Array.isArray(value) || value.length === 0) return null
         return `Export to ${value.map(String).join(", ").toUpperCase()}`

      default:
         return null
   }
}

/*
 * "1 seats" is the sort of thing that makes a pricing page look unfinished, and
 * the free tier — the one most people read — is full of ones.
 *
 * Deliberately crude: the nouns come from `catalog.Feature.unit`, a closed set
 * an admin writes, so this only has to handle the endings that set actually
 * uses. A real pluralisation library for eight words would be the wrong trade.
 * **/
function singular(noun: string): string {
   // Greek -is plural, and the reason this needs a rule at all: the generic
   // "-es" rule below turns "analyses" into "analys".
   if (noun.endsWith("yses")) return `${noun.slice(0, -4)}ysis` // analyses → analysis
   if (noun.endsWith("ies")) return `${noun.slice(0, -3)}y` // queries → query
   if (/(s|x|z|ch|sh)es$/.test(noun)) return noun.slice(0, -2) // boxes → box
   if (noun.endsWith("s") && !noun.endsWith("ss")) return noun.slice(0, -1)
   return noun
}

/* Whether a facility is included at all, for a tick-vs-cross column. */
export function featureIsIncluded(value: unknown): boolean {
   if (typeof value === "boolean") return value
   if (value === "unlimited") return true
   if (typeof value === "number") return value > 0
   if (Array.isArray(value)) return value.length > 0
   return false
}
