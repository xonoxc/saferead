import Animated from "react-native-reanimated"
import { Fonts, FontSizes } from "@/constants"
import {
   View,
   StyleSheet,
   Text,
   type NativeScrollEvent,
   type NativeSyntheticEvent,
} from "react-native"

import { UserSpaceDocumentCard } from "@/components/documents/UserSpaceDocumentCard"

interface SpaceRecentDocumentListProps {
   documents: any[]
   colors: { text: string; background: string }
   spaceColor: string
   onPin?: (documentId: string, documentFile: string) => void
   onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

export default function SpaceRecentDocumentList({
   documents,
   colors,
   spaceColor,
   onPin,
   onScroll,
}: SpaceRecentDocumentListProps) {
   return (
      <View style={styles.documentsContainer}>
         <Text style={[styles.documentsTitle, { color: colors.text }]}>Recent Documents</Text>
         <Animated.FlatList
            data={documents}
            renderItem={({ item }) => (
               <UserSpaceDocumentCard document={item} spaceColor={spaceColor} onPin={onPin} />
            )}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            contentContainerStyle={styles.documentsList}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   documentsContainer: {
      flex: 1,
      paddingHorizontal: 20,
   },
   documentsList: {
      paddingBottom: 100,
   },
   documentsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
   },
   documentsTitle: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.semiBold,
      marginBottom: 10,
   },
})
