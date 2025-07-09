import React from "react"
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native"
import { Link, router } from "expo-router"
import { useTheme } from "@/hooks/useTheme"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/Button"
import { TextInput } from "@/components/TextInput"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { type LoginFormSchema, loginFormSchema } from "@/utils/validation/login"

export default function LoginScreen() {
  const { colors } = useTheme()
  const { login } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormSchema>({
    mode: "onChange",
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormSchema) => {
    try {
      await login(data.email, data.password)
      router.replace("/(tabs)")
    } catch (error) {
      Alert.alert("Login Failed", "Invalid email or password")
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to your account
          </Text>
        </View>

        <View style={styles.form}>
          {/* 
          <GoogleSignInButton onPress={handleGoogleLogin} loading={isGoogleLoading} fullWidth />
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>
              or continue with email
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View> 
          */}

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
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Password"
                value={value}
                onChangeText={onChange}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password?.message}
              />
            )}
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              fullWidth
              size="large"
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Don&apos;t have an account?{" "}
              <Link href="/(auth)/register" asChild>
                <Text style={[styles.link, { color: colors.primary }]}>Sign up</Text>
              </Link>
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
