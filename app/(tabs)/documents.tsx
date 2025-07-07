import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { Plus, Search, Filter, Camera, Upload, FileText } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { useDocuments } from "@/hooks/useDocuments"
import { DocumentCard } from "@/components/DocumentCard"
import { Button } from "@/components/Button"
import { TextInput } from "@/components/TextInput"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Fonts, FontSizes } from "@/constants/Fonts"

export default function DocumentsScreen() {
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
    try {
      await pickDocument()
    } catch (error) {
      Alert.alert("Error", "Failed to pick document")
    }
  }

  const handleScanDocument = async () => {
    setShowActions(false)
    try {
      await scanDocument()
    } catch (error) {
      Alert.alert("Error", "Failed to scan document")
    }
  }

  const handleAnalyzeDocument = async (docId: string) => {
    try {
      await analyzeDocument(docId)
      Alert.alert("Success", "Document analyzed successfully")
    } catch (error) {
      Alert.alert("Error", "Failed to analyze document")
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Documents</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: "#161717" }]}
          onPress={handleAddDocument}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search documents..."
          />
        </View>
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
                // Navigate to document detail
              }}
              onAnalyze={() => handleAnalyzeDocument(document.id)}
            />
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
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
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    fontSize: 38,
    fontFamily: Fonts.bold,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 13,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 12,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  actionsContainer: {
    margin: 20,
    marginTop: 0,
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
  },
  emptyState: {
    alignItems: "center",
    padding: 48,
    borderRadius: 12,
    margin: 20,
    marginHorizontal: 10,
  },
  emptyStateTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  addDocumentButton: {
    borderRadius: 30,
  },
})
