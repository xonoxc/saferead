import { useState } from "react"

import { Alert } from "react-native"
import { useTabBarVisibility } from "@/hooks/useTabBarVisiblitiy"
import { uploadDocument, AnalysisResponse } from "@/services/api"
import { attempt } from "@/utils/attempt"
import { useDocuments } from "@/hooks/useDocuments"
import { useBackendDocuments } from "@/hooks/useBackendDocuments"

import { useAuth } from "@/hooks/useAuth"

import type { DocumentType } from "@/components/documents"
import { useSpaceStore } from "@/store/useSpaceStore"

export function useAnalysis() {
  const { user } = useAuth()
  const { pickDocument, scanDocument } = useDocuments()
  const { documents: recentDocuments } = useBackendDocuments()
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

  return {
    user,
    isAnalyzing,
    analysisResult,
    handleItemPress,
    handleDocumentUpload,
    isSideBarOpen,
    setIsSideBarOpen,
    handleDocumentScan,
    handleAnalyzeDocument,
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
