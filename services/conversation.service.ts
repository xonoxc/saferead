import type {
   CreateConversationPayload,
   PaginatedConverSationResponse,
   PaginatedConversationMessages,
   Conversation,
} from "@/types/api/conversations.types"
import type { ConversationFilterOptions } from "@/types/conversations"

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

/*
 * Load the message history for a conversation, oldest first.
 *
 * The endpoint defaults to newest-first ordering, which is backwards for a
 * chat transcript, so we ask for ascending order explicitly.
 * **/
export async function getConversationMessages(conversationId: string, page: number = 1) {
   const response = await apiClient.get<PaginatedConversationMessages>("/user_space/messages/", {
      params: {
         conversation: conversationId,
         ordering: "created_at",
         page,
      },
   })
   return response.data
}
