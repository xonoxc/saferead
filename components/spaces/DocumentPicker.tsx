import React from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { Controller } from "react-hook-form"
import { FileUpIcon } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { FontSizes, Fonts } from "@/constants/Fonts"

interface DocumentPickerProps {
   control: any
   errors: any
   onPress: () => void
}

export const DocumentPicker = ({ control, errors, onPress }: DocumentPickerProps) => {
   const { colors } = useTheme()

   return (
      <View>
         <Pressable
            onPress={onPress}
            style={[styles.picker, { borderColor: colors.border, backgroundColor: colors.card }]}
         >
            <Controller
               control={control}
               name="file"
               render={({ field }) => (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                     <FileUpIcon color={colors.textMuted} size={18} />
                     <Text
                        style={[
                           styles.pickerText,
                           { color: field.value ? colors.text : colors.textMuted },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="middle"
                     >
                        {field.value?.name ?? "Select a document"}
                     </Text>
                  </View>
               )}
            />
         </Pressable>
         {errors.file && <Text style={styles.error}>{errors.file.message}</Text>}
      </View>
   )
}

const styles = StyleSheet.create({
   picker: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      justifyContent: "center",
   },
   pickerText: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.medium,
      flex: 1,
   },
   error: {
      color: "#EF4444",
      marginTop: 2,
      marginBottom: 12,
      fontSize: FontSizes.sm,
   },
})
