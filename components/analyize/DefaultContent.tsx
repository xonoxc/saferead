import { StyleSheet, Dimensions } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { FadeInDown } from "react-native-reanimated"

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

const HEADER_HEIGHT = Dimensions.get("window").height * 0.4

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
  const scrollY = useSharedValue(0)

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y
    },
  })

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(scrollY.value, [0, HEADER_HEIGHT], [HEADER_HEIGHT, 0], "clamp"),
      opacity: interpolate(scrollY.value, [0, HEADER_HEIGHT / 2], [1, 0], "clamp"),
    }
  })

  const listAnimatedStyle = useAnimatedStyle(() => {
    const topOffset = interpolate(scrollY.value, [0, HEADER_HEIGHT], [HEADER_HEIGHT, 0], "clamp")
    return {
      paddingTop: topOffset,
    }
  })

  return (
    <Animated.ScrollView
      onScroll={onScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      {/* Animated Header */}
      <Animated.View
        style={[
          headerAnimatedStyle,
          { overflow: "hidden", position: "absolute", top: 0, left: 0, right: 0, zIndex: 1 },
        ]}
      >
        <LinearGradient colors={[colors.vio, colors.blueg]} style={styles.headerGradient}>
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <DocumentTypeSelector selectedType={selectedDocType} onSelect={onDocumentSelectType} />
          </Animated.View>

          <UploadOptions
            colors={colors}
            onDocumentUpload={onDocumentUpload}
            onDocumentScan={onDocumentScan}
          />
        </LinearGradient>
      </Animated.View>

      {/* Recent document listing */}
      <Animated.View style={[{ flex: 1, paddingHorizontal: 2 }, listAnimatedStyle]}>
        <RecentDocumentListings
          colors={colors}
          recentDocuments={recentDocuments}
          viewType={ViewType}
          setViewType={onSetViewType}
          onRecentDocumentPress={onRecentDocumentPress}
        />
      </Animated.View>
    </Animated.ScrollView>
  )
}

const styles = StyleSheet.create({
  headerGradient: {
    marginHorizontal: 6,
    marginTop: 13,
    borderRadius: 50,
    padding: 20,
    paddingTop: 40,
  },
})
