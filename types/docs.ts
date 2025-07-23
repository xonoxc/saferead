export interface FilterOptions {
  status?: string
  document_type?: string
  space?: string
  confidence_score_gte?: number
  confidence_score_lte?: number
  created_at_gte?: string
  created_at_lte?: string
  ordering?: string
  search?: string
}
