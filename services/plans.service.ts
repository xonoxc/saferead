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
  price: string
  billing_cycle: string
  features: PlanFeatures
  is_active: boolean
}

export interface PlansResponse {
  count: number
  next: string | null
  previous: string | null
  results: Plan[]
}

export async function getPlans() {
  const response = await apiClient.get("/plans/")
  return response.data as PlansResponse
}