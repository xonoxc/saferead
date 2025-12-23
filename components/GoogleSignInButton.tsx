import React from "react"
import { Text, StyleSheet, View, ActivityIndicator, Pressable } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"

interface GoogleSignInButtonProps {
   onPress: () => void
   loading?: boolean
   disabled?: boolean
   fullWidth?: boolean
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
   onPress,
   loading = false,
   disabled = false,
   fullWidth = false,
}) => {
   const { colors } = useTheme()

   const GoogleIcon = () => (
      <View style={styles.iconContainer}>
         <View style={[styles.googleIcon, { backgroundColor: "#4285F4" }]}>
            <Text style={styles.googleIconText}>G</Text>
         </View>
      </View>
   )

   return (
      <Pressable
         style={[
            styles.button,
            {
               backgroundColor: colors.surface,
               borderColor: colors.border,
            },
            disabled && { opacity: 0.5 },
            fullWidth && styles.fullWidth,
         ]}
         onPress={onPress}
         disabled={disabled || loading}
      >
         {loading ? (
            <ActivityIndicator size="small" color={colors.textSecondary} />
         ) : (
            <>
               <GoogleIcon />
               <Text style={[styles.text, { color: colors.text }]}>Continue with Google</Text>
            </>
         )}
      </Pressable>
   )
}

const styles = StyleSheet.create({
   button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 12,
      borderWidth: 2,
      minHeight: 56,
      gap: 12,
   },
   fullWidth: {
      width: "100%",
   },
   iconContainer: {
      width: 24,
      height: 24,
   },
   googleIcon: {
      width: 24,
      height: 24,
      borderRadius: 4,
      justifyContent: "center",
      alignItems: "center",
   },
   googleIconText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontFamily: Fonts.bold,
   },
   text: {
      fontFamily: Fonts.semiBold,
      fontSize: FontSizes.md,
      textAlign: "center",
   },
})
