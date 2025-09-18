import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { useTheme } from "@/hooks/useTheme"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/Button"
import { TextInput } from "@/components/TextInput"
import { Fonts, FontSizes } from "@/constants/Fonts"
import {
   type ResetPasswordFormSchema,
   resetPasswordFormSchema,
} from "@/utils/validation/reset-password"
import { apiClient } from "@/utils/apiclient"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { attempt } from "@/utils/attempt"
import { ModalLoadingSpinner } from "@/components/ModalLoadingSpinner"
import { useDrawerAlert } from "@/hooks/alerts/useAlert"

export default function ResetPasswordScreen() {
   const { colors } = useTheme()
   const { uid, token } = useLocalSearchParams<{ uid: string; token: string }>()
   const [isSubmitting, setIsSubmitting] = useState(false)

   const showBottomAlert = useDrawerAlert()

   const {
      control,
      handleSubmit,
      formState: { errors },
   } = useForm<ResetPasswordFormSchema>({
      mode: "onChange",
      resolver: zodResolver(resetPasswordFormSchema),
      defaultValues: {
         new_password1: "",
         new_password2: "",
      },
   })

   const onSubmit = async (data: ResetPasswordFormSchema) => {
      if (!uid || !token) {
         showBottomAlert({
            type: "error",
            title: "Error",
            message: "Invalid password reset link. Please try again.",
            actions: [
               { text: "OK", style: "primary", onPress: () => router.push("/(auth)/login") },
            ],
         })
         return
      }

      setIsSubmitting(true)
      const payload = { ...data, uid, token }
      const result = await attempt(apiClient.post("/auth/password/reset/confirm/", payload))
      setIsSubmitting(false)

      if (!result.ok) {
         showBottomAlert({
            type: "error",
            title: "Error",
            message: getErrorMessage(result.error) || "Failed to reset password. Please try again.",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
         return
      }

      showBottomAlert({
         type: "success",
         title: "Success",
         message: "Your password has been reset successfully. Please sign in.",
         actions: [{ text: "OK", style: "primary", onPress: () => {} }],
      })
      router.push("/(auth)/login")
   }

   if (!uid || !token) {
      return (
         <View
            style={[
               styles.container,
               { backgroundColor: colors.background, justifyContent: "center" },
            ]}
         >
            <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: "center" }]}>
               Invalid password reset link.
            </Text>
         </View>
      )
   }

   return (
      <>
         <ModalLoadingSpinner visible={isSubmitting} message="Resetting password..." />
         <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
               <View style={styles.header}>
                  <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
                  <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                     Enter your new password below
                  </Text>
               </View>

               <View style={styles.form}>
                  <Controller
                     control={control}
                     name="new_password1"
                     render={({ field: { onChange, value } }) => (
                        <TextInput
                           label="New Password"
                           value={value}
                           onChangeText={onChange}
                           placeholder="Enter your new password"
                           secureTextEntry
                           error={errors.new_password1?.message}
                        />
                     )}
                  />

                  <Controller
                     control={control}
                     name="new_password2"
                     render={({ field: { onChange, value } }) => (
                        <TextInput
                           label="Confirm New Password"
                           value={value}
                           onChangeText={onChange}
                           placeholder="Confirm your new password"
                           secureTextEntry
                           error={errors.new_password2?.message}
                        />
                     )}
                  />

                  <View style={styles.buttonContainer}>
                     <Button
                        title="Reset Password"
                        onPress={handleSubmit(onSubmit)}
                        loading={isSubmitting}
                        fullWidth
                        size="large"
                     />
                  </View>
               </View>
            </View>
         </ScrollView>
      </>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   content: {
      flex: 1,
      padding: 24,
      paddingTop: 80,
      justifyContent: "center",
      minHeight: "100%",
   },
   header: {
      alignItems: "center",
      marginBottom: 40,
   },
   title: {
      fontSize: FontSizes.xxxl,
      fontFamily: Fonts.bold,
      textAlign: "center",
      marginBottom: 8,
   },
   subtitle: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.regular,
      textAlign: "center",
   },
   form: {
      gap: 24,
   },
   buttonContainer: {
      marginTop: 8,
   },
})
