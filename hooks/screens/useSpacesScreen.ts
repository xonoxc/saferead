import { useState } from "react"
import { useDeleteSpace, useSpaces } from "../queries/spaces"
import { useQueryClient } from "@tanstack/react-query"
import { attempt } from "@/utils/attempt"
import { createSpace } from "@/services/api"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { Alert } from "react-native"
import { router, type RelativePathString } from "expo-router"

import type { ViewType } from "@/types/view"
import type { Space } from "@/types"
import { CreateSpaceForm, SpaceFormData } from "../forms/useSpaceHookForm"

export default function useSpaceScreen() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useSpaces()
  const { mutate: deleteSpace } = useDeleteSpace()
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [viewMode, setViewMode] = useState<ViewType>("grid")

  const queryClient = useQueryClient()

  const spaces = data?.pages.flatMap(page => page.results) ?? []

  const filteredSpaces = spaces.filter(
    space =>
      space.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateSpace = async (data: SpaceFormData) => {
    const result = await attempt(createSpace(data as CreateSpaceForm))
    if (!result.ok) {
      const errorMessage = getErrorMessage(result.error)
      Alert.alert("Error", errorMessage || "Failed to create space")
      return
    }

    await queryClient.invalidateQueries({
      queryKey: ["spaces"],
    })
    setCreateModalVisible(false)
  }

  const handleDeleteSpace = (spaceId: string, spaceName: string) => {
    Alert.alert("Delete Space", `Are you sure you want to delete "${spaceName}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteSpace(spaceId) },
    ])
  }

  const handleSpaceSelectPress = (space: Space) => {
    router.push(`/spaces/${space.id}` as RelativePathString)
  }

  return {
    isLoading,
    spaces: filteredSpaces,
    fetchNextPage,
    hasNextPage,
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
