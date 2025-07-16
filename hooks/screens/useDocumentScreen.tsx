import { useDocumentsStore } from "@/store/useDocumentStore"
import { AnalysisResponse } from "@/types/api/documents.types"
import { router, useFocusEffect } from "expo-router"
import React, { useEffect, useState } from "react"
import { View, Text, Alert, StyleSheet } from "react-native"
import { useDebouncedCallback } from "../useDebouncCallback"
import { Button } from "@/components/Button"
import { useTheme } from "../useTheme"
import { FileText } from "lucide-react-native"
import { Fonts, FontSizes } from "@/constants"

export function useDocumentScreen(spaceId?: string, spaceName?: string) {
  const {
    documents,
    error,
    hasMore,
    init,
    isLoading,
    currentFilters,
    refreshDocuments,
    loadMoreDocuments,
    loadDocuments,
    applyFilters,
    deleteDocument,
  } = useDocumentsStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [showFilter, setShowFilter] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<AnalysisResponse | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (spaceId) init(spaceId)
  }, [spaceId])

  useFocusEffect(() => {
    loadDocuments()
  })

  const handleAddDocument = () => {
    router.push("/(application)/(tabs)/analyize")
  }

  const handleDeleteDocument = async (documentId: string) => {
    const success = await deleteDocument(documentId)
    if (success) {
      Alert.alert("Success", "Document deleted successfully")
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshDocuments()
    setRefreshing(false)
  }

  const debouncedSearch = useDebouncedCallback((text: string) => {
    applyFilters({ search: text })
  }, 300)

  const handleSearch = (text: string) => {
    setSearchQuery(text)
    debouncedSearch(text)
  }

  const FallbackStateWrapper = () => (
    <FallBackState
      searchQuery={searchQuery}
      handleAddDocument={handleAddDocument}
      spaceName={spaceName}
    />
  )

  return {
    documents,
    error,
    isLoading,
    hasMore,
    currentFilters,
    searchQuery,
    showFilter,
    selectedDocument,
    refreshing,
    setShowFilter,
    setSelectedDocument,
    handleAddDocument,
    handleDeleteDocument,
    handleRefresh,
    handleSearch,
    loadMoreDocuments,
    applyFilters,
    FallbackStateWrapper,
  }
}

/*
 *
 *
 * fallback state component
 * **/
function FallBackState({
  searchQuery,
  handleAddDocument,
  spaceName,
}: {
  searchQuery?: string
  handleAddDocument: () => void
  spaceName?: string
}) {
  const { colors } = useTheme()

  const title = spaceName
    ? `No documents in ${spaceName}`
    : searchQuery
      ? "No Documents Found"
      : "No Documents Yet"
  const description = spaceName
    ? "Add a document to this space to get started"
    : searchQuery
      ? "Try adjusting your search terms or filters"
      : "Start by analyzing your first legal document"

  return (
    <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
      <FileText size={64} color={colors.textMuted} />
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.emptyStateDescription, { color: colors.textSecondary }]}>
        {description}
      </Text>
      {!searchQuery && (
        <Button title="Add Document" onPress={handleAddDocument} variant="primary" size="large" />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.semiBold,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 40,
  },
})
