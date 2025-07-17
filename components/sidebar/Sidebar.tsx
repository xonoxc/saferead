import React from "react"
import { getScreenWidth } from "@/utils/helpers/screens"
import { useTheme } from "@/hooks/useTheme"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { TouchableOpacity, View, StyleSheet, Text } from "react-native"
import SidebarContent from "./SidebarContent"
import CustomBackBtn from "../CustomBackBtn"
import { useLocalSearchParams } from "expo-router"
import { Folder, Plus } from "lucide-react-native"
import { useDocumentScreen } from "@/hooks/screens/useDocumentScreen"
import { Fonts, FontSizes } from "@/constants"

const SCREEN_WIDTH = getScreenWidth()

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const SideBar = ({ isOpen, onClose }: SidebarProps) => {
  const { colors } = useTheme()
  const { spaceId, spaceName, spaceColor } = useLocalSearchParams<{
    spaceId?: string
    spaceName?: string
    spaceColor?: string
  }>()

  const { handleAddDocument } = useDocumentScreen(spaceId, spaceName)

  const translateX = useSharedValue(SCREEN_WIDTH)

  React.useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : SCREEN_WIDTH, {
      duration: 300,
      easing: Easing.out(Easing.exp),
    })
  }, [isOpen])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <Animated.View style={[styles.sidebar, { backgroundColor: colors.background }, animatedStyle]}>
      <View style={styles.header}>
        <CustomBackBtn onBack={onClose} />
        {spaceName ? (
          <View style={styles.sideBarTitle}>
            <Folder size={24} color={spaceColor || colors.primary} />
            <Text style={[styles.title, { color: spaceColor || colors.text }]}>{spaceName}</Text>
          </View>
        ) : (
          <Text style={[styles.title, { color: colors.text }]}>Your Documents</Text>
        )}
        <TouchableOpacity
          style={[styles.addDocumentButton, { backgroundColor: colors.primary }]}
          onPress={handleAddDocument}
        >
          <Plus size={24} color={colors.background} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <SidebarContent />
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "100%",
    zIndex: 999,
    shadowOpacity: 0.3,
    shadowRadius: 0,
    shadowOffset: { width: 2, height: 0 },
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 50,
    marginBottom: 24,
  },
  addDocumentButton: {
    alignItems: "center",
    padding: 5,
    justifyContent: "center",
    borderRadius: 100,
  },
  sideBarTitle: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  item: {
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 16,
  },
})
