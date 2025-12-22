import * as ImagePicker from "expo-image-picker"
import { attempt } from "@/utils/attempt"
import type { Document } from "@/types"

export async function scanDocument() {
   const result = await attempt(() =>
      ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 1 })
   )
   if (!result.ok) {
      return failure("Failed to launch camera. Please try again.")
   }

   if (result.data.canceled) return canceled("Canceled scanning. Please try again.")

   if (!result.data.assets || result.data.assets.length === 0)
      return failure("No image captured. Please try again.")

   return success(result.data.assets[0])
}

function failure(message: string) {
   return {
      ok: false as const,
      error: new Error(message),
   }
}

function canceled(message: string) {
   return {
      ok: false as const,
      canceled: true,
      error: new Error(message),
   }
}

function success(file: ImagePicker.ImagePickerAsset) {
   const newDoc: Document = {
      id: Date.now().toString(),
      title: `Scanned Document ${new Date().toLocaleDateString()}`,
      type: "other",
      content: undefined,
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
      ok: true as const,
      data: {
         ...newDoc,
         uri: file.uri,
         type: file.mimeType || "image/jpeg",
         name: file.fileName,
         mimeType: file.mimeType || "image/jpeg",
      },
   }
}
