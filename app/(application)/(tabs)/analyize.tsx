import React, { useState } from "react"
import { Fonts, FontSizes } from "@/constants"
import UpgradeButton from "@/components/UpgradeButton"
import { SideBar } from "@/components/sidebar"
import { useAnalysis } from "@/hooks/useAnalysis"
import { ChatView } from "@/components/chat"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native"
import { Upload, Camera, Menu, LogOut, LayoutGrid, List } from "lucide-react-native"
import Animated, { FadeInDown, FadeIn, FadeOut } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { DocumentTypeSelector } from "@/components/documents/DocumentTypeSelector"
import { RecentDocumentItem } from "@/components/documents/RecentDocumentCard"

import { AnalyzeScreenSkeleton } from "@/components/skeletons"
import type { ViewType } from "@/types/view"

export default function AnalyzeScreen() {
  const { colors } = useTheme()
  const [viewType, setViewType] = useState<ViewType>("list")

  const {
    isSideBarOpen,
    setIsSideBarOpen,
    isAnalyzing,
    handleDocumentUpload,
    handleDocumentScan,
    selectedDocumentType,
    setSelectedDocumentType,
    recentDocuments,
    handleRecentDocumentPress,
    selectedSpace,
    isRecentDocumentsLoading,
    setSelectedSpace,
  } = useAnalysis()

  if (isAnalyzing || isRecentDocumentsLoading)
    return <AnalyzeScreenSkeleton isAnalizing={isAnalyzing} />

  const handleSpaceClose = () => {
    setSelectedSpace(null)
  }

  const renderRecentItem = ({ item }: { item: any }) => (
    <RecentDocumentItem
      document={item}
      onPress={() => handleRecentDocumentPress(item)}
      viewType={viewType}
    />
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SideBar isOpen={isSideBarOpen} onClose={() => setIsSideBarOpen(false)} />

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
        <View style={styles.innerHeader}>
          {/* Left: Menu */}
          <TouchableOpacity onPress={() => setIsSideBarOpen(true)}>
            <Menu
              color={colors.text}
              style={{
                width: 24,
                height: 24,
                padding: 4,
                borderRadius: 12,
                backgroundColor: colors.card + "20",
              }}
            />
          </TouchableOpacity>

          {/* Center: Upgrade */}
          <View style={{ flex: 1, alignItems: "center" }}>
            <UpgradeButton />
          </View>

          {/* Right: Exit only if inside Chat */}
          {selectedSpace ? (
            <TouchableOpacity onPress={handleSpaceClose}>
              <LogOut size={18} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 24 }} />
          )}
        </View>
      </Animated.View>

      {selectedSpace ? (
        <Animated.View style={{ flex: 1 }} entering={FadeIn} exiting={FadeOut}>
          <ChatView space={selectedSpace} />
        </Animated.View>
      ) : (
        <View style={styles.content}>
          {/* Document Type Selector */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <DocumentTypeSelector
              selectedType={selectedDocumentType}
              onSelect={setSelectedDocumentType}
            />
          </Animated.View>

          {/* Upload Options */}
          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.uploadSection}>
            <View style={styles.uploadGrid}>
              <TouchableOpacity
                style={[
                  styles.uploadOption,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
                onPress={handleDocumentScan}
              >
                <View style={[styles.uploadIcon, { backgroundColor: colors.primary + "20" }]}>
                  <Camera size={24} color={colors.primary} />
                </View>
                <Text style={[styles.uploadText, { color: colors.text }]}>Scan Document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.uploadOption,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
                onPress={handleDocumentUpload}
              >
                <View style={[styles.uploadIcon, { backgroundColor: colors.secondary + "20" }]}>
                  <Upload size={24} color={colors.secondary} />
                </View>
                <Text style={[styles.uploadText, { color: colors.text }]}>Upload File</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            {/* Recent Documents */}
            {recentDocuments.length > 0 && (
              <Animated.View
                entering={FadeInDown.delay(600).springify()}
                style={styles.recentSection}
              >
                <View style={styles.recentHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
                    Recent Analysis
                  </Text>
                  <View style={styles.viewToggle}>
                    <TouchableOpacity onPress={() => setViewType("list")}>
                      <List size={20} color={viewType === "list" ? colors.primary : colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setViewType("grid")}>
                      <LayoutGrid
                        size={20}
                        color={viewType === "grid" ? colors.primary : colors.text}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <FlatList
                  data={recentDocuments.slice(0, 5)}
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
        </View>
      )}

      {isAnalyzing && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.loadingText, { color: colors.text }]}>Analyzing Document...</Text>
            <Text style={[styles.loadingSubtext, { color: colors.textSecondary }]}>
              This may take a few moments
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    paddingBottom: 0,
  },
  innerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flex: 1,
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadGrid: {
    flexDirection: "row",
    gap: 12,
  },
  uploadOption: {
    flex: 1,
    borderRadius: 18,
    borderStyle: "dashed",
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
    textAlign: "center",
  },
  textInputCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  textInputLabel: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    minHeight: 120,
    marginBottom: 16,
  },
  chatSection: {
    marginBottom: 32,
  },
  recentSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    marginBottom: 16,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingCard: {
    borderRadius: 12,
    padding: 24,
    margin: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
    textAlign: "center",
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewToggle: {
    flexDirection: "row",
    gap: 16,
  },
})
