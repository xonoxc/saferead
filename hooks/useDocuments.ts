import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as DocumentPicker from "expo-document-picker"
import * as ImagePicker from "expo-image-picker"
import { Document, DocumentAnalysis } from "@/types"

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setIsLoading(true)
      const stored = await AsyncStorage.getItem("documents")
      if (stored) {
        setDocuments(JSON.parse(stored))
      }
    } catch (err) {
      setError("Failed to load documents")
      console.error("Load documents error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const saveDocuments = async (docs: Document[]) => {
    try {
      await AsyncStorage.setItem("documents", JSON.stringify(docs))
    } catch (err) {
      console.error("Save documents error:", err)
    }
  }

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*", "text/*"],
        copyToCacheDirectory: true,
      })

      if (!result.canceled) {
        const file = result.assets[0]
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
    } catch (err) {
      setError("Failed to pick document")
      console.error("Pick document error:", err)
    }
  }

  const scanDocument = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== "granted") {
        setError("Camera permission required")
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (!result.canceled) {
        const image = result.assets[0]
        console.log("Scanned image:", image)
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
    } catch (err) {
      setError("Failed to scan document")
      console.error("Scan document error:", err)
    }
  }

  const analyzeDocument = async (docId: string): Promise<DocumentAnalysis> => {
    try {
      setIsLoading(true)
      // Simulate AI analysis
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

      const updatedDocs = documents.map(doc => (doc.id === docId ? { ...doc, analysis } : doc))
      setDocuments(updatedDocs)
      await saveDocuments(updatedDocs)

      return analysis
    } catch (err) {
      setError("Failed to analyze document")
      console.error("Analyze document error:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteDocument = async (docId: string) => {
    try {
      const updatedDocs = documents.filter(doc => doc.id !== docId)
      setDocuments(updatedDocs)
      await saveDocuments(updatedDocs)
    } catch (err) {
      setError("Failed to delete document")
      console.error("Delete document error:", err)
    }
  }

  return {
    documents,
    isLoading,
    error,
    pickDocument,
    scanDocument,
    analyzeDocument,
    deleteDocument,
    clearError: () => setError(null),
  }
}
