import React, { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated as RNAnimated,
  TextInput,
} from "react-native"
import { Mic, MicOff, Upload, Camera, FileText, TrendingUp, Menu } from "lucide-react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { useDocuments } from "@/hooks/useDocuments"
import { useBackendDocuments } from "@/hooks/useBackendDocuments"
import { useVoice } from "@/hooks/useVoice"
import { useAuth } from "@/hooks/useAuth"
import { EnhancedAnalysisView } from "@/components/EnhancedAnalysisView"
import { DocumentTypeSelector, DocumentType } from "@/components/DocumentTypeSelector"
import { VoiceRecorder } from "@/components/VoiceRecorder"
import { Button } from "@/components/Button"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { uploadDocument, AnalysisResponse } from "@/services/api"
import { attempt } from "@/utils/attempt"
import UpgradeButton from "@/components/UpgradeButton"
import { SideBar } from "@/components/Sidebar/Sidebar"
import { useTabBarVisibility } from "@/hooks/useTabBarVisiblitiy"

interface RecentDocumentItemProps {
  document: AnalysisResponse
  onPress: () => void
}

const RecentDocumentItem: React.FC<RecentDocumentItemProps> = ({ document, onPress }) => {
  const { colors } = useTheme()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return colors.success
      case "processing":
        return colors.warning
      case "failed":
        return colors.error
      default:
        return colors.textSecondary
    }
  }

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
      legal: "Legal Agreement",
      other: "Other Document",
    }
    return types[type] || type
  }

  return (
    <TouchableOpacity
      style={[styles.recentDocumentItem, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={styles.documentHeader}>
        <View style={[styles.documentIcon, { backgroundColor: colors.primary + "20" }]}>
          <FileText size={20} color={colors.primary} />
        </View>
        <View style={styles.documentInfo}>
          <Text style={[styles.documentTitle, { color: colors.text }]} numberOfLines={1}>
            {document.original_filename}
          </Text>
          <Text style={[styles.documentType, { color: colors.textSecondary }]}>
            {getDocumentTypeLabel(document.document_type)}
          </Text>
        </View>
        <View style={styles.documentMeta}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(document.status) + "20" },
            ]}
          >
            <Text style={[styles.statusText, { color: getStatusColor(document.status) }]}>
              {document.status}
            </Text>
          </View>
          <Text style={[styles.documentDate, { color: colors.textSecondary }]}>
            {new Date(document.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {document.status === "completed" && (
        <View style={styles.documentStats}>
          <View style={styles.statItem}>
            <TrendingUp size={14} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {(document.confidence_score * 100).toFixed(0)}% confidence
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {document.risky_points.length} risks • {document.favourable_points.length} favorable
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  )
}

export default function AnalyzeScreen() {
  const { colors } = useTheme()
  const { user } = useAuth()
  const { pickDocument, scanDocument } = useDocuments()
  const { documents: recentDocuments } = useBackendDocuments()
  const { isRecording, startRecording, stopRecording, transcribeAudio } = useVoice()
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [pastedText, setPastedText] = useState("")
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>("other")
  const [showTextInput, setShowTextInput] = useState(false)

  const pulseAnim = useRef(new RNAnimated.Value(1)).current

  const [isSideBarOpen, setIsSideBarOpen] = useState(false)

  useTabBarVisibility(!isSideBarOpen, colors)

  /*   const scale = useSharedValue(1) */

  /* const _animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  })) */

  const handleItemPress = (item: string) => {
    setIsSideBarOpen(false)
    if (item === "logout") {
      console.log("Logging out...")
    } else if (item === "settings") {
      console.log("Go to settings")
    } else {
      console.log(`You tapped on ${item}`)
    }
  }

  React.useEffect(() => {
    if (isRecording) {
      const pulse = RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          RNAnimated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      )
      pulse.start()
      return () => pulse.stop()
    }
  }, [isRecording])

  const handleDocumentUpload = async () => {
    if (!user) {
      Alert.alert("Error", "Please log in to upload documents")
      return
    }

    try {
      const result = await pickDocument()
      if (result) {
        await handleAnalyzeDocument(result, selectedDocumentType)
      }
    } catch (error) {
      console.error("Upload error:", error)
      Alert.alert("Error", "Failed to upload document")
    }
  }

  const handleDocumentScan = async () => {
    if (!user) {
      Alert.alert("Error", "Please log in to scan documents")
      return
    }

    try {
      const result = await scanDocument()
      if (result) {
        await handleAnalyzeDocument(result, selectedDocumentType)
      }
    } catch (error) {
      console.error("Scan error:", error)
      Alert.alert("Error", "Failed to scan document")
    }
  }

  const handleAnalyzeDocument = async (document: any, docType: DocumentType) => {
    if (!user) {
      Alert.alert("Error", "Please log in to analyze documents")
      return
    }

    setIsAnalyzing(true)

    try {
      let documentFile: any
      let filename: string

      if (document.uri) {
        documentFile = {
          uri: document.uri,
          type: document.type || document.mimeType || "image/jpeg",
          name: document.name || document.title || "document",
        }
        filename = document.title || document.name || "document"
      } else if (document.content) {
        const textBlob = new Blob([document.content], { type: "text/plain" })
        documentFile = new File([textBlob], `${document.title || "document"}.txt`, {
          type: "text/plain",
        })
        filename = document.title || "document.txt"
      } else {
        throw new Error("Unsupported document format. Please try again.")
      }

      const uploadResult = await attempt(
        uploadDocument({
          document_file: documentFile,
          original_filename: filename,
          document_type: docType,
        })
      )

      if (!uploadResult.ok) {
        throw new Error(uploadResult.error.message || "Failed to analyze document")
      }

      setAnalysisResult(uploadResult.data)
    } catch (error) {
      if (error instanceof Error) {
        console.error("Analysis error:", error)
        Alert.alert("Error", error.message || "Failed to analyze document. Please try again.")
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleVoiceRecording = async () => {
    if (isRecording) {
      const audioUri = await stopRecording()
      if (audioUri) {
        setShowVoiceRecorder(false)
        const transcription = await transcribeAudio(audioUri)
        Alert.alert("Voice Note", `Transcription: ${transcription}`)
      }
    } else {
      await startRecording()
      setShowVoiceRecorder(true)
    }
  }

  const handleTextAnalysis = async () => {
    if (!pastedText.trim()) {
      Alert.alert("Error", "Please enter some text to analyze")
      return
    }

    if (!user) {
      Alert.alert("Error", "Please log in to analyze text")
      return
    }

    const textBlob = new Blob([pastedText], { type: "text/plain" })
    const textFile = new File([textBlob], "pasted-text.txt", { type: "text/plain" })

    await handleAnalyzeDocument(
      {
        title: "Pasted Text Analysis",
        content: pastedText,
        uri: textFile,
      },
      selectedDocumentType
    )
  }

  const handleRecentDocumentPress = (document: AnalysisResponse) => {
    setAnalysisResult(document)
  }

  if (analysisResult) {
    return <EnhancedAnalysisView analysis={analysisResult} onBack={() => setAnalysisResult(null)} />
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
  recentDocumentItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  documentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
    marginBottom: 2,
  },
  documentType: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
  },
  documentMeta: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
    textTransform: "capitalize",
  },
  documentDate: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
  },
  documentStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
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
