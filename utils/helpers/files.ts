import { isReactNativeFile, type ReactNativeFile } from "@/types/file"
import { FileText, FileJson, File, FileImage, FileQuestion } from "lucide-react-native"

/*
 * Utility functions for handling file objects
 * **/
export function normalizeFile(
   file: any,
   fallbackName: string
): Blob | File | { uri: string; type: string; name: string } {
   if (file?.uri) {
      return {
         uri: file.uri,
         type: file.type || "image/jpeg",
         name: file.name || fallbackName,
      }
   }

   if (file instanceof File || file instanceof Blob) {
      return file as File
   }

   return new Blob([file], { type: "application/octet-stream" })
}

type FileInput = File | Blob | ReactNativeFile
type Extras = Record<string, any>

export function buildFileUploadFormData(
   fileKey: string,
   file: FileInput,
   options?: {
      originalFilename?: string
      extras?: Extras
   }
): FormData {
   const formData = new FormData()

   /*
    * attach file
    * */
   if (isReactNativeFile(file)) {
      formData.append(fileKey, {
         uri: file.uri,
         name: file.name ?? options?.originalFilename ?? "file",
         type: file.type ?? "application/octet-stream",
      } as any)
   } else if (file instanceof File || file instanceof Blob) {
      formData.append(fileKey, file, options?.originalFilename ?? "file")
   } else {
      throw new Error("Invalid file input. Must be a File, Blob, or ReactNativeFile")
   }

   /*
    * attach optional fields
    * **/
   if (options?.extras) {
      Object.entries(options.extras).forEach(([key, value]) => {
         if (value !== undefined && value !== null) {
            formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value))
         }
      })
   }

   return formData
}

export function getFileIcon(extension?: string) {
   if (!extension) return FileQuestion

   switch (extension.toLowerCase()) {
      case ".pdf":
         return FileText
      case ".json":
         return FileJson
      case ".png":
      case ".jpg":
      case ".jpeg":
         return FileImage
      case ".txt":
         return File
      default:
         return FileQuestion
   }
}
