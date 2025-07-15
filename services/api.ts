import { apiClient } from "@/utils/apiclient"
import { FilterOptions } from "@/components/DocumentFilter"

export interface UploadDocumentRequest {
  document_file: any
  original_filename: string
  document_type: 'terms' | 'privacy' | 'legal' | 'other'
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

export interface DocumentsListResponse {
  count: number
  next: string | null
  previous: string | null
  results: AnalysisResponse[]
}

export const uploadDocument = async (data: UploadDocumentRequest): Promise<AnalysisResponse> => {
  const formData = new FormData()
  
  formData.append('original_filename', data.original_filename)
  formData.append('document_type', data.document_type)
  
  // Handle different file types
  if (data.document_file.uri) {
    // React Native file object (from image picker)
    formData.append('document_file', {
      uri: data.document_file.uri,
      type: data.document_file.type || 'image/jpeg',
      name: data.document_file.name || data.original_filename,
    } as any)
  } else if (data.document_file instanceof File) {
    // Web File object
    formData.append('document_file', data.document_file)
  } else if (data.document_file instanceof Blob) {
    // Blob object
    formData.append('document_file', data.document_file, data.original_filename)
  } else {
    // Fallback for other types
    formData.append('document_file', data.document_file)
  }

  const response = await apiClient.post('/scanner/documents/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const getDocuments = async (page?: number, filters?: FilterOptions): Promise<DocumentsListResponse> => {
  const params: any = {}
  
  if (page) params.page = page
  
  if (filters) {
    // Add filtering parameters
    if (filters.status) params.status = filters.status
    if (filters.document_type) params.document_type = filters.document_type
    if (filters.confidence_score_gte) params.confidence_score__gte = filters.confidence_score_gte
    if (filters.confidence_score_lte) params.confidence_score__lte = filters.confidence_score_lte
    if (filters.created_at_gte) params.created_at__gte = filters.created_at_gte
    if (filters.created_at_lte) params.created_at__lte = filters.created_at_lte
    if (filters.ordering) params.ordering = filters.ordering
    if (filters.search) params.search = filters.search
    if (filters.space_id) params.space_id = filters.space_id
  }

  const response = await apiClient.get('/scanner/documents/', { params })
  return response.data
}

export const getDocumentById = async (documentId: string): Promise<AnalysisResponse> => {
  const response = await apiClient.get(`/scanner/documents/${documentId}/`)
  return response.data
}

export const deleteDocument = async (documentId: string): Promise<void> => {
  await apiClient.delete(`/scanner/documents/${documentId}/`)
}
