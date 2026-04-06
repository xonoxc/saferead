import { View, Text, StyleSheet, FlatList } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { FileText, Upload } from "lucide-react-native"

import { Fonts, FontSizes } from "@/constants"
import { AnalysisCard } from "./AnalysisCard"
import { UploadChip } from "./UploadOptions"
import { useDocUpload } from "@/hooks/useDocUpload"
import type { ColorsType } from "@/hooks/useTheme"
import type { AnalysisResponse } from "@/types/api/documents.types"

interface AnalysisFeedProps {
   colors: ColorsType
   documents: AnalysisResponse[]
   onDocumentPress: (doc: AnalysisResponse) => void
}

export function AnalysisFeed({ colors, documents, onDocumentPress }: AnalysisFeedProps) {
   const { selectedDocType, setSelectedDocType, handleDocumentPick, handleAnalyze } = useDocUpload()

   const renderItem = ({ item, index }: { item: AnalysisResponse; index: number }) => (
      <AnalysisCard
         document={item}
         onPress={() => onDocumentPress(item)}
         colors={colors}
         index={index}
      />
   )

   const renderEmpty = () => (
      <View style={styles.emptyState}>
         <View style={[styles.emptyIcon, { backgroundColor: colors.surface }]}>
            <FileText size={32} color={colors.textMuted} />
         </View>
         <Text style={[styles.emptyTitle, { color: colors.text }]}>No analyses yet</Text>
         <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
            Upload a document to get started
         </Text>
      </View>
   )

   const renderHeader = () => (
      <View style={styles.feedHeader}>
         <View style={styles.feedTitleRow}>
            <Text style={[styles.feedTitle, { color: colors.text }]}>Analysis Feed</Text>
            <Text style={[styles.feedCount, { color: colors.textSecondary }]}>
               {documents.length} items
            </Text>
         </View>
         <UploadChip
            selectedType={selectedDocType}
            onSelect={setSelectedDocType}
            onDocumentUpload={handleDocumentPick}
            onAnalyze={handleAnalyze}
         />
      </View>
   )

   return (
      <Animated.View
         entering={FadeInDown.delay(200).springify()}
         style={[styles.container, { backgroundColor: colors.background }]}
      >
         <FlatList
            data={documents}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
         />
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   listContent: {
      paddingHorizontal: 16,
      paddingBottom: 100,
   },
   feedHeader: {
      paddingTop: 20,
      paddingBottom: 16,
   },
   feedTitleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
   },
   feedTitle: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.semiBold,
   },
   feedCount: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
   },
   emptyState: {
      alignItems: "center",
      paddingVertical: 48,
   },
   emptyIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
   },
   emptyTitle: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.semiBold,
      marginBottom: 4,
   },
   emptySub: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
   },
})
