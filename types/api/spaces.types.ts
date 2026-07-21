import type { SpaceIconName } from "@/constants/spaceform"
import type { PaginatedResponse } from "./documents.types"
import type { UserSpaceDocument } from "./spaces.documents.types"

export interface Space {
   id: string
   title: string
   description: string
   color: string
   icon: SpaceIconName
   privacy: "private" | "public"
   is_active: boolean
   is_favorite: boolean
   document_count: number
   /* Number of chat threads in this space. Returned by the API but was missing here. */
   conversation_count: number
   recent_documents: UserSpaceDocument[]
   user_username: string
   created_at: string
   updated_at: string
   last_accessed: string
}

export type PaginatedSpaces = PaginatedResponse<Space>

/*
 * Shape returned by /user_space/spaces/{id}/stats/.
 * This is not a Space, despite what the old typing claimed.
 * **/
export interface SpaceStats {
   document_count: number
   conversation_count: number
   total_messages: number
   recent_activity: string
   created_at: string
}

export interface ToggleFavoriteSpace {
   title: string
   description: string
   color: string
   icon: string
   privacy: "private" | "public"
   is_active: boolean
   is_favorite: boolean
}
