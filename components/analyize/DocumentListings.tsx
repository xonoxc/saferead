import { FlatList, ScrollView, View, StyleSheet } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

import { RecentDocumentItem } from "../documents/RecentDocumentCard"
import ViewMode from "../spaces/ViewModeSetter"

import { Fonts, FontSizes } from "@/constants"
import { UploadChip } from "./UploadOptions"
import { useDocUpload } from "@/hooks/useDocUpload"

import type { ColorsType } from "@/hooks/useTheme"
import type { AnalysisResponse } from "@/types/api/documents.types"
import type { ViewType } from "@/types/view"

interface RecentDocumentListingProps {
   colors: ColorsType
   recentDocuments: AnalysisResponse[]
   viewType: ViewType

   setViewType: (type: ViewType) => void
   onRecentDocumentPress: (item: AnalysisResponse) => void
}

export default function RecentDocumentListings({
   colors,
   recentDocuments,
   setViewType,
   viewType,

   onRecentDocumentPress,
}: RecentDocumentListingProps) {
   const { selectedDocType, setSelectedDocType, handleDocumentUpload } = useDocUpload()
   /*
    *
    * rendering the recent document item
    * **/
   const renderRecentItem = ({ item }: { item: AnalysisResponse }) => (
      <RecentDocumentItem
         document={item}
         onPress={() => onRecentDocumentPress(item)}
         viewType={viewType}
      />
   )

   return (
      <View style={[styles.containerView, { backgroundColor: colors.background }]}>
         <UploadChip
            selectedType={selectedDocType}
            onSelect={setSelectedDocType}
            onDocumentUpload={handleDocumentUpload}
         />

         <View style={styles.viewToggle}>
            <ViewMode viewMode={viewType} setViewMode={setViewType} />
         </View>

         <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
         >
            {recentDocuments.length > 0 && (
               <Animated.View
                  entering={FadeInDown.delay(300).springify()}
                  style={styles.recentSection}
               >
                  <FlatList
                     data={recentDocuments.slice(0, 5)}
                     renderItem={renderRecentItem}
                     keyExtractor={item => item.id}
                     numColumns={viewType === "grid" ? 2 : 1}
                     key={viewType}
                     scrollEnabled={false}
                     columnWrapperStyle={viewType === "grid" ? { gap: 10 } : undefined}
                     contentContainerStyle={{ gap: 10 }}
                  />
               </Animated.View>
            )}
         </ScrollView>
      </View>
   )
}

const styles = StyleSheet.create({
   containerView: {
      flex: 1,
      marginTop: 10,
   },
   scrollContent: {
      flex: 1,
   },
   recentSection: {
      marginBottom: 32,
      paddingHorizontal: 12,
   },

   recentHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      marginHorizontal: 12,
      marginBottom: 20,

      paddingVertical: 12,
      paddingHorizontal: 14,

      borderRadius: 14,
   },
   headerLeft: {
      alignItems: "center",
      gap: 10,
   },
   iconWrapper: {
      height: 28,
      width: 28,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
   },
   sectionTitle: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.semiBold,
      letterSpacing: 0.2,
   },
   viewToggle: {
      margin: 12,
      flexDirection: "row",
      alignItems: "center",
   },
})
