import React from "react"
import { Button } from "@/components/Button"
import { Fonts, FontSizes } from "@/constants"
import UpgradeButton from "@/components/UpgradeButton"
import { SideBar } from "@/components/sidebar"
import { useAnalysis } from "@/hooks/useAnalysis"
import { ChatView } from "@/components/chat"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { Upload, Camera, FileText, Menu, LogOut } from "lucide-react-native"
import Animated, { FadeInDown, FadeIn, FadeOut } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import {
  DocumentTypeSelector,
  RecentDocumentItem,
  DocumentAnalysisView,
} from "@/components/documents"

export default function AnalyzeScreen() {
  const { colors } = useTheme()

  const {
    isSideBarOpen,
    setIsSideBarOpen,
    isAnalyzing,
    analysisResult,
    handleDocumentUpload,
    handleDocumentScan,
    pastedText,
    setPastedText,
    selectedDocumentType,
    setSelectedDocumentType,
    showTextInput,
    setShowTextInput,
    handleTextAnalysis,
    recentDocuments,
    setAnalysisResult,
    handleRecentDocumentPress,
    selectedSpace,
    setSelectedSpace,
  } = useAnalysis()

  if (analysisResult) {
    return <DocumentAnalysisView analysis={analysisResult} onBack={() => setAnalysisResult(null)} />
  }

  const handleSpaceClose = () => {
    setSelectedSpace(null)
  }

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
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                style={[styles.uploadOption, { backgroundColor: colors.card }]}
                onPress={handleDocumentScan}
              >
                <View style={[styles.uploadIcon, { backgroundColor: colors.primary + "20" }]}>
                  <Camera size={24} color={colors.primary} />
                </View>
                <Text style={[styles.uploadText, { color: colors.text }]}>Scan Document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadOption, { backgroundColor: colors.card }]}
                onPress={handleDocumentUpload}
              >
                <View style={[styles.uploadIcon, { backgroundColor: colors.secondary + "20" }]}>
                  <Upload size={24} color={colors.secondary} />
                </View>
                <Text style={[styles.uploadText, { color: colors.text }]}>Upload File</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadOption, { backgroundColor: colors.card }]}
                onPress={() => setShowTextInput(!showTextInput)}
              >
                <View style={[styles.uploadIcon, { backgroundColor: colors.accent + "20" }]}>
                  <FileText size={24} color={colors.accent} />
                </View>
                <Text style={[styles.uploadText, { color: colors.text }]}>Analyze Text</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Text Input Area */}
          {showTextInput && (
            <Animated.View
              entering={FadeInDown.delay(400).springify()}
              style={[styles.textInputCard, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.textInputLabel, { color: colors.text }]}>
                Enter or paste your document text
              </Text>
              <TextInput
                style={[styles.textInput, { color: colors.text, borderColor: colors.border }]}
                value={pastedText}
                onChangeText={setPastedText}
                placeholder="Paste your document text here..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              <Button
                title="Analyze Text"
                onPress={handleTextAnalysis}
                variant="primary"
                disabled={!pastedText.trim()}
              />
            </Animated.View>
          )}

          {/* Recent Documents */}
          {recentDocuments.length > 0 && (
            <Animated.View
              entering={FadeInDown.delay(600).springify()}
              style={styles.recentSection}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Analysis</Text>
              {/* TODO: Replace with actual recent documents */}
              {recentDocuments.slice(0, 5).map(doc => (
                <RecentDocumentItem
                  key={doc.id}
                  document={doc}
                  onPress={() => handleRecentDocumentPress(doc)}
                />
              ))}
            </Animated.View>
          )}
        </ScrollView>
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
  uploadSection: {
    marginBottom: 24,
  },
  uploadGrid: {
    flexDirection: "row",
    gap: 12,
  },
  uploadOption: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
})
