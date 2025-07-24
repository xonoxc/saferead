import { apiClient } from "@/utils/apiclient"
import { buildFileUploadFormData } from "@/utils/helpers/files"

import type { ReactNativeFile } from "@/types/file"
import type { SpaceDataParam } from "@/utils/validation/space"

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
