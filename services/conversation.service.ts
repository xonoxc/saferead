import type {
  CreateConversationPayload,
  PaginatedConverSationResponse,
  Conversation,
} from "@/types/api/conversations.types"
import { ConversationFilterOptions } from "@/types/conversations"

import { apiClient } from "@/utils/apiclient"

export async function getConversations(page: number = 1, filters?: ConversationFilterOptions) {
  const params = {
    ...(page && { page }),
    ...filters,
  }

  const response = await apiClient.get<PaginatedConverSationResponse>(
    "/user_space/conversations/",
    { params }
  )
  return response.data
}

export async function createConversation(data: CreateConversationPayload) {
  return await apiClient.post<Conversation>("/user_space/conversations/", data)
}
