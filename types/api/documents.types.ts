export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface UploadDocumentRequest {
  document_file: any
  original_filename: string
  document_type: "terms" | "privacy" | "legal" | "other"
}

export interface AnalysisResponse {
  id: string
  document_file: string
  original_filename: string
  document_type: string
  status: string
  summary_text: string
  risky_points: string[]
  favourable_points: string[]
  created_at: string
  updated_at: string
  processed_at: string
  error_message: string
  confidence_score: number
}

export type DocumentsListResponse = PaginatedResponse<AnalysisResponse>

export interface StatsResponse {
  total_documents: number
  completed: number
  pending: number
  failed: number
  processing: number
  by_type: {
    terms: number
    privacy: number
    legal: number
    other: number
  }
  avg_confidence: number
}
