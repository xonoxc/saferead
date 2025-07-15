import React from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated as RNAnimated,
  TextInput,
} from "react-native"
import { Mic, MicOff, Upload, Camera, FileText, Menu } from "lucide-react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { DocumentTypeSelector } from "@/components/DocumentTypeSelector"
import { VoiceRecorder } from "@/components/VoiceRecorder"
import { Button } from "@/components/Button"
import { Fonts, FontSizes } from "@/constants/Fonts"
import UpgradeButton from "@/components/UpgradeButton"
import { SideBar } from "@/components/sidebar/Sidebar"
import { DocumentAnalysisView } from "@/components/documents/DocumentAnalysisView"
import { RecentDocumentItem } from "@/components/documents/RecentDocumentCard"
import { useAnalysis } from "@/hooks/useAnalysis"

export default function AnalyzeScreen() {
  const { colors } = useTheme()

  const {
    isRecording,
    isSideBarOpen,
    setIsSideBarOpen,
    isAnalyzing,
    analysisResult,
    showVoiceRecorder,
    setShowVoiceRecorder,
    pulseAnim,
    handleItemPress,
    handleDocumentUpload,
    handleDocumentScan,
    handleVoiceRecording,
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
  } = useAnalysis()

  if (analysisResult) {
    return <DocumentAnalysisView analysis={analysisResult} onBack={() => setAnalysisResult(null)} />
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SideBar
        isOpen={isSideBarOpen}
        onClose={() => setIsSideBarOpen(false)}
        onItemPress={handleItemPress}
      />

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
        <View style={styles.innerHeader}>
          <TouchableOpacity
            onPress={() => setIsSideBarOpen(true)}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              justifyContent: "center",
              paddingHorizontal: 16,
            }}
          >
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

          <View style={{ alignItems: "center" }}>
            <UpgradeButton />
          </View>
        </View>
      </Animated.View>
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

        {/* Voice Recorder */}
        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.voiceSection}>
          <TouchableOpacity
            style={[
              styles.voiceButton,
              { backgroundColor: isRecording ? colors.error : colors.primary },
            ]}
            onPress={handleVoiceRecording}
          >
            <RNAnimated.View style={{ transform: [{ scale: pulseAnim }] }}>
              {isRecording ? <MicOff size={32} color="white" /> : <Mic size={32} color="white" />}
            </RNAnimated.View>
          </TouchableOpacity>
          <Text style={[styles.voiceText, { color: colors.textSecondary }]}>
            {isRecording ? "Recording... Tap to stop" : "Tap to record voice note"}
          </Text>
        </Animated.View>

        {/* Recent Documents */}
        {recentDocuments.length > 0 && (
          <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.recentSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Analysis</Text>
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

      {/* Voice Recorder Modal */}
      {showVoiceRecorder && (
        <VoiceRecorder
          isVisible={showVoiceRecorder}
          isRecording={isRecording}
          onClose={() => setShowVoiceRecorder(false)}
          onStopRecording={handleVoiceRecording}
        />
      )}

      {/* Loading Overlay */}
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
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    width: "100%",
    justifyContent: "center",
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
  analyzeButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 24,
  },
  voiceSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  voiceText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
  recentSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    marginBottom: 16,
  },
  documentDate: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
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
