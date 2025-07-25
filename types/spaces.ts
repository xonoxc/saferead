import type { BaseFilterOptions } from "./filter"

export type SpacePrivarcy = "public" | "private"

export interface SpaceFilterOptions extends BaseFilterOptions {
  privacy?: string
  is_favorite?: boolean
  is_active?: boolean
}
