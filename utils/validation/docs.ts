import z from "zod"

import type { DocumentPickerAsset } from "expo-document-picker"

/*
 * File only.
 *
 * Display name and document type used to be required fields here. Both are now
 * derived from the uploaded file on the server (SpaceDocument.save()): asking
 * someone to name a file that already has a name, and to restate a type the
 * extension already states, was busywork that also let the two disagree.
 * **/
export const uploadDocumentFormSchema = z.object({
   file: z
      .custom<DocumentPickerAsset>(f => !!f, { message: "Pick a document to upload" })
      .refine(f => f?.size && f.size <= 10 * 1024 * 1024, {
         message: "File must be smaller than 10MB",
      }),
})
