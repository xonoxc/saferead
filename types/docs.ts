import type { BaseFilterOptions } from "./filter"

export interface DocumentFilterOptions extends BaseFilterOptions {
   status?: string
   document_type?: string
   space?: string
   confidence_score_gte?: number
   confidence_score_lte?: number
}

export type AnalyzeDocument = FileDocument | TextDocument

export interface BaseDocument {
   title?: string
   name?: string | null
}

export interface FileDocument extends BaseDocument {
   uri: string
   type?: string
   mimeType?: string
}

export interface TextDocument extends BaseDocument {
   content: string
   uri?: never
   type?: never
   mimeType?: never
}

export function isFileDocument(document: AnalyzeDocument): document is FileDocument {
   return (document as FileDocument).uri !== undefined
}

export function isTextDocument(document: AnalyzeDocument): document is TextDocument {
   return (document as TextDocument).content !== undefined
}
