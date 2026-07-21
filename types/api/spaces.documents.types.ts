import type { PaginatedResponse } from "@/types/api/documents.types"

/*
 * State of the server-side pipeline that extracts a document's text and
 * indexes it for retrieval. A document is only answerable in chat once it
 * reaches "ready".
 * **/
export type DocumentProcessingStatus = "pending" | "processing" | "ready" | "failed"

export interface UserSpaceDocument {
   id: string
   space: string
   document_file: string
   document_type: "pdf" | "docx" | "txt" | "image" | "other"
   download_url?: string
   file_extension: string
   file_size: string
   display_name: string
   effective_name: string
   is_pinned: boolean
   notes: string
   tags: string[]
   processing_status: DocumentProcessingStatus
   processing_error: string
   created_at: string
   updated_at: string
}

export interface UserSpaceDocumentUpload {
   space: string
   document_file: any
   display_name?: string
}

export type PaginatedSpaceDocuments = PaginatedResponse<UserSpaceDocument>
