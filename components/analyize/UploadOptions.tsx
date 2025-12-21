import { Upload } from "lucide-react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { View, TouchableOpacity, StyleSheet, Text } from "react-native"
import { useTheme } from "@/hooks/useTheme"

import {
   DocumentTypeSelector,
   type DocumentTypeSelectorProps,
} from "@/components/documents/DocumentTypeSelector"

interface UploadChipProps extends DocumentTypeSelectorProps {
   onDocumentUpload: () => void
}

export function UploadChip({ onDocumentUpload, onSelect, selectedType }: UploadChipProps) {
   const { colors } = useTheme()

   return (
      <Animated.View entering={FadeInDown.delay(150)} style={[styles.chipContainer]}>
         <View style={styles.documentTypeSelector}>
            <DocumentTypeSelector selectedType={selectedType} onSelect={onSelect} />
         </View>
         <View style={[styles.divider, { backgroundColor: colors.border }]} />

         <TouchableOpacity onPress={onDocumentUpload} activeOpacity={0.85} style={[styles.chip]}>
            <View
               style={[
                  styles.uploadAction,
                  { backgroundColor: colors.primary + "15", borderColor: colors.primary + "60" },
               ]}
            >
               <Upload size={18} color={colors.primary} />
               <Text style={{ color: colors.text }}>Upload</Text>
            </View>
         </TouchableOpacity>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   chipContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
   },
   chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingHorizontal: 4,
      paddingVertical: 8,
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
      borderWidth: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding: 14,

      borderRadius: 21,
   },
})
