import React from "react"
import { getScreenWidth } from "@/utils/helpers/screens"
import { useTheme } from "@/hooks/useTheme"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { PackagePlus } from "lucide-react-native"
import { SpacesSidebarContent } from "./SidebarSpacesContent"
import CustomBackBtn from "../CustomBackBtn"

import { useSpaceStore } from "@/store/useSpaceStore"
import { Space } from "@/types"

const SCREEN_WIDTH = getScreenWidth()

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const SideBar = ({ isOpen, onClose }: SidebarProps) => {
  const { colors } = useTheme()
  const [createFormVisible, setCreateFormVisible] = React.useState(false)
  const setSelectedSpace = useSpaceStore(s => s.setSelectedSpace)

  const translateX = useSharedValue(SCREEN_WIDTH)

  React.useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : SCREEN_WIDTH, {
      duration: 300,
      easing: Easing.out(Easing.exp),
    })
  }, [isOpen])

  const handleSpaceSelect = (space: Space) => {
    // TODO: Replace with actual data fetching or navigation
    setSelectedSpace(space)
    onClose()
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <Animated.View style={[styles.sidebar, { backgroundColor: colors.background }, animatedStyle]}>
      <View style={styles.header}>
        <CustomBackBtn onBack={onClose} />
        <TouchableOpacity
          onPress={() => setCreateFormVisible(true)}
          style={{ padding: 8, paddingHorizontal: 20 }}
        >
          <PackagePlus color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <SpacesSidebarContent
          showCreateModal={createFormVisible}
          onCreateFormClose={() => setCreateFormVisible(false)}
          onSpaceSelect={handleSpaceSelect}
        />
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
    padding: 20,
    shadowOpacity: 0.3,
    shadowRadius: 0,
    shadowOffset: { width: 2, height: 0 },
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
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
