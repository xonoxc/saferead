import { View } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { type DocumentType, DocumentTypeSelector } from "../documents/DocumentTypeSelector"

import UploadOptions from "./UploadOptions"
import RecentDocumentListings from "./DocumentListings"

import type { SetStateFunction } from "@/types/state"
import type { ColorsType } from "@/hooks/useTheme"
import type { ViewType } from "@/types/view"
import type { AnalysisResponse } from "@/types/api/documents.types"

interface AnalyizeDefaultContentProps {
  colors: ColorsType
  selectedDocType: DocumentType
  recentDocuments: AnalysisResponse[]
  ViewType: ViewType
  onDocumentSelectType: SetStateFunction<DocumentType>
  onDocumentScan: () => void
  onDocumentUpload: () => void
  onSetViewType: SetStateFunction<ViewType>
  onRecentDocumentPress: (item: AnalysisResponse) => void
}

export default function AnalyizeDefaultContent({
  colors,
  selectedDocType,
  recentDocuments,
  ViewType,
  onDocumentSelectType,
  onSetViewType,
  onDocumentScan,
  onDocumentUpload,
  onRecentDocumentPress,
}: AnalyizeDefaultContentProps) {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Document Type Selector */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <DocumentTypeSelector selectedType={selectedDocType} onSelect={onDocumentSelectType} />
      </Animated.View>

      {/* Upload Options */}
      <UploadOptions
        colors={colors}
        onDocumentUpload={onDocumentUpload}
        onDocumentScan={onDocumentScan}
      />

      {/* Recent Documents Section */}
      <RecentDocumentListings
        colors={colors}
        recentDocuments={recentDocuments}
        viewType={ViewType}
        setViewType={onSetViewType}
        onRecentDocumentPress={onRecentDocumentPress}
      />
    </View>
  )
}
