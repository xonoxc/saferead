import { useState } from "react"
import { Alert } from "react-native"
import { useTabBarVisibility } from "@/hooks/useTabBarVisiblitiy"
import { attempt } from "@/utils/attempt"
import { useAuth } from "@/hooks/useAuth"
import type { DocumentType } from "@/components/documents"
import { useSpaceStore } from "@/store/useSpaceStore"
import { AnalysisResponse } from "@/types/api/documents.types"

import { uploadDocument } from "@/services/api"

import * as DocumentPicker from "expo-document-picker"
import * as ImagePicker from "expo-image-picker"
import { useDocuments } from "./queries/docs"
import { Document } from "@/types"

export function useAnalysis() {
  const { user } = useAuth()

  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>("other")
  const [showTextInput, setShowTextInput] = useState(false)
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  const { selectedSpace, setSelectedSpace } = useSpaceStore()

  const { data, isLoading: isRecentDocumentsLoading } = useDocuments()
  const recentDocuments = data?.pages.flatMap(page => page.results) ?? []

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

  const handleAnalyzeDocument = async (document: any, docType: DocumentType) => {
    if (!user) {
      Alert.alert("Error", "Please log in to analyze documents")
      return
    }

    setIsAnalyzing(true)

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
      Alert.alert("Unsupported document format. Please try again.")

      setIsAnalyzing(false)
      return
    }

    const uploadResult = await attempt(
      uploadDocument({
        document_file: documentFile,
        original_filename: filename,
        document_type: docType,
      })
    )

    if (!uploadResult.ok) {
      Alert.alert(uploadResult.error.message || "Failed to analyze document")

      setIsAnalyzing(false)
      return
    }

    setAnalysisResult(uploadResult.data)

    setIsAnalyzing(false)
  }

  const handleDocumentUpload = async () => {
    if (!user) {
      Alert.alert("Error", "Please log in to upload documents")
      return
    }

    const result = await pickDocument()
    if (!result?.ok) {
      Alert.alert("Error", result?.error?.message)
      return
    }

    await handleAnalyzeDocument(result.data, selectedDocumentType)
  }

  const handleDocumentScan = async () => {
    if (!user) {
      Alert.alert("Error", "Please log in to scan documents")
      return
    }

    const result = await scanDocument()
    if (!result.ok) {
      Alert.alert("Error", result.error?.message)
      return
    }

    await handleAnalyzeDocument(result.data, selectedDocumentType)
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
    handleAnalyzeResult: handleAnalyzeDocument,
    selectedDocumentType,
    setAnalysisResult,
    setSelectedDocumentType,
    showTextInput,
    setShowTextInput,
    isRecentDocumentsLoading,
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
export async function pickDocument() {
  const result = await attempt(
    DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*", "text/*"],
      copyToCacheDirectory: true,
    })
  )
  if (!result.ok) {
    return {
      ok: false,
      error: new Error("Failed to pick document. Please try again."),
    }
  }

  if (!result.data.canceled && result.data.assets && result.data.assets.length > 0) {
    const file = result.data.assets[0]
    const newDoc: Document = {
      id: Date.now().toString(),
      title: file.name,
      type: "other",
      content: "",
      originalFormat: file.mimeType?.includes("pdf")
        ? "pdf"
        : file.mimeType?.includes("image")
          ? "image"
          : "text",
      fileSize: file.size || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEncrypted: false,
      tags: [],
      shared: false,
      sharedWith: [],
    }

    return {
      ok: true,
      data: {
        ...newDoc,
        uri: file.uri,
        type: file.mimeType || "application/octet-stream",
        name: file.name,
        mimeType: file.mimeType,
      },
    }
  }
}

/*
 * utitlity for scanning function
 * **/
export async function scanDocument() {
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

  const newDoc: Document = {
    id: Date.now().toString(),
    title: `Scanned Document ${new Date().toLocaleDateString()}`,
    type: "other",
    content: "",
    originalFormat: "image",
    fileSize: file.fileSize || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isEncrypted: false,
    tags: [],
    shared: false,
    sharedWith: [],
  }

  return {
    ok: true,
    data: {
      ...newDoc,
      uri: file.uri,
      type: file.mimeType || "image/jpeg",
      name: file.fileName,
      mimeType: file.mimeType || "image/jpeg",
    },
  }
}
