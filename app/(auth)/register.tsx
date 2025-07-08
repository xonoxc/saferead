import React from "react"
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native"
import { Link, router } from "expo-router"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/Button"
import { useForm, Controller } from "react-hook-form"
import { TextInput } from "@/components/TextInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { type RegisterFormData, registerSchema } from "@/utils/validation/register"

export default function RegisterScreen() {
  const { colors } = useTheme()
  const { register: registerUser } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.email, data.password, data.firstName, data.lastName)
      router.replace("/(tabs)")
    } catch (error) {
      Alert.alert("Registration Failed", "Please try again")
    }
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Join LegalAssist today
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="First Name"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter your first name"
                    error={errors.firstName?.message}
                  />
                )}
              />
            </View>
            <View style={styles.nameField}>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Last Name"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter your last name"
                    error={errors.lastName?.message}
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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Confirm Password"
                value={value}
                onChangeText={onChange}
                placeholder="Confirm your password"
                secureTextEntry
                error={errors.confirmPassword?.message}
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
  nameRow: {
    flexDirection: "row",
    gap: 16,
  },
  nameField: {
    flex: 1,
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
