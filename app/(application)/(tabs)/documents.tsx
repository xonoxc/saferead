import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { Plus, Filter, Camera, Upload, FileText } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { useDocuments } from "@/hooks/useDocuments"
import { DocumentCard } from "@/components/DocumentCard"
import { Button } from "@/components/Button"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { SearchBar } from "@/components/SearchBar"

export default function AnalyzeScreen() {
  const { colors } = useTheme()
  const { documents, isLoading, pickDocument, scanDocument, analyzeDocument } = useDocuments()
  const [searchQuery, setSearchQuery] = useState("")
  const [showActions, setShowActions] = useState(false)

  const filteredDocuments = documents.filter(
    doc =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddDocument = () => {
    setShowActions(true)
  }

  const handlePickDocument = async () => {
    setShowActions(false)
    await pickDocument()
  }

  const handleScanDocument = async () => {
    setShowActions(false)
    await scanDocument()
  }

  const handleAnalyzeDocument = async (docId: string) => {
    await analyzeDocument(docId)
    Alert.alert("Success", "Document analyzed successfully")
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Your Documents</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddDocument}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.card }]}>
          <Filter size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {showActions && (
        <View style={[styles.actionsContainer, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.actionItem} onPress={handleScanDocument}>
            <Camera size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Scan Document</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={handlePickDocument}>
            <Upload size={24} color={colors.secondary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Upload File</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => setShowActions(false)}>
            <FileText size={24} color={colors.accent} />
            <Text style={[styles.actionText, { color: colors.text }]}>Text Input</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content}>
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map(document => (
            <DocumentCard
              key={document.id}
              document={document}
              onPress={() => {
                // Navigation here
              }}
              onAnalyze={() => handleAnalyzeDocument(document.id)}
            />
          ))
        ) : (
          <View style={[styles.emptyState]}>
            <FileText size={64} color={colors.textMuted} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Documents Found</Text>
            <Text style={[styles.emptyStateDescription, { color: colors.textSecondary }]}>
              {searchQuery
                ? "Try adjusting your search terms"
                : "Start by adding your first legal document"}
            </Text>
            {!searchQuery && (
              <Button
                title="Add Document"
                onPress={handleAddDocument}
                variant="primary"
                size="large"
              />
            )}
          </View>
        )}
      </ScrollView>
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
  title: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  actionsContainer: {
    margin: 20,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  actionText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  emptyState: {
    alignItems: "center",
    padding: 30,
    borderRadius: 12,
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
    lineHeight: 20,
    marginBottom: 24,
  },
})
