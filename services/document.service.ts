import { apiClient } from "@/utils/apiclient"
import { attempt } from "@/utils/attempt"
import { buildFileUploadFormData } from "@/utils/helpers/files"

import type { DocumentFilterOptions } from "@/types/docs"
import type { UploadDocumentRequest } from "@/types/api/documents.types"

export async function uploadDocument(data: UploadDocumentRequest) {
   const formData = buildFileUploadFormData("document_file", data.document_file, {
      originalFilename: data.original_filename,
      extras: {
         original_filename: data.original_filename,
         document_type: data.document_type,
      },
   })

   return apiClient.post("/scanner/documents/", formData, {
      headers: {
         "Content-Type": "multipart/form-data",
      },
   })
}

export async function getDocuments(page?: number, filters?: DocumentFilterOptions) {
   const params = prepareGetDocumentParams(page, filters)
   const resp = await apiClient.get("/scanner/documents/", { params })
   return resp.data
}

/*
 * Helper function to prepare parameters for the GET documents API call with existing filters
 * **/
function prepareGetDocumentParams(page?: number, filters?: DocumentFilterOptions) {
   return {
      ...(page && { page }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.document_type && { document_type: filters.document_type }),
      ...(filters?.confidence_score_gte && { confidence_score__gte: filters.confidence_score_gte }),
      ...(filters?.confidence_score_lte && { confidence_score__lte: filters.confidence_score_lte }),
      ...(filters?.created_at_gte && { created_at__gte: filters.created_at_gte }),
      ...(filters?.created_at_lte && { created_at__lte: filters.created_at_lte }),
      ...(filters?.ordering && { ordering: filters.ordering }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.space && { space_id: filters.space }),
   }
}

export async function getDocumentById(documentId: string) {
   return apiClient.get(`/scanner/documents/${documentId}/`)
}

export async function deleteDocument(documentId: string) {
   return attempt(() => apiClient.delete(`/scanner/documents/${documentId}/`))
}

export async function getDocumentStats() {
   const response = await apiClient.get("/scanner/documents/stats/")
   return response.data
}
