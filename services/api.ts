import { apiClient } from "@/utils/apiclient"
import { attempt } from "@/utils/attempt"
import { buildFileUploadFormData } from "@/utils/helpers/files"

import type { FilterOptions } from "@/types/docs"
import type { UploadDocumentRequest } from "@/types/api/documents.types"
import type { ReactNativeFile } from "@/types/file"
import type { SpaceDataParam } from "@/utils/validation/space"

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

export async function getDocuments(page?: number, filters?: FilterOptions) {
  const params = prepareGetDocumentParams(page, filters)
  const resp = await apiClient.get("/scanner/documents/", { params })
  return resp.data
}

/*
 * Helper function to prepare parameters for the GET documents API call with existing filters
 * **/
function prepareGetDocumentParams(page?: number, filters?: FilterOptions) {
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
    ...(filters?.space_id && { space_id: filters.space_id }),
  }
}

export async function getDocumentById(documentId: string) {
  return apiClient.get(`/scanner/documents/${documentId}/`)
}

export async function deleteDocument(documentId: string) {
  return attempt(apiClient.delete(`/scanner/documents/${documentId}/`))
}

export async function getDocumentStats() {
  const response = await apiClient.get("/scanner/documents/stats/")
  return response.data
}

/*
 * User Space API Functions
 * **/
export async function getSpaces(page?: number) {
  const params = {
    ...(page && { page }),
  }
  const resp = await apiClient.get("/user_space/spaces/", { params })
  return resp.data
}

export async function createSpace(data: SpaceDataParam) {
  return apiClient.post("/user_space/spaces/", data)
}

export async function deleteSpace(spaceId: string) {
  return apiClient.delete(`/user_space/spaces/${spaceId}/`)
}

export async function updateSpace(spaceId: string, data: Partial<SpaceDataParam>) {
  return apiClient.put(`/user_space/spaces/${spaceId}/`, data)
}

export async function getSpaceDocuments(spaceId: string, page?: number) {
  const params = {
    ...(page && { page }),
  }
  const resp = await apiClient.get(`/user_space/spaces/${spaceId}/documents/`, { params })
  return resp.data
}

export async function getSpaceStats(spaceId: string) {
  const resp = await apiClient.get(`/user_space/spaces/${spaceId}/stats/`)
  return resp.data
}

export async function toggleFavoriteSpace(spaceId: string, data: { is_favorite: boolean }) {
  return apiClient.post(`/user_space/spaces/${spaceId}/toggle_favorite/`, data)
}

export async function addDocumentToSpace(data: {
  space: string
  document_file: ReactNativeFile | File | Blob
  document_type: string
  display_name?: string
  is_pinned?: boolean
  notes?: string
  tags?: string[]
}) {
  const formData = buildFileUploadFormData("document_file", data.document_file, {
    originalFilename: data.display_name,
    extras: {
      space: data.space,
      document_type: data.document_type,
      display_name: data.display_name,
      is_pinned: data.is_pinned,
      notes: data.notes,
      tags: data.tags?.join(","),
    },
  })

  return apiClient.post("/user_space/documents/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}
