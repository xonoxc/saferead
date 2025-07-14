import { apiClient } from "@/utils/apiclient"

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

export const getDocuments = async (page?: number): Promise<DocumentsListResponse> => {
  const params = page ? { page } : {}
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
