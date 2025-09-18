import type { PaginatedResponse } from "./documents.types"

export interface Conversation {
   id: string
   title: string
   space: string
   space_title: string
   is_active: boolean
   message_count: string
   created_at: string
   updated_at: string
}

export type PaginatedConverSationResponse = PaginatedResponse<Conversation>

export interface CreateConversationPayload {
   space: string
   title: string
   is_active?: boolean
}
