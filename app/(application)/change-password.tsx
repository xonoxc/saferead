import React, { useState } from "react"
import { View, StyleSheet, ScrollView, Alert } from "react-native"
import { router } from "expo-router"
import { useTheme } from "@/hooks/useTheme"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/Button"
import { TextInput } from "@/components/TextInput"
import { Fonts, FontSizes } from "@/constants/Fonts"
import {
  type ChangePasswordFormSchema,
  changePasswordFormSchema,
} from "@/utils/validation/change-password"
import { apiClient } from "@/utils/apiclient"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { attempt } from "@/utils/attempt"
import { useAuth } from "@/hooks/useAuth"
import { ModalLoadingSpinner } from "@/components/ModalLoadingSpinner"
import { SafeAreaView } from "react-native-safe-area-context"

export default function ChangePasswordScreen() {
  const { colors } = useTheme()
  const { logout } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormSchema>({
    mode: "onChange",
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      new_password1: "",
      new_password2: "",
    },
  })

  const onSubmit = async (data: ChangePasswordFormSchema) => {
    setIsSubmitting(true)
    const result = await attempt(apiClient.post("/auth/password/change/", data))
    setIsSubmitting(false)

    if (!result.ok) {
      Alert.alert("Error", getErrorMessage(result.error))
      return
    }

    Alert.alert("Success", "Your password has been changed successfully. Please sign in again.", [
      {
        text: "OK",
        onPress: async () => {
          await logout()
          router.replace("/(auth)/login")
        },
      },
    ])
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ModalLoadingSpinner visible={isSubmitting} message="Changing password..." />
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.content}>
            {/*
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>Change Password</Text>
            </View>
            */}
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
                  title="Change Password"
                  onPress={handleSubmit(onSubmit)}
                  loading={isSubmitting}
                  fullWidth
                  size="large"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontFamily: Fonts.bold,
    textAlign: "center",
  },
  form: {
    gap: 24,
  },
  buttonContainer: {
    marginTop: 8,
  },
})
