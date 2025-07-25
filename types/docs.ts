import type { BaseFilterOptions } from "./filter"

export interface DocumentFilterOptions extends BaseFilterOptions {
  status?: string
  document_type?: string
  space?: string
  confidence_score_gte?: number
  confidence_score_lte?: number
}
