import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Link, router } from "expo-router"
import { useTheme } from "@/hooks/useTheme"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/Button"
import { TextInput } from "@/components/TextInput"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { type EmailFormSchema, emailFormSchema } from "@/utils/validation/email"
import { apiClient } from "@/utils/apiclient"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { attempt } from "@/utils/attempt"
import { ModalLoadingSpinner } from "@/components/ModalLoadingSpinner"
import { useDrawerAlert } from "@/hooks/alerts/useAlert"

export default function ForgotPasswordScreen() {
  const { colors } = useTheme()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormSchema>({
    mode: "onChange",
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  })

  const showBottomAlert = useDrawerAlert()

  const onSubmit = async (data: EmailFormSchema) => {
    setIsSubmitting(true)
    const result = await attempt(apiClient.post("/auth/password/reset/", data))
    setIsSubmitting(false)

    if (!result.ok) {
      showBottomAlert({
        type: "error",
        title: "Error",
        message: getErrorMessage(result.error) || "Failed to send password reset link",
        actions: [{ text: "OK", style: "primary", onPress: () => {} }],
      })
      return
    }

    showBottomAlert({
      type: "success",
      title: "Check your email",
      message: "If an account with that email exists, we have sent a password reset link.",
      actions: [{ text: "OK", style: "primary", onPress: () => {} }],
    })
    router.back()
  }

  return (
    <>
      <ModalLoadingSpinner visible={isSubmitting} message="Sending reset link..." />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Forgot Password</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Enter your email to receive a reset link
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={errors.email?.message}
                />
              )}
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Send Reset Link"
                onPress={handleSubmit(onSubmit)}
                loading={isSubmitting}
                fullWidth
                size="large"
              />
            </View>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Remember your password?{" "}
                <Link href="/(auth)/login" asChild>
                  <Text style={[styles.link, { color: colors.primary }]}>Sign In</Text>
                </Link>
              </Text>
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
  footer: {
    marginTop: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
  link: {
    fontFamily: Fonts.medium,
    textDecorationLine: "underline",
  },
})
