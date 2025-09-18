import { Camera, Upload } from "lucide-react-native"
import { Fonts, FontSizes } from "@/constants"
import Animated, { FadeInDown } from "react-native-reanimated"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

import type { ColorsType } from "@/hooks/useTheme"

export default function UploadOptions({
   colors,
   onDocumentScan,
   onDocumentUpload,
}: {
   colors: ColorsType
   onDocumentScan: () => void
   onDocumentUpload: () => void
}) {
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
               onPress={onDocumentScan}
            >
               <View style={styles.uploadIcon}>
                  <Camera size={24} color={colors.primary} />
               </View>
               <Text style={[styles.uploadText, { color: colors.text }]}>Scan Docs</Text>
            </TouchableOpacity>

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
