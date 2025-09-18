import z from "zod"

import type { DocumentPickerAsset } from "expo-document-picker"

export const uploadDocumentFormSchema = z.object({
   displayName: z.string().min(1, "Name is required"),
   documentType: z.string().min(1, "Please select a type"),
   file: z.custom<DocumentPickerAsset>().refine(f => f?.size && f.size <= 10 * 1024 * 1024, {
      message: "File must be smaller than 10MB",
   }),
})
