import ViewMode from "../ViewModeSetter"
import SearchBar from "@/components/search/SearchBar"

import { StyleSheet, View, Text, Pressable } from "react-native"
import { Plus } from "lucide-react-native"
import { Fonts, FontSizes } from "@/constants"

import type { ColorsType } from "@/hooks/useTheme"
import type { SetStateFunction } from "@/types/state"
import type { ViewType } from "@/types/view"

interface SpaceScreenHeaderProps {
   colors: ColorsType
   viewMode: ViewType
   setViewMode: SetStateFunction<ViewType>
   searchQuery: string
   setSearchQuery: SetStateFunction<string>
   setCreateModalVisible: (visible: boolean) => void

   setShowFilter: (visible: boolean) => void
}

export default function SpaceScreenHeader({
   colors,
   viewMode,
   setViewMode,
   setSearchQuery,
   searchQuery,
   setCreateModalVisible,
   setShowFilter,
}: SpaceScreenHeaderProps) {
   return (
      <View style={styles.headerContainer}>
         <View style={styles.header}>
            <View style={{ width: "auto" }}>
               <Text style={[styles.titleText, { color: colors.text }]}>Spaces</Text>
            </View>
            <View style={styles.headerIcons}>
               <ViewMode viewMode={viewMode} setViewMode={setViewMode} />
               <Pressable
                  onPress={() => setCreateModalVisible(true)}
                  style={[styles.createButton, { backgroundColor: colors.primary }]}
               >
                  <Plus size={20} color={colors.background} />
               </Pressable>
            </View>
         </View>

         <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search spaces..."
            showFilter
            onFilterPress={() => setShowFilter(true)}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   headerContainer: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
   },
   titleText: {
      fontSize: FontSizes.xl,
      fontFamily: Fonts.bold,
      padding: 5,
   },
   headerIcons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
   },
   createButton: {
      padding: 8,
      borderRadius: 12,
   },
})
