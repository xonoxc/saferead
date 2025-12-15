import { Upload } from "lucide-react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"

import {
   DocumentTypeSelector,
   type DocumentTypeSelectorProps,
} from "../documents/DocumentTypeSelector"

interface UploadChipProps extends DocumentTypeSelectorProps {
   onDocumentUpload: () => void
}

export function UploadChip({ onDocumentUpload, onSelect, selectedType }: UploadChipProps) {
   const { colors } = useTheme()

   return (
      <Animated.View
         entering={FadeInDown.delay(150)}
         style={{
            alignItems: "center",
         }}
      >
         <TouchableOpacity onPress={onDocumentUpload} activeOpacity={0.85} style={[styles.chip]}>
            <View style={styles.documentTypeSelector}>
               <DocumentTypeSelector selectedType={selectedType} onSelect={onSelect} />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={[styles.uploadAction, { backgroundColor: colors.primary + "15" }]}>
               <Upload size={20} color={colors.primary} />
            </View>
         </TouchableOpacity>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
      alignSelf: "center",
   },
   documentTypeSelector: {
      marginTop: 16,
   },

   divider: {
      width: 1,
      height: 18,
      opacity: 0.5,
   },

   uploadAction: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      padding: 10,

      borderRadius: 8,
   },
})
