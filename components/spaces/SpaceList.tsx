import React from "react"
import { useTheme } from "@/hooks/useTheme"
import { SpaceListGrid, SpaceListView } from "./SpaceListViews"

import type { Space } from "@/types"

export interface SpaceListProps {
   space: Space
   viewMode: "list" | "grid"
   onDelete: (id: string, name: string) => void
   onSpaceSelect: (space: Space) => void
}

export function SpaceList({ viewMode, ...props }: SpaceListProps) {
   const { colors } = useTheme()

   switch (viewMode) {
      case "grid":
         return <SpaceListGrid {...props} colors={colors} />

      default:
         return <SpaceListView {...props} colors={colors} />
   }
}
