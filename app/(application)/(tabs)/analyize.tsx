import React, { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated as RNAnimated,
} from "react-native"
import {
  Plus,
  Mic,
  MicOff,
  Upload,
  Camera,
  FileText,
  Menu,
  ListTree,
  Box,
  ArrowRight,
  ChevronRight,
} from "lucide-react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { defaultAnalysis, useDocuments } from "@/hooks/useDocuments"
import { useVoice } from "@/hooks/useVoice"
import { DocumentAnalysisView } from "@/components/DocumentAnalysisView"
import { VoiceRecorder } from "@/components/VoiceRecorder"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { Document, DocumentAnalysis } from "@/types"
import UpgradeButton from "@/components/UpgradeButton"
import { SideBar } from "@/components/Sidebar/Sidebar"
import { useNavigation } from "expo-router"
import { useTabBarVisibility } from "@/hooks/useTabBarVisiblitiy"

export default function AnalyzeScreen() {
  const { colors } = useTheme()
  const { documents, pickDocument, scanDocument, analyzeDocument } = useDocuments()
  const { isRecording, startRecording, stopRecording, transcribeAudio } = useVoice()
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [pastedText, _] = useState("")

  const [isSideBarOpen, setIsSideBarOpen] = useState(false)

  const pulseAnim = useRef(new RNAnimated.Value(1)).current

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
    const doc = await pickDocument()
    if (doc) {
      setSelectedDocument(doc)
      handleAnalyze(doc)
    }
  }

  const handleDocumentScan = async () => {
    const doc = await scanDocument()
    if (doc) {
      setSelectedDocument(doc)
      handleAnalyze(doc)
    }
  }

  const handleAnalyze = async (document: Document) => {
    setIsAnalyzing(true)

    const analysis = await analyzeDocument(document.id)
    console.log("Analyzing document:", document.title, analysis)

    setAnalysisResult({
      ...defaultAnalysis,
      riskyPoints: 1,
      favorablePoints: 4,
    })

    setIsAnalyzing(false)
  }

  const handleVoiceRecording = async () => {
    if (isRecording) {
      const audioUri = await stopRecording()
      if (audioUri) {
        setShowVoiceRecorder(false)
        // Process voice command or transcribe
        const transcription = await transcribeAudio(audioUri)
        Alert.alert("Voice Note", `Transcription: ${transcription}`)
      }
    } else {
      await startRecording()
      setShowVoiceRecorder(true)
    }
  }

  const handleTextAnalysis = () => {
    if (!pastedText.trim()) {
      Alert.alert("Error", "Please paste some text to analyze")
      return
    }

    // Create a mock document from pasted text
    const mockDoc = {
      id: Date.now().toString(),
      title: "Pasted Text Analysis",
      content: pastedText,
      type: "text",
    }

    //@ts-ignore
    setSelectedDocument(mockDoc)

    //@ts-ignore
    handleAnalyze(mockDoc)
  }

  if (analysisResult && selectedDocument) {
    return (
      <DocumentAnalysisView
        document={selectedDocument}
        analysis={analysisResult}
        onBack={() => {
          setAnalysisResult(null)
          setSelectedDocument(null)
        }}
      />
    )
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
              onPress={handleTextAnalysis}
            >
              <View style={[styles.uploadIcon, { backgroundColor: colors.accent + "20" }]}>
                <FileText size={24} color={colors.accent} />
              </View>
              <Text style={[styles.uploadText, { color: colors.text }]}>Analyze Text</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Text Input Area */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={[styles.textInputCard, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.textInputLabel, { color: colors.textSecondary }]}>
            Paste your document here
          </Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color={colors.primary} />
          </TouchableOpacity>
        </Animated.View>

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
              {isRecording ? <MicOff size={32} color="black" /> : <Mic size={32} color="black" />}
            </RNAnimated.View>
          </TouchableOpacity>
          <Text style={[styles.voiceText, { color: colors.textSecondary }]}>
            {isRecording ? "Recording... Tap to stop" : "Tap to record voice note"}
          </Text>
        </Animated.View>

        {/* Recent Documents */}
        {documents.length > 0 && (
          <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.recentSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Documents</Text>
            {documents.slice(0, 3).map(doc => (
              <TouchableOpacity
                key={doc.id}
                style={[styles.recentItem, { backgroundColor: colors.card }]}
                onPress={() => {
                  setSelectedDocument(doc)
                  if (doc.analysis) {
                    setAnalysisResult(doc.analysis)
                  } else {
                    handleAnalyze(doc)
                  }
                }}
              >
                <View style={[styles.recentIcon, { backgroundColor: colors.surface }]}>
                  <FileText size={20} color={colors.primary} />
                </View>
                <View style={styles.recentContent}>
                  <Text style={[styles.recentTitle, { color: colors.text }]} numberOfLines={1}>
                    {doc.title}
                  </Text>
                  <Text style={[styles.recentDate, { color: colors.textSecondary }]}>
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                {doc.analysis && (
                  <View style={[styles.analysisIndicator, { backgroundColor: colors.success }]} />
                )}
              </TouchableOpacity>
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
  assistantCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  assistantHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bold,
  },
  assistantInfo: {
    flex: 1,
  },
  assistantName: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
  },
  messageContainer: {
    borderRadius: 12,
    padding: 16,
  },
  messageText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    lineHeight: 22,
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
    minHeight: 120,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E0E0E0",
  },
  textInputLabel: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
    marginBottom: 12,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
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
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
    marginBottom: 2,
  },
  recentDate: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
  },
  analysisIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  },
  loadingText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
    textAlign: "center",
  },
})
