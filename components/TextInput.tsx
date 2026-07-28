import React, { useState } from "react"
import {
   View,
   TextInput as RNTextInput,
   Text,
   StyleSheet,
   type StyleProp,
   type TextStyle,
   type ViewStyle,
   Pressable,
} from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, Radii, Spacing, Type } from "@/constants"
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

   /*
    * The focus/blur event shape is owned by react-native and has changed
    * between releases, so infer it from the underlying component's props
    * rather than naming a concrete event type that goes stale on upgrade.
    * **/
   const handleBlur: NonNullable<TextInputProps["onBlur"]> = e => {
      setIsFocused(false)
      rest.onBlur?.(e)
   }

   const handleFocus: NonNullable<TextInputProps["onFocus"]> = e => {
      setIsFocused(true)
      rest.onFocus?.(e)
   }

   const borderColor = error ? colors.error : isFocused ? colors.primary : colors.borderLight

   return (
      <View style={[styles.container, containerStyle]}>
         {label && (
            <Text style={[styles.label, { color: colors.textSecondary }, labelStyle]}>{label}</Text>
         )}

         <View
            style={[
               styles.inputWrapper,
               {
                  /*
                   * White/card while idle rather than the grey surface, so a
                   * form of inputs does not read as a stack of disabled
                   * fields. Focus is then carried by the border colour alone
                   * plus a faint ring, which is enough now that the border is
                   * 1px and high-contrast.
                   * **/
                  backgroundColor: colors.card,
                  borderColor,
               },
               isFocused && !error && { shadowColor: colors.primary, ...focusRing },
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

/* A soft halo on the focused field, in place of thickening the border - a
 * border that changes width on focus shifts the text inside it by a pixel. */
const focusRing = {
   shadowOpacity: 0.18,
   shadowRadius: 6,
   shadowOffset: { width: 0, height: 0 },
   elevation: 0,
} as const

const styles = StyleSheet.create({
   container: {
      marginVertical: Spacing.xxs,
      flex: 1,
   },
   label: {
      ...Type.caption,
      fontFamily: Fonts.medium,
      marginBottom: 6,
   },
   inputWrapper: {
      /*
       * 1px, not 2. A 2px border around every field is the single heaviest
       * line on a form, and at 15px radius it read as a rounded button rather
       * than something you type into.
       * **/
      borderWidth: 1,
      borderRadius: Radii.sm,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xxs,
      flexDirection: "row",
      alignItems: "center",
      minHeight: 48,
   },
   input: {
      flex: 1,
      ...Type.body,
      fontFamily: Fonts.regular,
      paddingHorizontal: Spacing.xxs,
      paddingVertical: 10,
   },
   leftIcon: {
      marginRight: Spacing.xxs,
   },
   rightIcon: {
      marginLeft: Spacing.xxs,
   },
   eyeIcon: {
      marginLeft: Spacing.xs,
   },
   error: {
      ...Type.caption,
      fontFamily: Fonts.medium,
      marginTop: 6,
   },
})
