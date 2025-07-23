import { useState } from "react"
import { useForm } from "react-hook-form"
import {
  type ChangePasswordFormSchema,
  changePasswordFormSchema,
} from "@/utils/validation/change-password"
import { apiClient } from "@/utils/apiclient"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { attempt } from "@/utils/attempt"
import { useAuth } from "@/hooks/useAuth"

import { router } from "expo-router"

import { zodResolver } from "@hookform/resolvers/zod"
import { Alert } from "react-native"

export default function useChangePassScreen() {
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

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  }
}
