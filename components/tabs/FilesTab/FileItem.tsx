import { Fonts } from "@/constants"
import { useTheme } from "@/hooks/useTheme"
import { Text, StyleSheet, TouchableOpacity } from "react-native"
import { useBrowserLink } from "@/hooks/browser/useBrowserLink"

import type { UserSpaceDocument } from "@/types/api/spaces.documents.types"

export default function FileItem({ item }: { item: UserSpaceDocument }) {
   const { colors } = useTheme()
   const openBrowserLink = useBrowserLink()

   const handleCardPress = async () => {
      if (item.document_file) {
         await openBrowserLink(item.document_file)
      }
   }

   return (
      <TouchableOpacity
         onPress={handleCardPress}
         style={[styles.itemContainer, { backgroundColor: colors.surface }]}
      >
         <Text style={[styles.itemTitle, { color: colors.text }]}>{item?.display_name}</Text>
         <Text style={[styles.itemSubtitle, { color: colors.secondary }]}>
            {new Date(item.created_at).toLocaleDateString()}
         </Text>
      </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
   itemContainer: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
   },
   itemTitle: {
      fontSize: 16,
      fontFamily: Fonts.bold,
   },
   itemSubtitle: {
      fontSize: 12,
      fontFamily: Fonts.regular,
      marginTop: 4,
   },
})
