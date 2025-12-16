import type { SpaceDetailsStat } from "@/hooks/screens/useSpaceDetailScreen"
import type { SectionListData } from "react-native"
import type { UserSpaceDocument } from "../api/spaces.documents.types"

export type TopBarItem = {
   kind: "topbar"
}

export type StatsItem = {
   kind: "stats"
   stats: SpaceDetailsStat[]
}

export type DocumentItem = UserSpaceDocument & {
   kind: "document"
}

export type SpaceItem = TopBarItem | StatsItem | DocumentItem

export type TopBarSection = SectionListData<SpaceItem> & {
   type: "topbar"
}

export type HeaderSection = SectionListData<SpaceItem> & {
   type: "header"
}

export type DocumentSection = SectionListData<SpaceItem> & {
   type: "documents"
   title: string
   pinned: boolean
}

export type SpaceSection = TopBarSection | HeaderSection | DocumentSection
