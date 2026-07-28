import { apiClient } from "@/utils/apiclient"

export interface PlanFeatures {
   api_access: boolean
   ads_enabled: boolean
   collaboration: boolean
   export_formats: string[]
   retention_days: number
   bulk_processing: boolean
   branding_removal: boolean
   custom_templates: boolean
   priority_support: boolean
   storage_limit_gb: number
   advanced_analysis: boolean
   queries_made_limit: number | string
   api_calls_made_limit: number | string
   export_actions_limit: number | string
   spaces_created_limit: number | string
   files_downloaded_limit: number | string
   documents_scanned_limit: number | string
   reports_generated_limit: number | string
   analysis_generated_limit: number | string
   documents_uploaded_limit: number | string
   premium_features_used_limit: number | string
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
   features: PlanFeatures
   is_active: boolean
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
