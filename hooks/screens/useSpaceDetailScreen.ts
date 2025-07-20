import { useState } from "react"
import { FileText, TrendingUp } from "lucide-react-native"
import { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useSpaces } from "@/hooks/queries/spaces"
import { Alert } from "react-native"
import { updateSpace } from "@/services/api"
import { useSpaceStore } from "@/store/useSpaceStore"

import { ColorsType } from "../useTheme"

export function useSpaceDetailsScreen({ colors }: { colors: ColorsType }) {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: spaces } = useSpaces()
  const router = useRouter()
  const setSpace = useSpaceStore(s => s.setSelectedSpace)
  const [isSheetVisible, setSheetVisible] = useState(false)

  const flattendSpaces = spaces?.pages.flatMap(page => page.results) ?? []

  const space = flattendSpaces.find(s => s.id === id)
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handleFavoritePress = () => {
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1)
    })

    if (space) {
      updateSpace(space.id, { is_favorite: !space.is_favorite })
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
      color: colors.success,
    },
    /* {
      icon: Calendar,
      label: "This Month",
      value: .filter(d => {
        const docDate = new Date(d.createdAt)
        const now = new Date()
        return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear()
      }).length,
      color: colors.warning,
    },  */
  ]

  const handleOpenChat = () => {
    if (space) {
      setSpace(space)
      router.push("/(application)/(tabs)/analyize")
    }
  }

  const handleBottomSheetClose = () => setSheetVisible(false)

  return {
    space,
    stats,
    handleFavoritePress,
    handleOpenChat,
    isSheetVisible,
    setSheetVisible,
    animatedStyle,
    handleBottomSheetClose,
    router,
  }
}
