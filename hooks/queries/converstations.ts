import { createConversation, getConversations } from "@/services/conversation.service"
import { useInfiniteQuery, useMutation } from "@tanstack/react-query"

import { apiClient, getAccessToken } from "@/utils/apiclient"
import { serverURL } from "@/constants"
import { fetch } from "expo/fetch"

import type { PaginatedConverSationResponse } from "@/types/api/conversations.types"
import type { ConversationFilterOptions } from "@/types/conversations"

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

export const useInstantJSONResponse = () => {
   return async function (data: StreamResponseCallbakcParams) {
      return apiClient.post("/user_space/chatbot/instant-response/", {
         ...data,
      })
   }
}
