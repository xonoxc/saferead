import type { BaseFilterOptions } from "./filter"

export interface ConversationFilterOptions extends BaseFilterOptions {
   is_active?: boolean
   page?: number
   space?: string
}
