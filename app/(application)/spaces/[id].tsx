import React from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { useSpaceStats, useSpaceDocuments, useToggleFavoriteSpace } from "@/hooks/queries/spaces"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { ErrorMessage } from "@/components/ErrorMessage"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { AnalysisResponse as Document } from "@/types/api/documents.types"
import { RecentDocumentItem } from "@/components/documents/RecentDocumentCard"
import CustomBackBtn from "@/components/CustomBackBtn"

export default function SpaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors } = useTheme()

  const {
    data: space,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: errorStats,
  } = useSpaceStats(id)
  const {
    data: documentsData,
    isLoading: isLoadingDocuments,
    isError: isErrorDocuments,
    error: errorDocuments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSpaceDocuments(id)
  const { mutate: toggleFavorite } = useToggleFavoriteSpace(id)

  const documents = documentsData?.pages.flatMap((page: any) => page.results) ?? []

  const handleToggleFavorite = () => {
    if (space) {
      toggleFavorite({ is_favorite: !space.is_favorite })
    }
  }

  if (isLoadingStats || isLoadingDocuments) {
    return <LoadingSpinner />
  }

  if (isErrorStats || isErrorDocuments) {
    return (
      <ErrorMessage
        message={errorStats?.message || errorDocuments?.message || "An error occurred"}
      />
    )
  }

  const renderDocument = ({ item }: { item: Document }) => (
    <RecentDocumentItem document={item} onPress={() => {}} />
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 5, gap: 10 }}>
        <CustomBackBtn />
        <Text style={[styles.title, { color: colors.text }]}>{space?.title}</Text>
      </View>

      <TouchableOpacity
        onPress={handleToggleFavorite}
        style={[
          styles.favoriteButton,
          { backgroundColor: space?.is_favorite ? colors.primary : colors.card },
        ]}
      >
        <Text style={{ color: space?.is_favorite ? colors.background : colors.text }}>
          {space?.is_favorite ? "Unfavorite" : "Favorite"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={item => item.id}
        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <LoadingSpinner /> : null}
        ListEmptyComponent={
          <Text style={{ color: colors.textMuted, textAlign: "center", marginTop: 20 }}>
            No documents in this space.
          </Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
    marginBottom: 16,
  },
  favoriteButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
})
