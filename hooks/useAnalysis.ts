import { useState } from "react"
import { Alert } from "react-native"
import { useTabBarVisibility } from "@/hooks/useTabBarVisiblitiy"
import { attempt } from "@/utils/attempt"
import { useAuth } from "@/hooks/useAuth"
import { DocumentType } from "@/components/documents/DocumentTypeSelector"
import { useSpaceStore } from "@/store/useSpaceStore"
import { AnalysisResponse } from "@/types/api/documents.types"

import { uploadDocument } from "@/services/api"

import * as DocumentPicker from "expo-document-picker"
import * as ImagePicker from "expo-image-picker"
import { useDocuments } from "./queries/docs"
import { Document } from "@/types"
import { useAnalysisStore } from "@/store/useAnalysisStore"
import { router } from "expo-router"
import { useQueryClient } from "@tanstack/react-query"

export function useAnalysis() {
  const { user } = useAuth()

  const queryClient = useQueryClient()

  const analysisResult = useAnalysisStore(s => s.analysisResult)
  const setAnalysisResult = useAnalysisStore(s => s.setAnalysisResult)

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>("other")
  const [showTextInput, setShowTextInput] = useState(false)
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)

  const selectedSpace = useSpaceStore(s => s.selectedSpace)
  const setSelectedSpace = useSpaceStore(s => s.setSelectedSpace)

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
    } else {
      setAnalysisResult(uploadResult.data)

      router.push("/analysisres")
    }

    await Promise.all([
      queryClient.invalidateQueries({
        predicate: query => Array.isArray(query.queryKey) && query.queryKey[0] === "documents",
      }),
      queryClient.invalidateQueries({
        queryKey: ["document"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["documentStats"],
      }),
    ])

    setIsAnalyzing(false)
  }

  const handleDocumentUpload = async () => {
    if (!user) {
      Alert.alert("Error", "Please log in to upload documents")
      return
    }

    const result = await pickDocument()
    if (!result.ok) {
      if (result.canceled) return

      Alert.alert("Error", result.error?.message || "Failed to pick document", [
        {
          text: "OK",
          onPress: () => {},
        },
      ])
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
    router.push("/analysisres")
  }

  const handleSpaceClose = () => {
    setSelectedSpace(null)
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
    recentDocuments,
    handleSpaceClose,
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
    console.log("Document Picker Error:", result.error)
    return {
      ok: false,
      error: new Error("Failed to pick document. Please try again."),
    }
  }

  const isSelectionCanceled = result.data.canceled
  if (isSelectionCanceled) {
    return {
      ok: false,
      canceled: true,
      error: new Error("Document selection was canceled."),
    }
  }

  const assets = !!(result.data.assets && result.data.assets.length > 0)
  if (!assets) {
    return {
      ok: true,
      error: new Error("No document selected. Please try again."),
    }
  }

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

  const isCanceled = result.data.canceled
  if (isCanceled) {
    return {
      ok: false,
      canceled: true,
      error: new Error("Canceled scanning. Please try again."),
    }
  }

  const file = result.data.assets[0]
  if (!file) {
    return { ok: false, error: new Error("Scan was canceled or no image was returned.") }
  }

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
