import { Document } from "../index"
import { PaginatedResponse } from "./documents.types"

export type SpaceDocument = Document

export type PaginatedSpaceDocuments = PaginatedResponse<SpaceDocument>
