import * as DocumentPicker from "expo-document-picker"
import { attempt } from "../attempt"
import type { Document } from "@/types"

type PickDocumentResult =
   | {
        ok: true
        data: {
           uri: string
           type: string
           name: string
           mimeType?: string
           id: string
           title: string
           originalFormat: "pdf" | "image" | "text"
           fileSize: number
           createdAt: string
           updatedAt: string
           isEncrypted: boolean
           tags: string[]
           shared: boolean
           sharedWith: string[]
        }
     }
   | {
        ok: false
        error: Error
        canceled?: boolean
     }

/*
 *
 * Document Picker and Scanner Functions
 * **/
export async function pickDocument(): Promise<PickDocumentResult> {
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
         ok: false,
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
