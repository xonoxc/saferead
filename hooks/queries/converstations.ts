import { createConversation, getConversations } from "@/services/conversation.service"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import type { PaginatedConverSationResponse } from "@/types/api/conversations.types"
import type { ConversationFilterOptions } from "@/types/conversations"

export const useCreateConversationMutation = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createConversation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["conversations"] })
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
