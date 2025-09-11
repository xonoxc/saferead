import type { Space } from ".."
import type { PaginatedResponse } from "./documents.types"

export interface UserSpaceDocument {
  id: string
  space: string
  document_file: string
  document_type: "pdf" | "docx" | "txt" | "image" | "other"
  download_url?: string
  file_extension: string
  file_size: string
  display_name: string
  is_pinned: boolean
  notes: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface UserSpaceDocumentUpload {
  space: string
  document_file: any
  display_name?: string
}

export interface SpaceWithDocuments extends Space {
  recent_documents: UserSpaceDocument[]
}

export type PaginatedSpaceDocuments = PaginatedResponse<UserSpaceDocument>
