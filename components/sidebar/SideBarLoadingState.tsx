import { useTheme } from "@/hooks/useTheme"
import { Filter, Search } from "lucide-react-native"
import { FlatList, TouchableOpacity, View, StyleSheet, TextInput } from "react-native"
import { DocumentCardSkeleton } from "../skeletons"
import { Fonts, FontSizes } from "@/constants"

const SKELETON_COUNT = 3

interface SideBarLoadingStateProps {
  searchQuery: string
  handleSearch: (text: string) => void
  setShowFilter: (show: boolean) => void
}

export default function SideBarLoadingState({
  searchQuery,
  handleSearch,
  setShowFilter,
}: SideBarLoadingStateProps) {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}></View>
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchInputContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Search size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={text => handleSearch(text)}
            placeholder="Search documents..."
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => setShowFilter(true)}
        >
          <Filter size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={Array.from({ length: SKELETON_COUNT }).map((_, i) => ({ id: `skeleton-${i}` }))}
        bounces={true}
        keyExtractor={item => item.id}
        renderItem={() => <DocumentCardSkeleton />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 0,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.bold,
  },
  confidenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  confidenceText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
  },
  analysisPreview: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  summaryText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    lineHeight: 18,
    marginBottom: 8,
  },
  analysisStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
})
