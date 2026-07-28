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
import { withAlpha } from "@/constants/Design"

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
                   * fields. Focus is then carried by the border colour plus a
                   * faint primary wash, which is enough now that the border is
                   * 1px and high-contrast.
                   *
                   * The wash replaces what used to be a shadow "focus ring".
                   * Toggling shadow* on a View that contains a TextInput makes
                   * Android rebuild that view's rendering layer, and the
                   * ReactEditText inside loses focus as it does - which fired
                   * onBlur, cleared isFocused, removed the shadow, and let the
                   * field take focus again, ping-ponging between the fields
                   * until the keyboard gave up and closed. Keep focus styling
                   * to properties that only repaint (colours), never ones that
                   * re-create the layer (shadow*, elevation, transform).
                   * **/
                  backgroundColor: isFocused && !error ? focusWash(colors.primary) : colors.card,
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
                  /*
                   * `editable === false`, not `!editable` - editable is
                   * undefined on every call site that does not opt out, and
                   * `!undefined` dimmed every field in the app to 50%.
                   * **/
                  rest.editable === false && { opacity: 0.5 },
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

/* A barely-there tint of the primary on the focused field, in place of
 * thickening the border - a border that changes width on focus shifts the text
 * inside it by a pixel. */
const focusWash = (primary: string) => withAlpha(primary, 0.08)

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
