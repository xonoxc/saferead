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
      <Animated.View entering={FadeInDown.delay(150)}>
         <TouchableOpacity
            onPress={onDocumentUpload}
            activeOpacity={0.85}
            style={[
               styles.chip,
               {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
               },
            ]}
         >
            <DocumentTypeSelector selectedType={selectedType} onSelect={onSelect} />

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={[styles.uploadAction, { backgroundColor: colors.primary + "15" }]}>
               <Upload size={14} color={colors.primary} />
               <Text style={[styles.text, { color: colors.primary }]}>Upload</Text>
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

      borderRadius: 12,
      borderWidth: 1,

      alignSelf: "flex-start",
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

      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
   },

   text: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.medium,
   },
})
