import { apiClient } from "@/utils/apiclient"

/*
 * A capped counter reads as a number, or the string "unlimited".
 *
 * The server normalises every plan against `user_plan/catalog.py` before
 * serialising, so a key is never missing — which matters because an absent
 * limit used to be indistinguishable from an uncapped one.
 * **/
export type PlanLimit = number | "unlimited"

export const isUnlimited = (value: unknown): boolean => value === "unlimited"

/*
 * The known keys, for the places that reference one directly. The index
 * signature is what lets the pricing screen render a facility the admin added
 * to the catalogue without the app having shipped a type for it.
 * **/
export interface PlanFeatures {
   api_access: boolean
   ads_enabled: boolean
   collaboration: boolean
   sso: boolean
   integrations: boolean
   obligation_graph: boolean
   renewal_alerts: boolean
   approval_workflow: boolean
   clause_benchmarks: boolean
   export_formats: string[]
   retention_days: number
   bulk_processing: boolean
   branding_removal: boolean
   custom_templates: boolean
   priority_support: boolean
   storage_limit_gb: number
   advanced_analysis: boolean
   seats_active_limit: PlanLimit
   alerts_actioned_limit: PlanLimit
   contracts_extracted_limit: PlanLimit
   queries_made_limit: PlanLimit
   api_calls_made_limit: PlanLimit
   export_actions_limit: PlanLimit
   spaces_created_limit: PlanLimit
   files_downloaded_limit: PlanLimit
   documents_scanned_limit: PlanLimit
   reports_generated_limit: PlanLimit
   analysis_generated_limit: PlanLimit
   documents_uploaded_limit: PlanLimit
   premium_features_used_limit: PlanLimit
   [key: string]: unknown
}

/*
 * The feature catalogue, served by `GET /plans/features/`.
 *
 * The comparison table is built from this rather than from a hardcoded list, so
 * a limit added in the Django admin shows up in the app without a release.
 * **/
export type PlanFeatureKind = "limit" | "flag" | "number" | "formats"

export interface PlanFeatureMeta {
   key: string
   label: string
   kind: PlanFeatureKind
   unit: string
   help: string
   on_card: boolean
   on_label: string
   off_label: string
   /*
    * This flag being *off* is the benefit — `ads_enabled` is the only one so
    * far. Polarity cannot be inferred from the value, so the tick column has to
    * be told, or a paid tier renders "Ad-free" as a struck-through row.
    * **/
   benefit_when_off: boolean
}

export interface PlanFeatureSection {
   key: string
   label: string
   help: string
   features: PlanFeatureMeta[]
}

export interface PlanFeatureCatalog {
   sections: PlanFeatureSection[]
}

export interface Plan {
   id: string
   name: string
   display_name: string
   description: string
   plan_type: string
   /* Authoritative base price and the currency it is denominated in. */
   price: string
   currency: string
   billing_cycle: string
   /*
    * `contact` means this tier has no list price — it is agreed on a call. The
    * card hides every price field and offers an enquiry instead; rendering the
    * (zero) price would read as "Free", which is the opposite of the truth.
    * **/
   pricing_mode: "fixed" | "contact"
   features: PlanFeatures
   is_active: boolean
   /* "Most popular" — set per plan in the admin, not guessed by the client. */
   is_featured: boolean
   sort_order: number
   /*
    * The same plan priced for whoever asked. Separate from `price` so a screen
    * that renders a converted figure is always able to see that it converted
    * one — `display_is_estimated` is true for a live FX conversion and false
    * when the price is a real local price point set on the plan.
    * **/
   display_price: string
   display_currency: string
   display_currency_symbol: string
   display_currency_digits: number
   display_is_estimated: boolean
}

export interface SupportedCurrency {
   code: string
   name: string
   symbol: string
   digits: number
}

export interface CurrenciesResponse {
   base_currency: string
   results: SupportedCurrency[]
}

export interface PlansResponse {
   count: number
   next: string | null
   previous: string | null
   results: Plan[]
}

export async function getPlans(currency?: string) {
   const response = await apiClient.get("/plans/", {
      params: currency ? { currency } : undefined,
   })
   return response.data as PlansResponse
}

export async function getSupportedCurrencies() {
   const response = await apiClient.get("/plans/currencies/")
   return response.data as CurrenciesResponse
}

export async function getPlanFeatureCatalog() {
   const response = await apiClient.get("/plans/features/")
   return response.data as PlanFeatureCatalog
}

export interface SalesEnquiryRequest {
   plan?: string
   full_name: string
   work_email: string
   phone?: string
   company?: string
   team_size?: string
   message?: string
}

/*
 * The end of the enterprise flow. There is nothing to purchase — the tier is
 * priced on a call — so this books the call instead.
 * **/
export async function createSalesEnquiry(data: SalesEnquiryRequest) {
   const response = await apiClient.post("/plans/enquiry/", data)
   return response.data
}
