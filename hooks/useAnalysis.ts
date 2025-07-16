import { useState } from "react"
import { Alert } from "react-native"
import { useTabBarVisibility } from "@/hooks/useTabBarVisiblitiy"
import { attempt, Result } from "@/utils/attempt"
import { useAuth } from "@/hooks/useAuth"
import type { DocumentType } from "@/components/documents"
import { useSpaceStore } from "@/store/useSpaceStore"
import { useDocumentsStore } from "@/store/useDocumentStore"
import { AnalysisResponse } from "@/types/api/documents.types"

import { uploadDocument } from "@/services/api"

import * as DocumentPicker from "expo-document-picker"
import * as ImagePicker from "expo-image-picker"

export function useAnalysis() {
  const { user } = useAuth()
  const { documents: recentDocuments } = useDocumentsStore()
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [pastedText, setPastedText] = useState("")
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>("other")
  const [showTextInput, setShowTextInput] = useState(false)
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  const { selectedSpace, setSelectedSpace } = useSpaceStore()

  useTabBarVisibility(!(isSideBarOpen || !!selectedSpace))

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

  const handleDocumentUpload = async () => {
    if (!user) {
      Alert.alert("Error", "Please log in to upload documents")
      return
    }

    const result = await pickDocument()
    if (!result.ok) {
      Alert.alert("Error", result.error.message)
      return
    }

    await handleAnalyzeResult(result)
  }

  const handleDocumentScan = async () => {
    if (!user) {
      Alert.alert("Error", "Please log in to scan documents")
      return
    }

    const result = await scanDocument()
    if (!result.ok) {
      Alert.alert("Error", result.error.message)
      return
    }

    await handleAnalyzeResult(result)
  }

  const handleAnalyzeResult = async (result: Result<AnalysisResponse, Error>) => {
    if (!result.ok) {
      Alert.alert("Error", result.error.message)
      return
    }

    setIsAnalyzing(true)
    setAnalysisResult(result.data)
    setIsAnalyzing(false)
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

    const uploadResult = await attempt(
      uploadDocument({
        document_file: textFile,
        original_filename: "pasted-text.txt",
        document_type: selectedDocumentType,
      })
    )

    if (!uploadResult.ok) {
      Alert.alert("Error", uploadResult.error.message)
      return
    }

    const uploadResponse = uploadResult.data

    await handleAnalyzeResult(uploadResponse)
  }

  const handleRecentDocumentPress = (document: AnalysisResponse) => {
    setAnalysisResult(document)
  }

  return {
    user,
    isAnalyzing,
    analysisResult,
    handleItemPress,
    handleDocumentUpload,
    isSideBarOpen,
    setIsSideBarOpen,
    handleDocumentScan,
    handleAnalyzeResult,
    pastedText,
    setPastedText,
    selectedDocumentType,
    setAnalysisResult,
    setSelectedDocumentType,
    showTextInput,
    setShowTextInput,
    handleTextAnalysis,
    selectedSpace,
    setSelectedSpace,
    recentDocuments,
    handleRecentDocumentPress,
  }
}

/*
 *
 * Document Picker and Scanner Functions
 * **/
export async function pickDocument(): Promise<Result<AnalysisResponse, Error>> {
  const result = await attempt(DocumentPicker.getDocumentAsync())

  if (!result.ok)
    return {
      ok: false,
      error: new Error("Failed to pick document. Please try again."),
    }

  if (result.data.canceled) {
    return { ok: false, error: new Error("Document picking was canceled by the user.") }
  }

  const file = result.data.assets[0]

  return attempt(
    uploadDocument({
      original_filename: file.name,
      document_type: "other",
      document_file: file,
    })
  )
}

/*
 * utitlity for scanning function
 * **/
export async function scanDocument(): Promise<Result<AnalysisResponse, Error>> {
  const result = await attempt(
    ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    })
  )

  if (!result.ok)
    return {
      ok: false,
      error: new Error("Failed to launch camera. Please try again."),
    }

  if (result.data.canceled || !result.data.assets?.[0]) {
    return { ok: false, error: new Error("Scan was canceled or no image was returned.") }
  }

  const file = result.data.assets[0]

  return attempt(
    uploadDocument({
      original_filename: file.fileName ?? "scanned_image.jpg",
      document_type: "other",
      document_file: file,
    })
  )
}
