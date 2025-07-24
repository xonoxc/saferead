import { useState } from "react"
import { FileText, TrendingUp } from "lucide-react-native"
import { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useSpaces } from "@/hooks/queries/spaces"
import { Alert } from "react-native"
import { updateSpace } from "@/services/space.service"
import { useSpaceStore } from "@/store/useSpaceStore"

import { ColorsType } from "../useTheme"
import { attempt } from "@/utils/attempt"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { useQueryClient } from "@tanstack/react-query"
import { UpdateSpaceForm } from "../forms/useSpaceHookForm"

export function useSpaceDetailsScreen({ colors }: { colors: ColorsType }) {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: spaces } = useSpaces()
  const router = useRouter()
  const setSpace = useSpaceStore(s => s.setSelectedSpace)

  const queryClient = useQueryClient()

  const scale = useSharedValue(1)
  const [isSheetVisible, setSheetVisible] = useState(false)
  const [isUploadDocFormVisible, setIsUploadDocFormVisible] = useState(false)

  const flattendSpaces = spaces?.pages.flatMap(page => page.results) ?? []
  const space = flattendSpaces.find(s => s.id === id)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handleFavoritePress = async () => {
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1)
    })

    if (space) {
      await updateSpace(space.id, { is_favorite: !space.is_favorite })
      Alert.alert("Success", space.is_favorite ? "Removed from favorites" : "Added to favorites", [
        { text: "OK", onPress: () => {} },
      ])
    }
  }

  const stats = [
    {
      icon: FileText,
      label: "Documents",
      value: space?.document_count,
      color: space?.color,
    },
    {
      icon: TrendingUp,
      label: "Analyzed",
      value: space?.recent_documents.length,
      color: space?.color,
    },
  ]

  const handleOpenChat = () => {
    if (space) {
      setSpace(space)
      router.push("/(application)/(tabs)/analyize")
    }
  }

  /*
   *
   * So that the upload form and the sheet do not overlap, we toggle visibility of one when the other is opened.
   * **/
  const toggleSheetVisiblity = () => {
    if (isUploadDocFormVisible) {
      setIsUploadDocFormVisible(false)
    }
    setSheetVisible(prev => !prev)
  }
  const toggleUploadFormVisibilty = () => {
    if (isSheetVisible) {
      setSheetVisible(false)
    }
    setIsUploadDocFormVisible(prev => !prev)
  }

  const handleUpdateSpace = async (data: UpdateSpaceForm) => {
    if (!space?.id) return

    const resp = await attempt(updateSpace(space.id, data))
    if (!resp.ok) {
      const errorMessage = getErrorMessage(resp.error)
      Alert.alert("Error", errorMessage || "Failed to update space")
      return
    }

    await queryClient.invalidateQueries({
      queryKey: ["spaces"],
    })

    toggleSheetVisiblity()
  }

  return {
    space,
    stats,
    handleFavoritePress,
    handleOpenChat,
    isSheetVisible,
    isUploadDocFormVisible,
    setSheetVisible,
    animatedStyle,
    toggleSheetVisiblity,
    toggleUploadFormVisibilty,
    router,
    colors,
    handleUpdateSpace,
  }
}
