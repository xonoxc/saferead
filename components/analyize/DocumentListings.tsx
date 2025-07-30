import { FlatList, ScrollView, Text, View, StyleSheet } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { RecentDocumentItem } from "../documents/RecentDocumentCard"

import type { ColorsType } from "@/hooks/useTheme"
import type { AnalysisResponse } from "@/types/api/documents.types"
import type { ViewType } from "@/types/view"
import { Fonts, FontSizes } from "@/constants"
import ViewMode from "../spaces/ViewModeSetter"

interface RecentDocumentListingProps {
  colors: ColorsType
  recentDocuments: AnalysisResponse[]
  viewType: ViewType
  setViewType: (type: ViewType) => void
  onRecentDocumentPress: (item: AnalysisResponse) => void
}

export default function RecentDocumentListings({
  colors,
  recentDocuments,
  setViewType,
  viewType,
  onRecentDocumentPress,
}: RecentDocumentListingProps) {
  /*
   * method to render recent document item
   * */
  const renderRecentItem = ({ item }: { item: AnalysisResponse }) => (
    <RecentDocumentItem
      document={item}
      onPress={() => onRecentDocumentPress(item)}
      viewType={viewType}
    />
  )

  return (
    <>
      <View style={styles.recentHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Recent Analysis</Text>
        <View style={styles.viewToggle}>
          <ViewMode viewMode={viewType} setViewMode={setViewType} />
        </View>
      </View>
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Recent Documents */}
        {recentDocuments.length > 0 && (
          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.recentSection}>
            <FlatList
              data={recentDocuments.slice(0, 5)}
              collapsableChildren={true}
              renderItem={renderRecentItem}
              keyExtractor={item => item.id}
              numColumns={viewType === "grid" ? 2 : 1}
              key={viewType}
              scrollEnabled={false}
              columnWrapperStyle={viewType === "grid" ? { gap: 10 } : undefined}
              contentContainerStyle={{ gap: 10 }}
            />
          </Animated.View>
        )}
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
  },
  recentSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    marginBottom: 16,
  },
  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  viewToggle: {
    flexDirection: "row",
    gap: 16,
  },
})
