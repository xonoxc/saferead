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

export interface ConversationMessage {
   id: string
   message_type: "user" | "assistant"
   content: string
   processing_time: string | null
   processing_time_seconds: number | null
   confidence_score: number | null
   created_at: string
}

export type PaginatedConversationMessages = PaginatedResponse<ConversationMessage>
