import { useState } from "react"
import { useDeleteSpace, useSpaces } from "../queries/spaces"
import { useQueryClient } from "@tanstack/react-query"
import { attempt } from "@/utils/attempt"
import { createSpace } from "@/services/space.service"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { router } from "expo-router"
import { useDrawerAlert } from "../alerts/useAlert"

import type { ViewType } from "@/types/view"
import type { Space } from "@/types"
import type { CreateSpaceForm, SpaceFormData } from "../forms/useSpaceHookForm"
import type { RelativePathString } from "expo-router"

export default function useSpaceScreen() {
   const { mutateAsync: deleteSpace } = useDeleteSpace()
   const [createModalVisible, setCreateModalVisible] = useState<boolean>(false)
   const [searchQuery, setSearchQuery] = useState<string>("")
   const [viewMode, setViewMode] = useState<ViewType>("grid")
   const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({})
   const [showFilter, setShowFilter] = useState(false)

   const queryClient = useQueryClient()

   const showBottomAlert = useDrawerAlert()

   const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useSpaces(
      currentFilters,
      true
   )

   const spaces = data?.pages.flatMap(page => page.results) ?? []

   const filteredSpaces = spaces.filter(
      space =>
         space.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         space.description.toLowerCase().includes(searchQuery.toLowerCase())
   )

   const handleCreateSpace = async (data: SpaceFormData) => {
      const result = await attempt(() => createSpace(data as CreateSpaceForm))
      if (!result.ok) {
         showBottomAlert({
            type: "error",
            title: "Error",
            message: getErrorMessage(result.error) || "Failed to create space",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
         setCreateModalVisible(false)
         return
      }

      await queryClient.invalidateQueries({
         queryKey: ["spaces"],
      })
      setCreateModalVisible(false)
   }

   const handleDeleteSpace = (spaceId: string, spaceName: string) => {
      const safeDeleteSpace = async () => {
         const resp = await attempt(() => deleteSpace(spaceId))
         if (!resp.ok) {
            showBottomAlert({
               type: "error",
               title: "Error",
               message: getErrorMessage(resp.error) || "Failed to delete space",
               actions: [{ text: "OK", style: "primary", onPress: () => {} }],
            })
            return
         }
      }

      showBottomAlert({
         title: "Delete Space",
         message: `Are you sure you want to delete "${spaceName}"?`,
         actions: [
            { text: "Cancel", style: "primary", onPress: () => {} },
            {
               text: "Delete",
               style: "destructive",
               onPress: async () => await safeDeleteSpace(),
            },
         ],
      })
   }

   const handleSpaceSelectPress = (space: Space) => {
      router.push(`/spaces/${space.id}` as RelativePathString)
   }

   return {
      isLoading,
      spaces: filteredSpaces,
      fetchNextPage,
      hasNextPage,

      currentFilters,
      setCurrentFilters,
      showFilter,
      setShowFilter,

      isFetchingNextPage,
      createModalVisible,
      setCreateModalVisible,
      searchQuery,
      setSearchQuery,
      viewMode,
      setViewMode,
      handleCreateSpace,
      handleDeleteSpace,
      handleSpaceSelectPress,
   }
}
