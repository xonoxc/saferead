import {
   createConversation,
   getConversations,
   getConversationMessages,
} from "@/services/conversation.service"
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"

import { apiClient, getAccessToken } from "@/utils/apiclient"
import { serverURL } from "@/constants"
import { fetch } from "expo/fetch"

import type {
   PaginatedConverSationResponse,
   PaginatedConversationMessages,
} from "@/types/api/conversations.types"
import type { ConversationFilterOptions } from "@/types/conversations"
import type { ChatContextSources } from "@/hooks/chat/useChat"

export type ChatbotResponse = {
   response: string
   confidence_score: number
   processing_time: number
   referenced_documents?: ChatContextSources[]
   user_message_id: string
   ai_message_id: string
}

export const useCreateConversationMutation = () => {
   const mutation = useMutation({
      mutationFn: createConversation,
      meta: {
         invalidatedQueries: [["conversations"]],
      },
   })

   return {
      ...mutation,
      isCreatingConversation: mutation.isPending,
      createConversationMutation: mutation.mutateAsync,
   }
}

export const useConversations = (filters?: ConversationFilterOptions, enabled = true) => {
   return useInfiniteQuery<PaginatedConverSationResponse>({
      queryKey: ["conversations", filters],
      queryFn: ({ pageParam = 1 }) => getConversations(pageParam as number, filters),
      getNextPageParam: lastPage => {
         if (!lastPage.next) return undefined
         const match = lastPage.next.match(/page=(\d+)/)
         return match ? parseInt(match[1]) : undefined
      },
      initialPageParam: 1,
      enabled,
      refetchOnMount: true,
   })
}

type StreamResponseCallbakcParams = {
   conversation_id: string
   message: string
}

export const useInstantChatResponse = () => {
   return async function (
      data: StreamResponseCallbakcParams,
      onMessage?: (message: string) => void,
      signal?: AbortSignal
   ) {
      const token = await getAccessToken()

      const resp = await fetch(`${serverURL}/user_space/chatbot/instant-response/`, {
         headers: {
            "Content-type": "application/json",
            Authorization: `token ${token}`,
         },
         method: "POST",
         body: JSON.stringify({ ...data }),
         signal,
      })

      if (!resp.ok) {
         return {
            ok: false,
            error: new Error(`HTTP ${resp.status}: ${resp.statusText}`),
         }
      }

      const bodyReader = resp.body?.getReader()
      if (!bodyReader) {
         return {
            ok: false,
            error: new Error("Response body is not readable"),
         }
      }

      const decoder = new TextDecoder("utf-8")
      if (!decoder) {
         return {
            ok: false,
            error: new Error("TextDecoder is not supported in this environment"),
         }
      }

      while (true) {
         const { done, value } = (await bodyReader?.read()) ?? {}
         if (done) {
            break
         }
         const chunk = decoder.decode(value, { stream: true }).trim()
         if (!chunk) continue

         onMessage?.(chunk)
      }

      return {
         ok: true,
         error: null,
      }
   }
}

/*
 * A grounded answer means a vector search plus a Gemini generation, which
 * regularly runs past ten seconds on a large space. The old 10s ceiling
 * surfaced healthy requests as "failed to get response from bot".
 * **/
const CHAT_RESPONSE_TIMEOUT_MS = 90_000

export const useInstantJSONResponse = () => {
   return async function (data: StreamResponseCallbakcParams, abortSignal?: AbortSignal) {
      return apiClient.post<ChatbotResponse>(
         "/user_space/chatbot/instant-response/",
         { ...data },
         { signal: abortSignal, timeout: CHAT_RESPONSE_TIMEOUT_MS }
      )
   }
}

/*
 * Message history for a conversation, oldest first, so reopening a space chat
 * restores the transcript instead of starting blank.
 * **/
export const useConversationMessages = (conversationId: string | null) => {
   return useQuery<PaginatedConversationMessages>({
      queryKey: ["conversations", conversationId, "messages"],
      queryFn: () => getConversationMessages(conversationId as string),
      enabled: !!conversationId,
   })
}
