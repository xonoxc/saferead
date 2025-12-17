import type { UserSpaceDocument } from "@/types/api/spaces.documents.types"
import type { SpaceDetailsStat } from "@/hooks/screens/useSpaceDetailScreen"
import type { SpaceSection } from "@/types/screens/spacedetailtscreen"

export function getSections(
   stats: SpaceDetailsStat[],
   pinnedDocuments: UserSpaceDocument[] = [],
   recentDocuments: UserSpaceDocument[] = []
): SpaceSection[] {
   return [
      {
         type: "topbar",
         data: [],
      },
      {
         type: "header",
         data: [
            {
               kind: "stats",
               stats,
            },
         ],
      },
      {
         type: "documents",
         title: "Pinned Documents",
         pinned: true,
         data: pinnedDocuments.map(doc => ({
            ...doc,
            kind: "document",
         })),
      },
      {
         type: "documents",
         title: "Recent Documents",
         pinned: false,
         data: recentDocuments.map(doc => ({
            ...doc,
            kind: "document",
         })),
      },
   ]
}
