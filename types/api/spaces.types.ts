import type { PaginatedResponse } from "./documents.types"
import type { UserSpaceDocument } from "./spaces.documents.types"

export interface Space {
  id: string
  title: string
  description: string
  color: string
  icon: string
  privacy: "private" | "public"
  is_active: boolean
  is_favorite: boolean
  document_count: number
  recent_documents: UserSpaceDocument[]
  user_username: string
  created_at: string
  updated_at: string
  last_accessed: string
}

export type PaginatedSpaces = PaginatedResponse<Space>

export interface ToggleFavoriteSpace {
  title: string
  description: string
  color: string
  icon: string
  privacy: "private" | "public"
  is_active: boolean
  is_favorite: boolean
}
