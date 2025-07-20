import { StyleSheet, View, Text, TouchableOpacity, TextInput } from "react-native"

import type { ColorsType } from "@/hooks/useTheme"
import type { SetStateFunction } from "@/types/state"
import type { ViewType } from "@/types/view"
import { LayoutGrid, List, Plus, Search } from "lucide-react-native"
import { Fonts, FontSizes } from "@/constants"

export const renderHeader = ({
  colors,
  viewMode,
  setViewMode,
  setSearchQuery,
  searchQuery,
  setCreateModalVisible,
}: {
  colors: ColorsType
  viewMode: ViewType
  setViewMode: SetStateFunction<ViewType>
  searchQuery: string
  setSearchQuery: SetStateFunction<string>
  setCreateModalVisible: (visible: boolean) => void
}) => (
  <View style={styles.headerContainer}>
    <View style={styles.header}>
      <View style={{ width: "auto" }}>
        <Text style={[styles.titleText, { color: colors.text }]}>Spaces</Text>
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={() => setViewMode("list")} style={styles.iconButton}>
          <List size={24} color={viewMode === "list" ? colors.primary : colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setViewMode("grid")} style={styles.iconButton}>
          <LayoutGrid size={24} color={viewMode === "grid" ? colors.primary : colors.textMuted} />
        </TouchableOpacity>
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
        <Search size={20} color={colors.textMuted} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search spaces..."
        />
      </View>
    </View>
  </View>
)

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
  iconButton: {
    padding: 4,
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
    paddingLeft: 12,
    paddingHorizontal: 10,
  },
})
