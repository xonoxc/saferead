import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import * as DocumentPicker from "expo-document-picker"
import * as ImagePicker from "expo-image-picker"

import { Document } from "@/types"
import { attempt } from "@/utils/attempt"
import { apiClient } from "@/utils/apiclient"

type Store = {
  documents: Document[]
  isLoading: boolean
  error: string | null
}

type Actions = {
  fetchDocuments: () => Promise<void>
  addDocument: (document: Document) => void
  deleteDocument: (documentId: string) => Promise<void>
  pickDocument: () => Promise<void>
  scanDocument: () => Promise<void>
  analyzeDocument: (documentId: string) => Promise<void>
}

const initialState: Store = {
  documents: [],
  isLoading: false,
  error: null,
}

export const useDocumentStore = create(
  immer<Store & Actions>((set, get) => ({
    ...initialState,
    fetchDocuments: async () => {
      set({ isLoading: true, error: null })
      const result = await attempt(apiClient.get<Document[]>("/documents"))

      if (!result.ok) {
        set({ error: result.error.message, isLoading: false })
        return
      }

      const documents = result.data.data || []

      set({ documents, isLoading: false })
    },
    addDocument: (document: Document) => {
      set(state => {
        state.documents.push(document)
      })
    },
    deleteDocument: async documentId => {
      const result = await attempt(apiClient.delete(`/documents/${documentId}`))

      if (!result.ok) {
        set({ error: result.error.message })
        return
      }

      set(state => {
        state.documents = state.documents.filter((doc: Document) => doc.id !== documentId)
      })
    },
    pickDocument: async () => {
      const result = await attempt(
        DocumentPicker.getDocumentAsync({
          type: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ],
        })
      )

      if (!result.ok) {
        set({ error: result.error.message })
        return
      }

      const { canceled, assets } = result.data

      if (!canceled) {
        const [asset] = assets
        const formData = new FormData()
        formData.append("file", {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType,
        } as any)

        const result = await attempt(
          apiClient.post<Document>("/documents/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        )

        if (!result.ok) {
          set({ error: result.error.message })
          return
        }

        get().addDocument(document as any)
      }
    },
    scanDocument: async () => {
      const permissionRes = await attempt(ImagePicker.requestCameraPermissionsAsync())

      if (!permissionRes.ok) {
        set({ error: permissionRes.error.message })
        return
      }
      const permission = permissionRes.data

      if (!permission.granted) {
        set({ error: "Camera permission not granted." })
        return
      }

      const result = await attempt(
        ImagePicker.launchCameraAsync({
          mediaTypes: "images",
          allowsEditing: true,
          quality: 1,
        })
      )

      if (!result.ok) {
        set({ error: result.error.message })
        return
      }
      const { canceled, assets } = result.data

      if (!canceled) {
        const [asset] = assets
        const formData = new FormData()
        formData.append("file", {
          uri: asset.uri,
          name: "scan.jpg",
          type: "image/jpeg",
        } as any)

        const result = await attempt(
          apiClient.post<Document>("/documents/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        )

        if (!result.ok) {
          set({ error: result.error.message })
          return
        }

        get().addDocument(document as any)
      }
    },
    analyzeDocument: async documentId => {
      const result = await attempt(apiClient.post(`/documents/${documentId}/analyze`))

      if (!result.ok) {
        set({ error: result.error.message })
      }
    },
  }))
)
