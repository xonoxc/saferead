import Animated from "react-native-reanimated"
import RecentDocumentListings from "./DocumentListings"

import { type DocumentType } from "../documents/DocumentTypeSelector"

import type { StateControlProps } from "@/types/state"
import type { ViewType } from "@/types/view"
import type { AnalysisResponse } from "@/types/api/documents.types"
import type { ThemedComponent } from "@/types/colored"

interface AnalyizeDefaultContentProps extends ThemedComponent {
   selectedDocType: DocumentType

   recentDocuments: AnalysisResponse[]
   viewType: StateControlProps<ViewType>
   onDocumentSelectType: (value: DocumentType) => void
   onRecentDocumentPress: (item: AnalysisResponse) => void
}

export default function AnalyizeDefaultContent({
   colors,
   recentDocuments,
   viewType,
   onRecentDocumentPress,
}: AnalyizeDefaultContentProps) {
   return (
      <Animated.View style={[{ flex: 1, paddingHorizontal: 2 }]}>
         <RecentDocumentListings
            colors={colors}
            recentDocuments={recentDocuments}
            viewType={viewType.value}
            setViewType={viewType.onChange}
            onRecentDocumentPress={onRecentDocumentPress}
         />
      </Animated.View>
   )
}
