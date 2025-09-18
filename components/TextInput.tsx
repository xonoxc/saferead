import React, { useState } from "react"
import {
   View,
   TextInput as RNTextInput,
   Text,
   StyleSheet,
   type StyleProp,
   type TextStyle,
   type ViewStyle,
   type NativeSyntheticEvent,
   type TextInputFocusEventData,
   Pressable,
} from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"
import { Eye, EyeOff } from "lucide-react-native"

interface TextInputProps extends React.ComponentProps<typeof RNTextInput> {
   label?: string
   error?: string
   containerStyle?: StyleProp<ViewStyle>
   labelStyle?: StyleProp<TextStyle>
   errorStyle?: StyleProp<TextStyle>
   leftAccessory?: React.ReactNode
   rightAccessory?: React.ReactNode
}

export const TextInput: React.FC<TextInputProps> = ({
   label,
   error,
   containerStyle,
   labelStyle,
   errorStyle,
   leftAccessory,
   rightAccessory,
   ...rest
}) => {
   const { colors } = useTheme()
   const [isFocused, setIsFocused] = useState(false)
   const [hide, setHide] = useState(true)

   const showToggle = rest.secureTextEntry && !rest.multiline

   const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false)
      rest.onBlur?.(e)
   }

   const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true)
      rest.onFocus?.(e)
   }

   const borderColor = error ? colors.error : isFocused ? colors.primary : colors.border

   return (
      <View style={[styles.container, containerStyle]}>
         {label && <Text style={[styles.label, { color: colors.text }, labelStyle]}>{label}</Text>}

         <View
            style={[
               styles.inputWrapper,
               {
                  backgroundColor: colors.surface,
                  borderColor,
               },
            ]}
         >
            {leftAccessory && <View style={styles.leftIcon}>{leftAccessory}</View>}

            <RNTextInput
               {...rest}
               style={[
                  styles.input,
                  {
                     color: colors.text,
                  },
                  rest.multiline && { textAlignVertical: "top" },
                  !rest.editable && { opacity: 0.5 },
                  rest.style,
               ]}
               secureTextEntry={showToggle && hide}
               onFocus={handleFocus}
               onBlur={handleBlur}
               placeholderTextColor={colors.textMuted}
            />

            {showToggle && (
               <Pressable style={styles.eyeIcon} onPress={() => setHide(prev => !prev)} hitSlop={8}>
                  {hide ? (
                     <EyeOff color={colors.textSecondary} size={20} />
                  ) : (
                     <Eye color={colors.textSecondary} size={20} />
                  )}
               </Pressable>
            )}

            {rightAccessory && <View style={styles.rightIcon}>{rightAccessory}</View>}
         </View>

         {error && <Text style={[styles.error, { color: colors.error }, errorStyle]}>{error}</Text>}
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      marginVertical: 4,
      flex: 1,
   },
   label: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.medium,
      marginBottom: 4,
   },
   inputWrapper: {
      borderWidth: 2,
      borderRadius: 15,
      paddingHorizontal: 12,
      paddingVertical: 4,
      flexDirection: "row",
      alignItems: "center",
      minHeight: 52,
   },
   input: {
      flex: 1,
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
      paddingHorizontal: 8,
      paddingVertical: 10,
   },
   leftIcon: {
      marginRight: 4,
   },
   rightIcon: {
      marginLeft: 4,
   },
   eyeIcon: {
      marginLeft: 8,
   },
   error: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
      marginTop: 6,
   },
})
