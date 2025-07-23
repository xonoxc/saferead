import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { Plus, Search } from "lucide-react-native"
import { Fonts, FontSizes } from "@/constants"

import type { ColorsType } from "@/hooks/useTheme"
import type { SetStateFunction } from "@/types/state"
import type { ViewType } from "@/types/view"
import ViewMode from "../ViewModeSetter"
import { TextInput } from "@/components/TextInput"

interface SpaceScreenHeaderProps {
  colors: ColorsType
  viewMode: ViewType
  setViewMode: SetStateFunction<ViewType>
  searchQuery: string
  setSearchQuery: SetStateFunction<string>
  setCreateModalVisible: (visible: boolean) => void
}

export default function SpaceScreenHeader({
  colors,
  viewMode,
  setViewMode,
  setSearchQuery,
  searchQuery,
  setCreateModalVisible,
}: SpaceScreenHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <View style={{ width: "auto" }}>
          <Text style={[styles.titleText, { color: colors.text }]}>Spaces</Text>
        </View>
        <View style={styles.headerIcons}>
          <ViewMode colors={colors} viewMode={viewMode} setViewMode={setViewMode} />
          <TouchableOpacity
            onPress={() => setCreateModalVisible(true)}
            style={[styles.createButton, { backgroundColor: colors.primary }]}
          >
            <Plus size={20} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { borderColor: colors.border }]}>
          <TextInput
            value={searchQuery}
            leftAccessory={<Search size={20} color={colors.textMuted} />}
            onChangeText={setSearchQuery}
            placeholder="Search spaces..."
            placeholderTextColor={colors.textMuted}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleText: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    padding: 5,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  createButton: {
    padding: 8,
    borderRadius: 12,
  },
  searchContainer: {
    paddingVertical: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
})
