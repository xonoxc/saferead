import { useState, useEffect, createContext, use } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as DocumentPicker from "expo-document-picker"
import * as ImagePicker from "expo-image-picker"
import { Document, DocumentAnalysis } from "@/types"

import { attempt } from "@/utils/attempt"

const analysis: DocumentAnalysis = {
  summary:
    "This is a comprehensive legal document that outlines the terms and conditions for a service agreement.",
  keyTerms: [
    {
      term: "Liability",
      definition: "Legal responsibility for damages or losses",
      importance: "high",
      position: 150,
    },
    {
      term: "Termination",
      definition: "The end of the agreement",
      importance: "medium",
      position: 300,
    },
  ],
  riskAssessment: {
    overallRisk: "medium",
    risks: [
      {
        type: "Financial",
        description: "Potential liability exposure",
        severity: "medium",
        mitigation: "Consider insurance coverage",
      },
    ],
  },
  deadlines: [
    {
      date: "2024-12-31",
      description: "Contract renewal deadline",
      type: "review",
      daysRemaining: 30,
    },
  ],
  recommendations: [
    "Review liability clauses carefully",
    "Consider legal counsel for complex terms",
    "Set calendar reminders for important deadlines",
  ],
  sensitiveInfo: [
    {
      type: "email",
      content: "john.doe@example.com",
      position: 100,
      redacted: false,
    },
  ],
  sections: [
    {
      title: "Terms of Service",
      content: "This section outlines the basic terms...",
      analysis: "Standard terms that are generally favorable",
      importance: "high",
    },
  ],
}

interface DocumentsContextType {
  documents: Document[]
  isLoading: boolean
  error: string | null
  pickDocument: () => Promise<Document | undefined>
  scanDocument: () => Promise<Document | undefined>
  analyzeDocument: (docId: string) => Promise<DocumentAnalysis>
  deleteDocument: (docId: string) => Promise<void>
  clearError: () => void
}

const DocumentsContext = createContext<DocumentsContextType | null>(null)

export const DocumentsProvider = ({ children }: { children: React.ReactNode }) => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    setIsLoading(true)
    const storeExtractRes = await attempt(AsyncStorage.getItem("documents"))
    if (!storeExtractRes.ok) {
      setError("Failed to load documents from storage")
      setIsLoading(false)
      return
    }

    const stored = storeExtractRes.data
    if (stored) {
      setDocuments(JSON.parse(stored))
    }
    setIsLoading(false)
  }

  const saveDocuments = async (docs: Document[]) => {
    const response = await attempt(AsyncStorage.setItem("documents", JSON.stringify(docs)))
    if (!response.ok) {
      setError("Failed to save documents")
      console.error("Save documents error:", response.error)
    }
  }

  const pickDocument = async () => {
    const result = await attempt(
      DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*", "text/*"],
        copyToCacheDirectory: true,
      })
    )
    if (!result.ok) {
      setError("Failed to pick document")
      console.error("Pick document error:", result.error)
      return
    }

    if (!result.data.canceled) {
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

      const updatedDocs = [...documents, newDoc]
      setDocuments(updatedDocs)
      await saveDocuments(updatedDocs)
      return newDoc
    }
  }

  const scanDocument = async () => {
    const perm = await attempt(ImagePicker.requestCameraPermissionsAsync())
    if (!perm.ok || perm.data.status !== "granted") {
      setError("Camera permission required")
      return
    }

    const result = await attempt(
      ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })
    )

    if (!result.ok) {
      setError("Failed to scan document")
      console.error("Scan document error:", result.error)
      return
    }

    if (!result.data.canceled) {
      //const image = result.data.assets[0]
      const newDoc: Document = {
        id: Date.now().toString(),
        title: `Scanned Document ${new Date().toLocaleDateString()}`,
        type: "other",
        content: "",
        originalFormat: "image",
        fileSize: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEncrypted: false,
        tags: [],
        shared: false,
        sharedWith: [],
      }

      const updatedDocs = [...documents, newDoc]
      setDocuments(updatedDocs)
      await saveDocuments(updatedDocs)
      return newDoc
    }
  }

  const analyzeDocument = async (docId: string): Promise<DocumentAnalysis> => {
    setIsLoading(true)
    const updatedDocs = documents.map(doc => (doc.id === docId ? { ...doc, analysis } : doc))
    setDocuments(updatedDocs)
    await saveDocuments(updatedDocs)
    setIsLoading(false)
    return analysis
  }

  const deleteDocument = (docId: string) => {
    const updatedDocs = documents.filter(doc => doc.id !== docId)
    setDocuments(updatedDocs)
    return saveDocuments(updatedDocs)
  }

  return (
    <DocumentsContext.Provider
      value={{
        documents,
        isLoading,
        error,
        pickDocument,
        scanDocument,
        analyzeDocument,
        deleteDocument,
        clearError: () => setError(null),
      }}
    >
      {children}
    </DocumentsContext.Provider>
  )
}

export const useDocuments = () => {
  const context = use(DocumentsContext)
  if (!context) {
    throw new Error("useDocuments must be used within a DocumentsProvider")
  }
  return context
}
