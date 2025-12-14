import Animated from "react-native-reanimated"
import RecentDocumentListings from "./DocumentListings"

import { type DocumentType } from "../documents/DocumentTypeSelector"

import type { SetStateFunction } from "@/types/state"
import type { ViewType } from "@/types/view"
import type { AnalysisResponse } from "@/types/api/documents.types"
import type { ThemedComponent } from "@/types/colored"

interface AnalyizeDefaultContentProps extends ThemedComponent {
   selectedDocType: DocumentType

   recentDocuments: AnalysisResponse[]
   ViewType: ViewType
   onDocumentSelectType: (doctype: DocumentType) => void
   onDocumentUpload: () => void
   onSetViewType: SetStateFunction<ViewType>
   onRecentDocumentPress: (item: AnalysisResponse) => void
}

export default function AnalyizeDefaultContent({
   colors,
   recentDocuments,
   ViewType,
   onSetViewType,
   onRecentDocumentPress,
}: AnalyizeDefaultContentProps) {
   return (
      <Animated.View style={[{ flex: 1, paddingHorizontal: 2 }]}>
         <RecentDocumentListings
            colors={colors}
            recentDocuments={recentDocuments}
            viewType={ViewType}
            setViewType={onSetViewType}
            onRecentDocumentPress={onRecentDocumentPress}
         />
      </Animated.View>
   )
}
