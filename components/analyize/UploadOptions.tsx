import { Upload } from "lucide-react-native"
import { Fonts, FontSizes } from "@/constants"
import Animated, { FadeInDown } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import {
   DocumentTypeSelector,
   type DocumentTypeSelectorProps,
} from "../documents/DocumentTypeSelector"

interface UploadOptionsProps extends DocumentTypeSelectorProps {
   onDocumentUpload: () => void
}

export default function UploadOptions({
   onDocumentUpload,
   onSelect,
   selectedType,
}: UploadOptionsProps) {
   const { colors } = useTheme()

   return (
      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.uploadSection}>
         <View style={styles.uploadGrid}>
            <TouchableOpacity
               style={[
                  styles.uploadOption,
                  {
                     borderColor: colors.border,
                     backgroundColor: colors.background,
                  },
               ]}
               onPress={onDocumentUpload}
            >
               <DocumentTypeSelector selectedType={selectedType} onSelect={onSelect} />

               <View style={styles.uploadIcon}>
                  <Upload size={24} color={colors.secondary} />
               </View>
               <Text style={[styles.uploadText, { color: colors.text }]}>Upload File</Text>
            </TouchableOpacity>
         </View>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   uploadSection: {
      marginBottom: 24,
   },
   uploadGrid: {
      flexDirection: "row",
      gap: 12,
   },
   uploadOption: {
      flex: 1,
      borderRadius: 30,
      padding: 16,
      alignItems: "center",
      gap: 8,
   },
   uploadIcon: {
      width: 48,
      height: 48,
      borderRadius: 17,
      justifyContent: "center",
      alignItems: "center",
   },
   uploadText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.medium,
      textAlign: "center",
   },
})
