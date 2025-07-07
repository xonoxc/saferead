import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native"
import { Link, router } from "expo-router"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/Button"
import { GoogleSignInButton } from "@/components/GoogleSignInButton"
import { TextInput } from "@/components/TextInput"
import { Fonts, FontSizes } from "@/constants/Fonts"

export default function RegisterScreen() {
  const { colors } = useTheme()
  const { register, loginWithGoogle } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await register(formData.email, formData.password, formData.firstName, formData.lastName)
      router.replace("/(tabs)")
    } catch (error) {
      Alert.alert("Registration Failed", "Please try again")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    try {
      await loginWithGoogle()
      router.replace("/(tabs)")
    } catch (error) {
      Alert.alert("Google Sign Up Failed", "Please try again")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
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
          <GoogleSignInButton onPress={handleGoogleSignUp} loading={isGoogleLoading} fullWidth />

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>
              or sign up with email
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <TextInput
                label="First Name"
                value={formData.firstName}
                onChangeText={value => updateFormData("firstName", value)}
                placeholder="Enter your first name"
                error={errors.firstName}
              />
            </View>
            <View style={styles.nameField}>
              <TextInput
                label="Last Name"
                value={formData.lastName}
                onChangeText={value => updateFormData("lastName", value)}
                placeholder="Enter your last name"
                error={errors.lastName}
              />
            </View>
          </View>

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={value => updateFormData("email", value)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
          />

          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={value => updateFormData("password", value)}
            placeholder="Enter your password"
            secureTextEntry
            error={errors.password}
          />

          <TextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={value => updateFormData("confirmPassword", value)}
            placeholder="Confirm your password"
            secureTextEntry
            error={errors.confirmPassword}
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
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
