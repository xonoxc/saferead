import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Link, router } from "expo-router"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/Button"
import { useForm, Controller } from "react-hook-form"
import { TextInput } from "@/components/TextInput"
import { ErrorMessage } from "@/components/ErrorMessage"
import { zodResolver } from "@hookform/resolvers/zod"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { type RegisterFormData, registerSchema } from "@/utils/validation/register"

export default function RegisterScreen() {
  const { colors } = useTheme()
  const { registerUser } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password1: "",
      password2: "",
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    const response = await registerUser(data)
    if (!response.success) {
      setErrorMessage(response.message)
      return
    }
    router.replace("/(auth)/login")
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Join LegalAssist today
          </Text>
        </View>

        <View style={styles.form}>
          <ErrorMessage message={errorMessage} />
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="username"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter your username"
                    error={errors.username?.message}
                  />
                )}
              />
            </View>
          </View>

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

          <Controller
            control={control}
            name="password1"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Password"
                value={value}
                onChangeText={onChange}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password1?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password2"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Confirm Password"
                value={value}
                onChangeText={onChange}
                placeholder="Confirm your password"
                secureTextEntry
                error={errors.password2?.message}
              />
            )}
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              fullWidth
              size="large"
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account?{" "}
              <Link href="/(auth)/login" asChild>
                <Text style={[styles.link, { color: colors.primary }]}>Sign in</Text>
              </Link>
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
  form: {
    gap: 23,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    paddingHorizontal: 16,
  },
  nameRow: {
    flexDirection: "row",
    gap: 16,
  },
  nameField: {
    flex: 1,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 8,
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
  link: {
    fontFamily: Fonts.medium,
    textDecorationLine: "underline",
  },
})
