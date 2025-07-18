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
import CustomBackBtn from "../CustomBackBtn"
import SideBarDocumentContent from "./SidebarContent"
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

  const {
    documents,
    error,
    isLoading,
    hasMore,
    currentFilters,
    searchQuery,
    showFilter,
    isRefreshing,
    setShowFilter,
    handleAddDocument,
    handleDocumentSelectPress,

    isDeleting,
    setSearchQuery,
    handleDeleteDocument,
    handleRefresh,
    handleSearch,
    loadMoreDocuments,
    applyFilters,
    FallbackStateWrapper,
  } = useDocumentScreen(spaceId, spaceName)

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
          style={[styles.addDocumentButton, { backgroundColor: colors.background }]}
          onPress={handleAddDocument}
        >
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <SideBarDocumentContent
          spaceId={spaceId}
          spaceName={spaceName}
          documents={documents}
          error={error}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          isDeleting={isDeleting}
          hasMore={hasMore}
          currentFilters={currentFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilter={showFilter}
          applyFilters={applyFilters}
          setShowFilter={setShowFilter}
          handleAddDocument={handleAddDocument}
          handleDeleteDocument={handleDeleteDocument}
          handleDocumentSelectPress={handleDocumentSelectPress}
          handleSearch={handleSearch}
          handleRefresh={handleRefresh}
          loadMoreDocuments={loadMoreDocuments}
          FallbackStateWrapper={FallbackStateWrapper}
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
    shadowOpacity: 0.3,
    shadowRadius: 0,
    shadowOffset: { width: 2, height: 0 },
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 30,
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
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
  },
  item: {
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 16,
  },
})
